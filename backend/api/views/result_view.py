from django.http import JsonResponse
from requests import Response
from rest_framework import status
from rest_framework.views import APIView

from ..models import Result
from ..serializers import ResultSerializer


class ResultView(APIView):

    def get(self, request, result_id:str):
        print('talla')
        result = Result.objects.all().filter(id=result_id)

        if not result.exists():
            print('jalla')
            return Response({}, status=status.HTTP_400_BAD_REQUEST)
        
        result_data = ResultSerializer(result, many=True).data[0]

        return JsonResponse(result_data, safe=False, status=status.HTTP_200_OK)
    
    def post(self, request):
        return JsonResponse("asd", safe=False, status=status.HTTP_200_OK)

