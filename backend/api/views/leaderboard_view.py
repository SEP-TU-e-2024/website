from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..data_processing.leaderboard import Leaderboard, LeaderboardSerializer
from ..models import SpecifiedProblem


class LeaderboardView(APIView):
    
    def get(self, request, problem_id:int) -> JsonResponse:
        problem = SpecifiedProblem.objects.all().filter(id=problem_id)

        if not problem.exists():
            # f"Problem with id {problem_id} was not found"
            return Response({}, status=status.HTTP_404_NOT_FOUND)

        serializer = LeaderboardSerializer(Leaderboard(problem.get()))

        return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)