from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from api.models import Problem

from .models import (
    BenchmarkInstance,
    EvaluationSettings,
    ProblemCategory,
    Result,
    SpecifiedProblem,
    Submission,
)
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
        fields = ("id", "email")


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
            "problem_id",
            "submission_name",
            "created_at",
            "is_verified",
            "is_downloadable",
        )

class EvaluationSettingSerializer(serializers.ModelSerializer):
    """Serializer for evaluation settings"""

    class Meta:
        model = EvaluationSettings
        fields = ["cpu", "time_limit"]

class SpecifiedProblemSerializer(serializers.ModelSerializer):
    """Serializer for specified problems"""

    # Foreign field from category table
    submission_count = serializers.IntegerField(read_only=True)
    evaluation_settings = EvaluationSettingSerializer(read_only=True)

    class Meta:
        model = SpecifiedProblem
        fields = ['id', 'name', 'evaluation_settings', 'metrics', 'submission_count', 'category']

class ProblemCategorySerializer(serializers.ModelSerializer):
    """Serializer for problem categories"""
    specified_problems = SpecifiedProblemSerializer(many=True, read_only=True)

    class Meta:
        model = ProblemCategory
        fields = ['id', 'name', 'style', 'type', 'description', 'simulator', 'validator', 'specified_problems']

class BenchmarkInstanceSerializer(serializers.ModelSerializer):
    """Serializer for Benchmark Instances"""

    class Meta:
        model = BenchmarkInstance
        fields = ['id', 'file_path']

class ResultSerializer(serializers.ModelSerializer):
    """Serializer for results"""
    
    submission = SubmissionSerializer(read_only=True)
    benchmark_instance = BenchmarkInstance(read_only=True)

    class Meta:
        model = Result
        fields = ["id", "benchmark_instance", "submission", "metric", "value"]
