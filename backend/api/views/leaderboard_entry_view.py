from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..data_processing.leaderboard_entry import LeaderboardEntry, LeaderboardEntrySerializer
from ..models import Submission


class LeaderboardEntryView(APIView):

    def get(self, request, submission_id:int) -> JsonResponse:
        submission = Submission.objects.all().filter(id=submission_id)

        if not submission.exists():
            # f"Submission with id {submission_id} was not found"
            return Response({}, status=status.HTTP_400_BAD_REQUEST)

        serializer = LeaderboardEntrySerializer(LeaderboardEntry(submission.get()))
        
        return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)