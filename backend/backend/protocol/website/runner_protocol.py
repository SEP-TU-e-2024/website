"""
This module containes the RunnerProtocol class.
"""

import logging

from protocol import Connection, Protocol

from .commands import Commands
from .commands.command import Command

logger = logging.getLogger("protocol.runner")


class RunnerProtocol(Protocol):
    """
    The protocol class used by the runners.
    """

    connection: Connection

    def __init__(self, connection: Connection):
        self.connection = connection

    def receive_command(self) -> tuple[Command, dict]:
        """
        Handles the incoming commands from the judge server.
        """

        message = Protocol.receive(self.connection)

        command_id = message["id"]
        command_name = message["command"]
        command_args = message["args"]

        logger.info(f"Received command: {command_name} with args: {command_args}")

        return command_id, command_name, command_args

    def handle_command(self, command_id: str, command_name: str, args: dict):
        """
        Handles the incoming commands from the judge server.
        """

        try:
            if command_name not in Commands.__members__:
                logger.error(f"Received unknown command: {command_name}")
                return

            command = Commands[command_name].value
            response = command.execute(args)
            message = {"id": command_id, "response": response}
            Protocol.send(self.connection, message)

            logger.info(f"Sent response: {response}")

        except Exception as e:
            if e is ConnectionResetError or e is ConnectionAbortedError:
                raise e

            logger.error(
                f"An unexpected error has occured while trying to execute command {command_name}!",
                exc_info=1,
            )
