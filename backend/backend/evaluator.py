import errno
import logging
import os
import socket
import threading
import uuid
from queue import Queue

from api.models import Submission
from azure.storage.blob import BlobServiceClient

from .protocol import Connection
from .protocol.website import Commands, WebsiteProtocol

logger = logging.getLogger("evaluator")

# Specify the host and port for the judge server
BIND_HOST = "0.0.0.0"
PORT = 30000

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
        container=os.getenv("AZURE_STORAGE_CONTAINER_VALIDATOR"), blob=submission.problem.category.validator.filepath
    )
    if not validator_blob.exists():
        raise ValueError("Validator Blob file does not exist")

    logger.info(f"Sending submission {submission.id} to judge for evaluation")

    # Send the submission to the judge for evaluation
    protocol.send_command(Commands.START,
                          cpus=submission.problem.evaluation_settings.cpu,
                          memory=10,
                          gpus=0,
                          time_limit=submission.problem.evaluation_settings.time_limit,
                          machine_type="Standard_B1s",
                          submission_type="code",
                          source_url=submission_blob.url,
                          validator_url=validator_blob.url)



def initiate_protocol():
    """Initiate the connection protocol"""
    logger.info("Starting listening TCP socket")

    # Initiate the listening TCP socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    # Allows immediate re-bind of port after release (nice for development)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.bind((BIND_HOST, PORT))
    # Set the backlog of unaccepted connections to 1.
    sock.listen(1)

    # Wait for an incoming connection from the judge on another thread
    thread = threading.Thread(target=establish_judge_connection, args=(sock,), daemon=True)
    thread.start()

    logger.info(f"Judge server started on {BIND_HOST}:{PORT}.")


def establish_judge_connection(sock: socket.socket):
    """Establishes a judge connection for the specified socket"""
    # TODO: allow for re-connection after disconnect

    logger.info("Waiting for Judge connection")
    client_socket, addr = sock.accept()
    logger.info(f"Accepted Judge connection from {addr}")

    ip, port = addr
    connection = Connection(ip, port, client_socket, threading.Lock())
    disconnected = False
    protocol = WebsiteProtocol(connection)

    try:
        # TODO TP: testing purposes, remove
        submission_id = uuid.UUID("a2938ac3-9a6b-4d88-a875-72f46ea913aa")
        submission = Submission.objects.get(id=submission_id)

        queue_evaluate_submission(submission)

        # Wait for submissions in the queue to be evaluated
        while True:
            submission = evaluation_queue.get()
            try:
                evaluate_submission(protocol, submission)
            except Exception:
                logger.error(f"Error evaluating submission with ID {submission.id}", exc_info=1)

    except socket.timeout:
        logger.error("Judge timed out.")

    except ValueError as e:
        logger.error(f"Judge sent invalid init message. {e}")

    except OSError as e:
        if e.errno == errno.ENOTCONN:
            disconnected = True
            logger.error("Judge disconnected.")

    except Exception as e:
        logger.error(f"Unexpected error occured: {e}")

    finally:
        if not disconnected:
            client_socket.shutdown(socket.SHUT_RDWR)
            client_socket.close()
