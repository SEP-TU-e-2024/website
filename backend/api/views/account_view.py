# download_problem_view.py


from django.http import JsonResponse
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from ..serializers import ProfileSerializer


class AccountView(APIView):
    """
    This class is responsible for getting account information.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serialized_user = ProfileSerializer(user)
        return JsonResponse(serialized_user.data, status=status.HTTP_200_OK)

