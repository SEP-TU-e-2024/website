from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from api.models import Problem

from .models import (
    EvaluationSettings,
    ProblemCategory,
    Result,
    SpecifiedProblem,
    StorageLocation,
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


class StorageLocationSerializer(serializers.ModelSerializer):
    """Serializer for storage locations"""

    # Base fields for all children
    class Meta:
        model = StorageLocation
        fields = ["filepath"]


class SubmissionSerializer(StorageLocationSerializer):
    """ "Serializer for submissions"""

    # Adds fields of storagelocation as direct fields of submissions
    class Meta(StorageLocationSerializer.Meta):
        model = Submission
        fields = StorageLocationSerializer.Meta.fields + [
            "id",
            "problem_id",
            "submission_name",
            "created_at",
            "is_verified",
            "is_downloadable",
        ]


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
        fields = [
            "id",
            "name",
            "evaluation_settings",
            "metrics",
            "submission_count",
            "category",
        ]


class ProblemCategorySerializer(serializers.ModelSerializer):
    """Serializer for problem categories"""

    # Foreign key field
    specified_problems = SpecifiedProblemSerializer(many=True, read_only=True)

    class Meta:
        model = ProblemCategory
        fields = [
            "id",
            "name",
            "style",
            "type",
            "description",
            "simulator",
            "validator",
            "specified_problems",
        ]


class ResultSerializer(serializers.ModelSerializer):
    """Serializer for results"""

    # Foreign key field
    submission = SubmissionSerializer(read_only=True)

    class Meta:
        model = Result
        fields = ["submission", "metric", "score"]
