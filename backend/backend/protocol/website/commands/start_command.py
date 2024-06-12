"""
This module contains the StartCommand class.
"""

from backend.api.serializers import ResultSerializer

from .command import Command


class StartCommand(Command):
    """
    The StartCommand class is used to start a container on the runner.
    """

    @staticmethod
    def response(response: dict):
        
        for key in response:
            data = response[key]
            serializer = ResultSerializer(data=data)
            serializer.is_valid()
            serializer.save()