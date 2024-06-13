from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from .models import (
    BenchmarkInstance,
    EvaluationSettings,
    Metric,
    ProblemCategory,
    SpecifiedProblem,
    StorageLocation,
    Submission,
)
from .models import UserProfile as User


class UserSerializer(ModelSerializer):
    """Serializer for users"""

    class Meta:
        model = User
        fields = ["id", "email"]


class ProfileSerializer(ModelSerializer):
    """Serializer for user profiles"""

    class Meta:
        model = User
        fields = ["id", "email", "name"]


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
            "name",
            "user",
            "problem",
            "created_at",
            "is_verified",
            "is_downloadable",
        ]


class EvaluationSettingSerializer(serializers.ModelSerializer):
    """Serializer for evaluation settings"""

    class Meta:
        model = EvaluationSettings
        fields = ["cpu", "time_limit"]

        
class MetricSerializer(serializers.ModelSerializer):
    """Serializer for metric"""

    class Meta:
        model = Metric
        fields = ['name', 'label', 'unit', 'order']


class SpecifiedProblemSerializer(serializers.ModelSerializer):
    """Serializer for specified problems"""

    # Add additional field for the submission count
    submission_count = serializers.IntegerField(read_only=True)

    # Add additional serialization depth to the fields
    evaluation_settings = EvaluationSettingSerializer(read_only=True)
    metrics = MetricSerializer(many=True, read_only=True)
    scoring_metric = MetricSerializer(read_only=True)

    class Meta:
        model = SpecifiedProblem
        fields = [
            "id",
            "name",
            "category",
            "benchmark_instances",
            "evaluation_settings",
            "metrics",
            "scoring_metric",
            "submission_count",
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


class BenchmarkInstanceSerializer(serializers.ModelSerializer):

    class Meta:
        model = BenchmarkInstance
        fields = [
            "id",
            "filepath",
        ]

