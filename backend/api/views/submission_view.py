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
from ..serializers import SubmissionSerializer
from rest_framework.views import APIView
from ..models import Submission

class SubmissionView(APIView):
    """
    This class is responsible for all submisisons of a user.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        submissions = Submission.objects.filter(user=user).all()
        serialized_submissions = SubmissionSerializer(submissions, many=True)
        return JsonResponse(serialized_submissions.data, safe=False, status=status.HTTP_200_OK)

