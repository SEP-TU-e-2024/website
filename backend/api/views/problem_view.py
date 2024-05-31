# from django.shortcuts import render

from django.db.models import Count
from django.http import HttpResponseNotFound, JsonResponse
from rest_framework import status
from rest_framework.views import APIView

from ..models import ProblemCategory
from ..serializers import ProblemCategorySerializer


class Problems(APIView):

    def post(self, request):
        """
        Serializes specified problems for the list of problem occurences
        """
        # Joining tables and adding field
        if 'problem_id' in request.data:
            # problems = SpecifiedProblem.objects.all().prefetch_related("category").prefetch_related("evaluation_settings").annotate(submission_count=Count('submission')).filter(id=request.data['problem_id'])
            problems = ProblemCategory.objects.all().filter(id=request.data['problem_id'])
            if len(problems) == 0:
                # When there is no problem with the requested id, return a 404 response
                return HttpResponseNotFound()
        else:
            # problems = SpecifiedProblem.objects.all().prefetch_related("category").annotate(submission_count=Count('submission'))
            problems = ProblemCategory.objects.all()

        # Serializes
        # serializer = SpecifiedProblemSerializer(problems, many=True)
        serializer = ProblemCategorySerializer(problems, many=True)
        print(serializer.data)
        return JsonResponse(serializer.data, safe=False,status=status.HTTP_200_OK )
        # return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)
