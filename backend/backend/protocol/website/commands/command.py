from abc import ABC, abstractmethod


class Command(ABC):
    """
    Base abstract class for commands.
    """

    @staticmethod
    @abstractmethod
    def response(response: dict):
        """
        Handles the response from the runner.
        """
        pass
