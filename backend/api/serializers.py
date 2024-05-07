from api.models import Problem
from rest_framework import serializers
from .models import UserProfile as User
from rest_framework.serializers import ModelSerializer

class ProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = '__all__'

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email')
