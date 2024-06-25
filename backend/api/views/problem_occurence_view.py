from django.http import JsonResponse
from requests import Response
from rest_framework import status
from rest_framework.views import APIView

from ..models import SpecifiedProblem
from ..serializers import SpecifiedProblemSerializer


class ProblemOccurrenceView(APIView):

    def get(self, request, problem_id:str):
        """
        Given the ID of a specified problem, returns the attributes of that problem. Additionally, it returns the name and
        the description of the encapsulating category.
        """

        #Retrieve the specified problem
        specified_problem = SpecifiedProblem.objects.filter(id=problem_id).select_related("category")
        #Check whether specified problem exists
        if not specified_problem.exists():
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        #Retrieve the associated category
        specified_problem = specified_problem.get() #actually hit the DB now to fetch the data
        problem_data = SpecifiedProblemSerializer(specified_problem)

        #Return the json object
        return JsonResponse(problem_data.data, safe=False, status=status.HTTP_200_OK)