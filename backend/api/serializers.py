from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from .models import (
    EvaluationSettings,
    Metric,
    ProblemCategory,
    ProblemMetric,
    Result,
    SpecifiedProblem,
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


class SubmissionSerializer(serializers.ModelSerializer):
    """ "Serializer for submissions"""

    class Meta:
        model = Submission
        fields = ["id", "name", "user", "problem",
                  "created_at", "is_verified", "is_downloadable"]


class EvaluationSettingSerializer(serializers.ModelSerializer):
    """Serializer for evaluation settings"""

    class Meta:
        model = EvaluationSettings
        fields = ["cpu", "time_limit"]

        
class MetricSerializer(serializers.ModelSerializer):
    """"""

    class Meta:
        model = Metric
        fields = ['name', 'label', 'unit', 'order']


class SpecifiedProblemSerializer(serializers.ModelSerializer):
    """Serializer for specified problems"""

    submission_count = serializers.IntegerField(read_only=True)
    evaluation_settings = EvaluationSettingSerializer(read_only=True)

    class Meta:
        model = SpecifiedProblem
        fields = ['id', 'name', 'category', 'evaluation_settings',
                  'benchmark_instances', 'metrics', 'submission_count']


class ProblemMetricSerializer(serializers.ModelSerializer):
    """"""

    metric = MetricSerializer(many=True, read_only=True)
    problem = SpecifiedProblemSerializer(many=True, read_only=True)

    class Meta:
        model = ProblemMetric
        fields = ['metric', 'problem', 'position', 'scoring_metric']


class ProblemCategorySerializer(serializers.ModelSerializer):
    """Serializer for problem categories"""
    specified_problems = SpecifiedProblemSerializer(many=True, read_only=True)

    class Meta:
        model = ProblemCategory
        fields = ['id', 'name', 'style', 'type', 'description',
                  'simulator', 'validator', 'specified_problems']


class ResultSerializer(serializers.ModelSerializer):
    """Serializer for results"""

    submission = SubmissionSerializer(read_only=True)

    class Meta:
        model = Result
        fields = ["submission", "metric", "score"]
