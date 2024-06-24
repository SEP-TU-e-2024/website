from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..data_processing.leaderboard_entry import LeaderboardEntry, LeaderboardEntrySerializer
from ..models import Submission, SpecifiedProblem


class LeaderboardEntryView(APIView):
    """Leaderboard entry view as end point to get data from"""

    def get(self, request, problem_id, submission_id:str) -> JsonResponse:
        """Get request to retrieve a leaderboard entry for a submission id."""

        # Get the submission from the id
        submission = Submission.objects.all().filter(id=submission_id)
        problem = SpecifiedProblem.objects.all().filter(id=problem_id)

        # Robustness check to see if submission exists
        if not submission.exists():
            return Response({'error':f"Submission with id {submission_id} was not found"},
                             status=status.HTTP_400_BAD_REQUEST)

        # Create a leaderboard entry for the submission
        serializer = LeaderboardEntrySerializer(LeaderboardEntry(problem.get(), submission.get()))
        
        # Send JsonResponse with the serialized data of the leaderboard entry
        return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)