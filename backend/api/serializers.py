from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from api.models import Problem

from .models import Submission
from .models import UserProfile as User


class ProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = "__all__"


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "password", "email")


class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = (
            "id",
            "email",
            "submission_name",
            "created_at",
            "is_verified",
        )
