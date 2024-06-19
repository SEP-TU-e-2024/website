"""
This module contains the StartCommand class.
"""

import logging

from .command import Command

logger = logging.getLogger("start_command")


class StartCommand(Command):
    """
    The StartCommand class is used to start a container on the runner.
    """
    success: bool
    results: dict = None
    cause: str = None

    def __init__(self):
        super().__init__(name="START")

    def response(self, response: dict):
        logger.info(f"Received response: {response}")
        self.success = response["status"] == "ok"

        if self.success:
            self.results = response["result"]
        else:
            self.cause = response["cause"]
