import logging

from django.http import HttpResponseNotFound
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Results
from ..serializers import ResultSerializer


class ResultView(APIView):
    permission_classes = [IsAdminUser]

    logger = logging.getLogger(__name__)

    def post(self, request):
        """
        Saves the evalution results for a submission
        """

        # Checks validity of submitted data
        serializer = ResultSerializer(data=request.data, many=True)
        if not serializer.is_valid():
            for field, messages in serializer.errors.items():
                return Response({"error": messages}, status=status.HTTP_400_BAD_REQUEST)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=["GET"])
    def get(self, request):
        """
        Gets the evaluation results for a submission
        """

        if 'SubmissionId' not in request.data:
            return HttpResponseNotFound(content="No submission id found in request")
        
        results = Results.objects.all().filter(submission=request.data['SubmissionId'])
        if len(results) == 0:
            return HttpResponseNotFound(content="Could not find results for specified" +
                                        f"submission id {request.data['SubmissionId']}")
        
        # Results.objects.all().prefetch_related("submission")


