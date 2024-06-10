"""
This module contains the parts of the protocol used by the judge.
"""

from .commands import Commands
from .judge_protocol import JudgeProtocol

__all__ = ["JudgeProtocol", "Commands"]