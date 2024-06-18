import logging
import os
import socket
import threading
import uuid
from queue import Queue
from time import sleep

from api.models import Submission
from azure.storage.blob import BlobServiceClient

from backend.api.serializers import EvaluationSettingSerializer, ResultSerializer

from .protocol import Connection
from .protocol.website import WebsiteProtocol
from .protocol.website.commands.start_command import StartCommand

logger = logging.getLogger("evaluator")

# Specify the host and port for the judge server
HOST = os.getenv("JUDGE_HOST", "localhost")
PORT = 30000

RETRY_WAIT = 5

evaluation_queue: Queue = Queue()


def queue_evaluate_submission(submission: Submission):
    evaluation_queue.put(submission)


def evaluate_submission(protocol: WebsiteProtocol, submission: Submission):
    """
    Evaluate the submission, waits for the result.
    """
    connection_string = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)

    # Get submission blob
    submission_blob = blob_service_client.get_blob_client(
        container=os.getenv("AZURE_STORAGE_CONTAINER_SUBMISSION"), blob=submission.filepath
    )
    if not submission_blob.exists():
        raise ValueError("Submission Blob file does not exist")

    # Get validator blob
    validator_blob = blob_service_client.get_blob_client(
        container=os.getenv("AZURE_STORAGE_CONTAINER_VALIDATOR"),
        blob=submission.problem.category.validator.filepath,
    )
    if not validator_blob.exists():
        raise ValueError("Validator Blob file does not exist")

    logger.info(f"Sending submission {submission.id} to judge for evaluation")

    benchmark_instance_urls = dict()
    for benchmark_instance in submission.problem.benchmark_instances.all():
        # Get benchmark instnace blob
        benchmark_instance_blob = blob_service_client.get_blob_client(
            container=os.getenv("AZURE_STORAGE_CONTAINER_SUBMISSION"), blob=benchmark_instance.filepath
        )
        if not benchmark_instance_blob.exists():
            raise ValueError("Benchmark instance Blob file does not exist")
        benchmark_instance_urls[benchmark_instance.id] = benchmark_instance_blob.url

    command = StartCommand()

    # Send the submission to the judge for evaluation
    protocol.send_command(
        command,
        block=True,
        evaluation_settings=EvaluationSettingSerializer(submission.problem.evaluation_settings).data,
        benchmark_instances=benchmark_instance_urls,
        submission_url=submission_blob.url,
        validator_url=validator_blob.url,
    )

    print(command.results)
    
    for benchmark_instance in command.results.keys():
        benchmark_results = command.results[benchmark_instance]['results']
        for metric in benchmark_results.keys():
            data = {
                "submission": submission,
                "benchmark_instance": benchmark_instance,
                "metric": metric,
                "score": benchmark_results[metric],
            }
            
            serializer = ResultSerializer(data=data)
            serializer.is_valid()
            serializer.save()


def initiate_protocol():
    """Initiate the connection protocol"""
    logger.info("Starting listening TCP socket")

    # Initiate the listening TCP socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # Wait for an incoming connection from the judge on another thread
    thread = threading.Thread(target=establish_judge_connection, args=(sock,), daemon=True)
    thread.start()


def establish_judge_connection(sock: socket.socket):
    """Establishes a judge connection for the specified socket"""
    # TODO: allow for re-connection after disconnect

    while True:
        disconnected = True

        try:
            sock.connect((HOST, PORT))
            logger.info(f"Connected to the Judge server at {HOST}:{PORT}.")
            
            connection = Connection(HOST, PORT, sock, threading.Lock())
            disconnected = False
            protocol = WebsiteProtocol(connection)

            # TODO TP: testing purposes, remove
            submission_id = uuid.UUID("a2938ac3-9a6b-4d88-a875-72f46ea913aa")
            submission = Submission.objects.get(id=submission_id)

            queue_evaluate_submission(submission)

            # Wait for submissions in the queue to be evaluated
            while True:
                submission = evaluation_queue.get()
                # TODO: what if submission evaluation failed, do we put it back in the queue?
                try:
                    thread = threading.Thread(target=evaluate_submission, args=(protocol, submission), daemon=True)
                    thread.start()
                except Exception:
                    logger.error(f"Error evaluating submission with ID {submission.id}", exc_info=1)

        except socket.timeout:
            logger.error("Judge timed out.")

        except (ConnectionRefusedError, ConnectionResetError) as e:
            connection = None
            disconnected = True
            logger.info(f"Failed to connect to Judge server. Retrying in 5 seconds... ({e})")
            sleep(RETRY_WAIT)

        except Exception as e:
            logger.error(f"Unexpected error occured: {e}")

        finally:
            if not disconnected:
                sock.shutdown(socket.SHUT_RDWR)
                sock.close()
                disconnected = True
