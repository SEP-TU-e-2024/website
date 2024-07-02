# from django.shortcuts import render

from django.http import HttpResponseNotFound, JsonResponse
from rest_framework import status
from rest_framework.views import APIView

from ..models import ProblemCategory
from ..serializers import MinimalSpecifiedProblemSerializer, ProblemCategorySerializer


class Problems(APIView):

    def post(self, request):
        """
        Returns a list of all problem categories
        """
        #Retrieve all problem categories
        problem_cats = ProblemCategory.objects.prefetch_related().all()

        #Check whether there are any problem categories
        if not problem_cats.exists():
            return HttpResponseNotFound("No Problem Categories found")

        #this is a bit hacky but it is what it is
        specified_problems_dict = {}
        for problem_cat in problem_cats:
            specified_problems = problem_cat.specified_problems.all() #retrieve the specified problems related to the problem categories
            specified_problems_dict[str(problem_cat.id)] = specified_problems #put them in a dict based on the problem category id
            
        # Serializes
        serialized_cats = ProblemCategorySerializer(problem_cats, many=True).data
        for serialized_cat in serialized_cats:
            serialized_cat["specified_problems"] = MinimalSpecifiedProblemSerializer(specified_problems_dict[serialized_cat['id']], many=True).data
                
        return JsonResponse(serialized_cats, safe=False,status=status.HTTP_200_OK )
