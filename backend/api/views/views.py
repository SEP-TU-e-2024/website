from django.http import HttpResponse
from rest_framework import generics

from ..models import Problem
from ..serializers import ProblemSerializer


# Create your views here.
def main(request):
    return HttpResponse("Hello, world!")


class RetrieveProblems(generics.ListAPIView):
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer
