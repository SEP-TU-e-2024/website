from abc import ABC, abstractmethod


class Command(ABC):
    """
    Base abstract class for commands.
    """

    @abstractmethod
    def response(self, response: dict):
        """
        Handles the response from the judge.
        """
        pass
