"""
This module contains the Commands class.
"""

from enum import Enum

from .check_command import CheckCommand
from .start_command import StartCommand


class Commands(Enum):
    """
    This class contains all the commands that the website can execute.
    """

    START = StartCommand()
    """
    Start a container on the runner.
    """

    CHECK = CheckCommand()
    """
    Check the status of the judge.
    """
