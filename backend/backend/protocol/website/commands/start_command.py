"""
This module contains the StartCommand class.
"""

import logging

from backend.api.serializers import ResultSerializer

from .command import Command

logger = logging.getLogger("start_command")


class StartCommand(Command):
    """
    The StartCommand class is used to start a container on the runner.
    """

    def __init__(self, submission, benchmark_instance):
        self.submission = submission
        self.benchmark_instance = benchmark_instance


    def response(self, response: dict):
        logger.info(f"Received response: {response}")

        results = response["results"]["results"]

        for metric in results.keys():
            data = {
                "submission": self.submission,
                "benchmark_instance": self.benchmark_instance,
                "metric": metric,
                "score": results["metric"],
            }
            
            serializer = ResultSerializer(data=data)
            serializer.is_valid()
            serializer.save()
