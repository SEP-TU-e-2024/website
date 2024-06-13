"""
This module contains the CheckCommand class.
"""

from .command import Command


class CheckCommand(Command):
    """
    The CheckCommand class is used to check the status of the runner.
    """

    def response(self, response: dict):
        if response["status"] is None:
            raise ValueError("Received message with missing status!")

        status = response["status"]

        if status != "ok":
            raise ValueError(f'Unexpected response! Expected "ok" and got "{status}"')
