"""
The main class of the website protocol server. It handles the connection to the judge server.
"""

import logging
import socket
import threading
from time import sleep

from .judge_test import JudgeProtocol
from .protocol import Connection

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("judge_handler")

class ProtocolHandler:
    ip: str
    port: int
    debug: bool
    threads: list[threading.Thread]
    connection: Connection
    protocol: JudgeProtocol

    def __init__(self, ip, port, debug=False):
        self.ip = ip
        self.port = port
        self.debug = debug
        self.threads = []

    def start(self):
        """
        Starts the connection to the judge server. In case of a unexpected disconnection, it retries to connect.
        """

        logger.info(f"Trying to connect to the Judge server at {self.ip}:{self.port} ...")

        while True:
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.connect((self.ip, self.port))
                self.connection = Connection(self.ip, self.port, sock, threading.Lock())
                self.protocol = JudgeProtocol(self.connection)
                self._handle_commands()

            except (ConnectionRefusedError, ConnectionResetError) as e:
                self.connection = None
                logger.info(f"Failed to connect to judge server. Retrying in 5 seconds... ({e})")
                sleep(5) # TODO hardcoded

            finally:
                self.stop()

    def _handle_commands(self):
        """
        Handles the incoming commands from the judge server.
        """

        while True:
            command_id, command_name, command_args = self.protocol.receive_command()
            thread = threading.Thread(
                target=self.protocol.handle_command,
                args=(command_id, command_name, command_args),
                daemon=True,
            )
            thread.start()
            self.threads.append(thread)

    def stop(self):
        """
        Closes the connection to the judge server.
        """

        for thread in self.threads:
            thread.join()
        self.threads.clear()
        if self.connection is not None:
            sock = self.connection.sock
            sock.shutdown(socket.SHUT_RDWR)
            sock.close()
        self.connection = None

if __name__ == "__main__":
    protocol_handler = ProtocolHandler("localhost", 30000)
    try:
        protocol_handler.start()
    except KeyboardInterrupt:
        logger.info("Shutting down the judge connection...")
        protocol_handler.stop()
        exit(0)
