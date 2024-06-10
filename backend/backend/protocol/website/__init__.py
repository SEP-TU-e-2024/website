"""
This module contains the parts of the protocol used by the judge.
"""

from .commands import Commands
from .website_protocol import WebsiteProtocol

__all__ = ["WebsiteProtocol", "Commands"]