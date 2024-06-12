"""
This module contains the StartCommand class.
"""

from .command import Command


class StartCommand(Command):
    """
    The StartCommand class is used to start a container on the runner.
    """

    @staticmethod
    def response(response: dict):
        print(f"Got START response: {response}")
        # ResultSerializer(data=)