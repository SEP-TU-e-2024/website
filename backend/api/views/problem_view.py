# from django.shortcuts import render

from django.http import HttpResponseNotFound, JsonResponse
from rest_framework import status
from rest_framework.views import APIView

from ..models import ProblemCategory
from ..serializers import ProblemCategorySerializer


class Problems(APIView):

    def post(self, request):
        """
        Returns a list of all problem categories
        """
        #Retrieve all problem categories
        problems = ProblemCategory.objects.all()

        #Check whether there are any problem categories
        if len(problems) < 1:
            HttpResponseNotFound("No Problem Categories found")

        # Serializes
        serializer = ProblemCategorySerializer(problems, many=True)

        return JsonResponse(serializer.data, safe=False,status=status.HTTP_200_OK )
