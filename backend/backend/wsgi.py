"""
WSGI config for backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

from backend.evaluator import initiate_protocol

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

# Start the Backend <-> Judge protocol
initiate_protocol()

application = get_wsgi_application()
