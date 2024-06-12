"""
This module contains the StartCommand class.
"""

from .command import Command
from backend.api.serializers import ResultSerializer


class StartCommand(Command):
    """
    The StartCommand class is used to start a container on the runner.
    """

    @staticmethod
    def response(response: dict):
        
        ResultSerializer(data=)