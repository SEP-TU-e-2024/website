from abc import ABC, abstractmethod


class Command(ABC):
    """
    Base abstract class for commands.
    """

    name: str
    """
    The name of this packet, e.g. `START`.
    """

    def __init__(self, name: str):
        self.name = name

    @abstractmethod
    def response(self, response: dict):
        """
        Handles the response from the judge.
        """
        pass
