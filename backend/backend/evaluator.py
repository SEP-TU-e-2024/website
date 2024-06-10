import errno
import logging
import socket
import threading

from api.models import Submission
from api.serializers import SubmissionSerializer

from .protocol import Connection
from .protocol.website import Commands, WebsiteProtocol

logger = logging.getLogger("evaluator")
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

# Specify the host and port for the judge server
HOST = "localhost"
PORT = 30000


def evaluate_submission(submission: Submission):
    """Evaluate the submission"""
    print(f"Submission made: {submission}, {SubmissionSerializer(submission).data}")

def initiate_protocol():
    """Initiate the connection protocol"""
    logger.info("Starting listening TCP socket")

    # Initiate the listening TCP socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    # allows immediate re-bind of port after release (nice for development)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.bind((HOST, PORT))
    sock.listen(1)

    # Wait for an incoming connection from the judge on another thread
    thread = threading.Thread(target=establish_judge_connection, args=(sock,), daemon=True)
    thread.start()

    logger.info(f"Judge server started on {HOST}:{PORT}.")

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
        # The first command is the first command that should be sent. It tests if the judge is connected correctly.
        protocol.send_command(Commands.CHECK, block=True)

        # TODO: Run until the judge or the website closes the connection
        while True:
            pass

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
