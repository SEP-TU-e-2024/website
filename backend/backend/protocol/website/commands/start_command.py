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

    def response(self, response: dict):
        logger.info(f"Received response: {response}")
        # # TODO: See if it is better to have this as a class variable
        # submission = response["submission"]
        # # TODO: See if it is better to have this as a class variable
        # benchmark_instance = response["benchmark_instance"]

        # for metric in response["metrics"]:
        #     score = response[metric]["score"]

        #     data = {
        #         "submission": submission,
        #         "benchmark_instance": benchmark_instance,
        #         "metric": metric,
        #         "score": score,
        #     }
            

        #     serializer = ResultSerializer(data=data)
        #     serializer.is_valid()
        #     serializer.save()
