from api.models import Problem
from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer

class ProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = '__all__'

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email')
