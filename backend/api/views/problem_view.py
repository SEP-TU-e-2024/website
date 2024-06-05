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

        # Joining tables and adding field
        #if 'POId' in request.data:
        #    problems = SpecifiedProblem.objects.all().prefetch_related("category").prefetch_related("evaluation_settings").prefetch_related("metrics").annotate(submission_count=Count('submission')).filter(id=request.data['POId'])
        #    if len(problems) == 0:
                # When there is no problem with the requested id, return a 404 response
        #        return HttpResponseNotFound()
        #else:
        #    problems = SpecifiedProblem.objects.all().prefetch_related("category").prefetch_related("metrics").annotate(submission_count=Count('submission'))
            
        # Serializes
        serializer = ProblemCategorySerializer(problems, many=True)

        return JsonResponse(serializer.data, safe=False,status=status.HTTP_200_OK )
