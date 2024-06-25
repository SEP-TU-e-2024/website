"""
This module contains the WebsiteProtocol class.
"""

import logging
import threading
from queue import Queue

from .. import Connection, Protocol
from .commands import Command

logger = logging.getLogger("protocol.website")


class WebsiteProtocol(Protocol):
    """
    The protocol class used by the website server.
    """

    connection: Connection
    queue_dict_lock: threading.Lock
    queue_dict: dict[str, Queue[dict]]
    receiver_thread: threading.Thread

    def __init__(self, connection: Connection):
        self.connection = connection
        self.queue_dict_lock = threading.Lock()
        self.queue_dict: dict[str, Queue[dict]] = {}

        self.receiver_thread = threading.Thread(target=self._receiver, daemon=True)
        self.receiver_thread.start()

    def _receiver(self):
        """
        Receives and handles responses from the judge.
        """

        while True:
            message_id, response = self._receive_response()

            with self.queue_dict_lock:
                if message_id not in self.queue_dict:
                    logger.error(
                        f"Received response from judge with unknown message id: {message_id}"
                    )
                    continue
                self.queue_dict[message_id].put(response)

    def send_command(self, command: Command, block: bool = False, **kwargs):
        """
        Sends a given command with the given arguments to the judge.
        """

        if block:
            self._send_command(command, **kwargs)
            return

        threading.Thread(
            target=self._send_command, args=(command,), kwargs=kwargs, daemon=True
        ).start()

    def _send_command(self, command: Command, **kwargs):
        """
        Send command to the judge and wait for the response.
        """

        try:
            counter = self.connection.message_counter
            message = {"id": counter.generate(), "command": command.name, "args": kwargs}

            queue = Queue()
            with self.queue_dict_lock:
                self.queue_dict[message["id"]] = queue

            Protocol.send(self.connection, message)
            logger.info(
                f"Sent command {command.name} with args {kwargs} to the judge"
            )
            response = queue.get()

            command.response(response)

        except Exception:
            logger.error(
                "Error occured while trying to execute a command for the judge",
                exc_info=1,
            )

        finally:
            with self.queue_dict_lock:
                del self.queue_dict[message["id"]]

    def _receive_response(self) -> tuple[str, dict]:
        """
        Receives a response from the judge.
        """

        message = Protocol.receive(self.connection)

        if message["response"] is None:
            raise ValueError("Received message with missing response!")

        response = message["response"]

        if message["id"] is None:
            raise ValueError("Received message with missing id!")

        message_id = message["id"]

        return message_id, response
