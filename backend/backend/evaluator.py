import logging
import os
import socket
import threading
import uuid
from queue import Queue
from time import sleep

from api.models import Submission
from azure.storage.blob import BlobServiceClient

from .protocol import Connection
from .protocol.website import Commands, WebsiteProtocol

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

    # Send the submission to the judge for evaluation
    protocol.send_command(
        Commands.START,
        cpus=submission.problem.evaluation_settings.cpu,
        memory=10,  # TODO: memory amount
        gpus=0,  # TODO: GPU amount
        time_limit=submission.problem.evaluation_settings.time_limit,
        machine_type="Standard_B1s",  # TODO: machine type
        submission_type="code",  # TODO: submission type
        source_url=submission_blob.url,
        validator_url=validator_blob.url,
    )


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
                    evaluate_submission(protocol, submission)
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
