from django.http import JsonResponse
from requests import Response
from rest_framework import status
from rest_framework.views import APIView

from ..models import SpecifiedProblem
from ..serializers import ProblemCategorySerializer, SpecifiedProblemSerializer


class ProblemOccurrenceView(APIView):

    def get(self, request, problem_id:str):
        """
        Given the ID of a specified problem, returns the attributes of that problem. Additionally, it returns the name and
        the description of the encapsulating category.
        """

        #Retrieve the specified problem
        specified_problem = SpecifiedProblem.objects.all().filter(id=problem_id).select_related("category")
        #Check whether specified problem exists
        if not specified_problem.exists():
            return Response({}, status=status.HTTP_400_BAD_REQUEST)
        #Retrieve the associated category
        category_data = ProblemCategorySerializer(specified_problem.get().category).data

        #Join data from the problem category and specified problem
        problem_data = SpecifiedProblemSerializer(specified_problem,many=True).data[0]
        problem_data['name'] = category_data['name']
        problem_data['description'] = category_data['description']

        #Return the json object
        return JsonResponse(problem_data, safe=False, status=status.HTTP_200_OK)