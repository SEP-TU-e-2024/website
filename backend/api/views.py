# from django.shortcuts import render
from django.http import HttpResponse
from .serializers import ProblemSerializer
from .models import Problem
from rest_framework import generics

# Create your views here.

def main(request):
    return HttpResponse("Hello, world!")

class RetrieveProblems(generics.ListAPIView):
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer