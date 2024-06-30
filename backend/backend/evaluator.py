import logging
import os
import queue
import socket
import threading
import uuid
from decimal import Decimal, getcontext
from time import sleep

from api.models import Submission
from api.serializers import EvaluationSettingSerializer, ResultSerializer
from azure.storage.blob import BlobServiceClient
from django.core.mail import EmailMessage
from django.template.loader import render_to_string

from .protocol import Connection
from .protocol.website import WebsiteProtocol
from .protocol.website.commands.start_command import StartCommand

logger = logging.getLogger("evaluator")

# Specify the host and port for the judge server
HOST = os.getenv("JUDGE_HOST", "localhost")
PORT = 30000

RETRY_WAIT = 5

evaluation_queue: queue.Queue = queue.Queue()

getcontext().prec = 8

def queue_evaluate_submission(submission: Submission):
    """
    Queues a submission for evaluation.
    """
    evaluation_queue.put(submission)


def evaluate_submission(protocol: WebsiteProtocol, submission: Submission):
    """
    Evaluate the submission, waits for the result.
    """
    connection_string = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)

    logger.info(f"Sending submission {submission.id} to judge for evaluation")

    # Initialize command and its arguments
    command = StartCommand()
    validator = submission.problem.category.validator
    benchmark_instances = submission.problem.benchmark_instances.all()
    benchmark_instance_urls = {
        str(benchamark_instance.id): benchamark_instance.get_blob(blob_service_client).url
        for benchamark_instance in benchmark_instances
    }

    # Send the submission to the judge for evaluation
    protocol.send_command(
        command,
        block=True,
        evaluation_settings=EvaluationSettingSerializer(
            submission.problem.evaluation_settings
        ).data,
        benchmark_instances=benchmark_instance_urls,
        submission_url=submission.get_blob(blob_service_client).url,
        validator_url=validator.get_blob(blob_service_client).url,
    )

    if command.success:
        # Handle results
        for benchmark_instance in command.results.keys():
            benchmark_results = command.results[benchmark_instance]["results"][0]
            # Store each received metric in the database
            for metric in submission.problem.metrics.all():
                # Skip saving result that is not present
                if metric.name not in benchmark_results:
                    continue

                data = {
                    "submission": submission.id,
                    "benchmark_instance": uuid.UUID(benchmark_instance),
                    "metric": metric.name,
                    "score": round(Decimal(benchmark_results[metric.name]), 2),
                }
                logger.info(f"Storing result: {repr(data)}")

                serializer = ResultSerializer(data=data)
                if not serializer.is_valid():
                    raise Exception(f"invalid result serializer data: {serializer.errors}")
                serializer.save()
    else:
        # Send email to user that submission failed
        text_causes = {
            "timeout": "The submission timed out.",
            "error": "A runtime error occurred during the submission evaluation.",
            "internal_error": "An internal error occurred during the submission evaluation.",
            "judge_internal_error": "An internal error occurred during the submission evaluation.",
        }

        text_cause = text_causes[command.cause]

        mail_subject = "Submission failure."
        message = render_to_string(
            "email_template_submission_fail.html",
            {
                "user": submission.user.name if submission.user.name is not None else "User",
                "submission": submission.name,
                "cause": text_cause,
            },
        )
        email = EmailMessage(
            mail_subject, message, from_email=os.getenv("EMAIL_FROM"), to={submission.user.email}
        )
        return email.send()


def initiate_protocol():
    """
    Initiate the connection protocol
    """
    logger.info("Initializing the connection protocol...")

    # Wait for an incoming connection from the judge on another thread
    thread = threading.Thread(target=establish_judge_connection, daemon=True)
    thread.start()


def establish_judge_connection():
    """
    Establishes a judge connection for the specified socket
    """

    while True:
        disconnected = True

        try:
            # Initiate the listening TCP socket
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

            logger.info(f"Trying to connect to the Judge server at {HOST}:{PORT}...")
            sock.connect((HOST, PORT))
            logger.info(f"Connected to the Judge server at {HOST}:{PORT}.")

            connection = Connection(HOST, PORT, sock, threading.Lock())
            disconnected = False
            protocol = WebsiteProtocol(connection)

            # Create an event to wait for the protocol to disconnect
            event = threading.Event()

            # Start taking in submissions
            thread = threading.Thread(target=handle_submissions, args=(protocol, event), daemon=True)
            thread.start()

            # Called when the protocol disconnects
            def on_close(event: threading.Event):
                logger.info("Judge connection closed.")
                event.set()
                thread.join()

            protocol.set_close_listener(on_close, (event, ))

            # Wait for the protocol to disconnect
            event.wait()
        except socket.timeout:
            logger.error("Judge timed out.")

        except (ConnectionRefusedError, ConnectionResetError) as e:
            connection = None
            disconnected = True
            logger.info(f"Failed to connect to Judge server. Retrying in 5 seconds... ({e})")
            sleep(RETRY_WAIT)

        except Exception:
            logger.error("An unexpected error has occurred.", exc_info=1)

        finally:
            try:
                if not disconnected:
                    sock.shutdown(socket.SHUT_RDWR)
                    sock.close()
                    disconnected = True
            except Exception:
                logger.error("Failed to close the socket", exc_info=1)


def handle_submissions(protocol: WebsiteProtocol, event: threading.Event):
    """
    Takes evaluation requests from the queue, and submits them to the judge.
    """
    while not event.is_set():
        try:
            submission = evaluation_queue.get(timeout=1)
        except queue.Empty:
            continue

        # TODO: what if submission evaluation failed, do we put it back in the queue?
        try:
            thread = threading.Thread(
                target=evaluate_submission, args=(protocol, submission), daemon=True
            )
            thread.start()
        except Exception:
            logger.error(f"Error evaluating submission with ID {submission.id}", exc_info=1)
