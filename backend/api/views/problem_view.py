# from django.shortcuts import render

from django.db.models import Count
from django.http import JsonResponse
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from ..models import SpecifiedProblem
from ..serializers import SpecifiedProblemSerializer


class Problems(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Serializes specified problems for the list of problem occurences
        """
        # Joining tables and adding field
        problems = SpecifiedProblem.objects.all().prefetch_related("category").annotate(submission_count=Count('submission'))
        # Serializes
        serializer = SpecifiedProblemSerializer(problems, many=True)
        return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)
