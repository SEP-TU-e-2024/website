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

HOST = "localhost"
PORT = 30000


def evaluate_submission(submission: Submission):
    print(f"Submission made: {submission}, {SubmissionSerializer(submission).data}")
    # {
    #     "id":"ef071ba8-34a7-4019-94d3-9015d7179db6",
    #     "problem_id":UUID("22220377-394c-4f3d-9910-68cf8ebf6943"),
    #     "submission_name":"abcdefgh",
    #     "created_at":"2024-06-10T07:58:19.203057Z",
    #     "is_verified":true,
    #     "is_downloadable":false
    # }

def initiate_protocol():
    print("protocol starting")
    logger.info("abcdef")

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.bind((HOST, PORT))
    sock.listen(1000)

    try:
        logger.info(f"Judge server started on {HOST}:{PORT}.")

        while True:
            client_socket, addr = sock.accept()

            logger.info(f"Incoming connection from {addr[0]} on port {addr[1]}.")
            thread = threading.Thread(
                target=_handle_connections, args=(client_socket, addr), daemon=True
            )
            thread.start()
    except KeyboardInterrupt:
        logger.info("Shutting down the judge server...")
        sock.shutdown(socket.SHUT_RDWR)
        sock.close()
        exit(0)


def _handle_connections(client_socket: socket.socket, addr: tuple[str, int]):
    """
    Sends commands to the runners.
    """

    ip, port = addr
    connection = Connection(ip, port, client_socket, threading.Lock())
    disconnected = False
    protocol = WebsiteProtocol(connection)

    try:
        # The first command is the first command that should be sent. It tests if the runner is connected correctly.
        protocol.send_command(Commands.CHECK, block=True)

        # TODO: Run until the runner or the judge closes the connection
        while True:
            pass

    except socket.timeout:
        logger.error(f"Runner with IP {ip} on port {port} timed out.")

    except ValueError as e:
        logger.error(f"Runner with IP {ip} on port {port} sent invalid init message. {e}")

    except OSError as e:
        if e.errno == errno.ENOTCONN:
            disconnected = True
            logger.error(f"Runner with IP {ip} on port {port} disconnected.")

    except Exception as e:
        logger.error(f"Unexpected error occured: {e}")

    finally:
        if not disconnected:
            client_socket.shutdown(socket.SHUT_RDWR)
            client_socket.close()
