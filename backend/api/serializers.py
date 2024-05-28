from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from api.models import Problem

from .models import EvaluationSettings, ProblemCategory, Result, SpecifiedProblem, Submission
from .models import UserProfile as User


class ProblemSerializer(serializers.ModelSerializer):
    """Simple problem serializer"""

    class Meta:
        model = Problem
        fields = "__all__"


class UserSerializer(ModelSerializer):
    """Serializer for users"""

    class Meta:
        model = User
        fields = ("id", "password", "email")


class ProfileSerializer(ModelSerializer):
    """Serializer for user profiles"""

    class Meta:
        model = User
        fields = ("id", "email", "name")


class SubmissionSerializer(serializers.ModelSerializer):
    """ "Serializer for submissions"""

    class Meta:
        model = Submission
        fields = (
            "id",
            "problem",
            "name",
            "created_at",
            "is_verified",
        )


class ProblemCategorySerializer(serializers.ModelSerializer):
    """Serializer for problem categories"""

    class Meta:
        model = ProblemCategory
        fields = ['name', 'description']


class EvaluationSettingSerializer(serializers.ModelSerializer):
    """Serializer for evaluation settings"""
    
    class Meta:
        model = EvaluationSettings
        fields = ['cpu', 'time_limit']


class SpecifiedProblemSerializer(serializers.ModelSerializer):
    """Serializer for specified problems"""

    # Foreign field from category table
    category = ProblemCategorySerializer(read_only=True)
    submission_count = serializers.IntegerField(read_only=True)
    evaluation_settings = EvaluationSettingSerializer(read_only=True)

    class Meta:
        model = SpecifiedProblem
        fields = ['id', 'category', 'type', 'style', 'evaluation_settings', 'metrics', 'submission_count']


class ResultSerializer(serializers.ModelSerializer):
    """Serializer for results"""
    
    submission = SubmissionSerializer(read_only=True)

    class Meta:
        model = Result
        fields = ['submission', 'metric', 'score']
    
