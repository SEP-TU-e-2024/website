# from django.shortcuts import render

from django.http import JsonResponse
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView


class AccountView(APIView):
    permission_classes = [IsAuthenticated]
    """
    so maybe need to create this as a viewset instead for getting different stuff from different endpoints(and then every method needs to have the @action something something tag (look at authentication view) and need to add an api_router.register thing instead of an as_view in the urls.py)
    and for submissions import a model as name.objects.all().filter(user=user), see other stuff as well
    for making dynamic content in frontend use rows.map(row => {stuff that needs to be in every row})
    """
    def get(self, request):
        """
        Retrieves the info of the current user from the database
        """
        
        # Gets or creates user
        user = request.user
        if user.is_anonymous:
            return JsonResponse({"User error" : "User not found."}, status=status.HTTP_400_BAD_REQUEST)
        return JsonResponse({"email" : user.email}, status=status.HTTP_200_OK)
        
