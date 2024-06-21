from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from .models import (
    BenchmarkInstance,
    EvaluationSettings,
    Metric,
    ProblemCategory,
    Result,
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
        fields = ["id", "container", "filepath", "is_downloadable"]


class SubmissionSerializer(StorageLocationSerializer):
    """Serializer for submissions"""

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
        ]


class EvaluationSettingSerializer(serializers.ModelSerializer):
    """Serializer for evaluation settings"""

    class Meta:
        model = EvaluationSettings
        fields = ["cpu", "time_limit", "memory", "machine_type"]


class MetricSerializer(serializers.ModelSerializer):
    """Serializer for metric"""

    class Meta:
        model = Metric
        fields = ["name", "label", "unit", "order"]


class ProblemCategorySerializer(serializers.ModelSerializer):
    """Serializer for problem categories"""

    #Get the simulator and validator
    simulator = StorageLocationSerializer(read_only=True)
    validator = StorageLocationSerializer(read_only=True)
    
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
            "example_submission_url",
        ]


class BenchmarkInstanceSerializer(StorageLocationSerializer):
    """Serializer for benchmar instances"""
    
    class Meta:
        model = BenchmarkInstance
        fields = StorageLocationSerializer.Meta.fields + [
            "name",
        ]


class SpecifiedProblemSerializer(serializers.ModelSerializer):
    """Serializer for specified problems"""

    # Add additional field for the submission count
    submission_count = serializers.IntegerField(read_only=True)
    
    #add the category
    category = ProblemCategorySerializer(read_only=True)

    # Add additional serialization depth to the fields
    evaluation_settings = EvaluationSettingSerializer(read_only=True)
    benchmark_instances = BenchmarkInstanceSerializer(many=True, read_only=True)
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


class MinimalSpecifiedProblemSerializer(serializers.ModelSerializer):
    """Serializer for specified problems without category objects etc"""

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
        ]
        
        
class ResultSerializer(serializers.ModelSerializer):
    """Serializer for result"""

    class Meta:
        model = Result
        fields = ["submission", "benchmark_instance", "metric", "score"]
