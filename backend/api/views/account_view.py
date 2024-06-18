# download_problem_view.py

import logging
import os

from azure.storage.blob import BlobServiceClient
from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ViewSet
from ..serializers import ProfileSerializer
from rest_framework.views import APIView

class AccountView(APIView):
    """
    This class is responsible for getting account information.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serialized_user = ProfileSerializer(user)
        return JsonResponse(serialized_user.data, status=status.HTTP_200_OK)

