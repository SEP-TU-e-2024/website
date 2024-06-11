# from django.http import JsonResponse
# from requests import Response
# from rest_framework import status
# from rest_framework.views import APIView

# from ..models import Result
# from ..serializers import ResultSerializer


# class ResultView(APIView):

#     def get(self, request, result_id:str):
#         """Given the id of a result object, retrieve its associated attributes"""

#         #Retrieve the result
#         result = Result.objects.all().filter(id=result_id)

#         #Check if the result is found
#         if not result.exists():
#             #If not, throw an error
#             return Response({}, status=status.HTTP_400_BAD_REQUEST)
        
#         #Serialize the data
#         result_data = ResultSerializer(result, many=True).data[0]

#         #Return it in a JSON Response
#         return JsonResponse(result_data, safe=False, status=status.HTTP_200_OK)
