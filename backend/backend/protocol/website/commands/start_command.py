"""
This module contains the StartCommand class.
"""

from backend.api.models import Metric
from backend.api.serializers import ResultSerializer

from .command import Command


class StartCommand(Command):
    """
    The StartCommand class is used to start a container on the runner.
    """

    @staticmethod
    def response(response: dict):
        # TODO: See if it is better to have this as a class variable
        submission = response["submission"]
        # TODO: See if it is better to have this as a class variable
        benchmark_instance = response["benchmark_instance"]

        for metric in response["metrics"]:
            score = response[metric]["score"]

            data = {
                "submission": submission,
                "benchmark_instance": benchmark_instance,
                "metric": metric,
                "score": score,
            }

            serializer = ResultSerializer(data=data)
            serializer.is_valid()
            serializer.save()
