"""
This module contains the Commands class.
"""

from enum import Enum

from .check_command import CheckCommand
from .start_command import StartCommand


class Commands(Enum):
    """
    Enum that contains all the available commands for the runner.
    """

    START = StartCommand()
    """
    Start a container on the runner.
    """

    CHECK = CheckCommand()
    """
    Checks the status of the runner.
    """
