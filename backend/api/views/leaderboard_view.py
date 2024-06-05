from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..data_processing.leaderboard import Leaderboard, LeaderboardSerializer
from ..models import SpecifiedProblem


class LeaderboardView(APIView):
    """Leaderboard view as end point to get data from"""
    
    def get(self, request, problem_id:str) -> JsonResponse:
        """Get request to retrieve a leaderboard for a problem id."""
        
        # Get the problem from the id
        problem = SpecifiedProblem.objects.all().filter(id=problem_id)

        # Robustness check to see if problem exists
        if not problem.exists():
            return Response({'error':f"Problem with id {problem_id} was not found"},
                             status=status.HTTP_404_NOT_FOUND)

        # Create a leaderboard for the problem
        serializer = LeaderboardSerializer(Leaderboard(problem.get()))

        # Send JsonResponse with the serialized data of the leaderboard
        return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)