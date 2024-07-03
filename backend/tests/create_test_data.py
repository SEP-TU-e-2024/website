
import random

from api.models import (
    BenchmarkInstance,
    EvaluationSettings,
    Metric,
    ProblemCategory,
    Result,
    SpecifiedProblem,
    StorageLocation,
    Submission,
    UserProfile,
)
from rest_framework.test import APIRequestFactory, APITestCase


class CreateTestData(APITestCase):
    """ This class exists to avoid code duplication in the setup phase of unit test cases"""

    def setUp(self):
        # Create Request Factory object to create mock requests
        self.rf = APIRequestFactory()

        # Create a new active user
        self.test_user = UserProfile.objects.create(
            email='abc@abc.com',
            name='name',
            password='password',
            is_active = True
        )

        # Create non active user
        self.test_user_non_active = UserProfile.objects.create(
            email='test@abc.com',
            name='name',
            password='password',
            is_active = False
        )

        # Add mock Metric to database
        self.sc_metric = Metric.objects.create(
            name='TestMetric'
        )

        # Add mock Evaluation settings to database
        self.evaluation_settings = EvaluationSettings.objects.create(cpu=1,time_limit=1)

        # Set up a test category
        self.category = ProblemCategory.objects.create(
            name='TestCategory',
            style=1,
            type=1,
            description='TestDescription'
        )

        # Add mock problem directly to database
        self.problem = SpecifiedProblem.objects.create(
            name='Test Problem',
            scoring_metric=self.sc_metric,
            category=self.category,
            evaluation_settings=self.evaluation_settings
        )

        # Add mock problem directly to database
        self.problem2 = SpecifiedProblem.objects.create(
            name='Test Problem2',
            scoring_metric=self.sc_metric,
            category=self.category,
            evaluation_settings=self.evaluation_settings
        )

        # Add mock submission to database
        self.submission = Submission.objects.create(
            user=self.test_user,
            name="mysubmission",
            problem=self.problem,
        )

        # Create storage location
        self.storage_location = StorageLocation.objects.create(
            container="submissions",
            filepath="test.zip",
            is_downloadable = True
        )

        # Create a test benchmark
        self.benchmark = BenchmarkInstance.objects.create(filepath='a/b/c')
        self.problem.benchmark_instances.set([self.benchmark])

        # Create a result for that submission
        self.result = Result.objects.create(
            metric=self.sc_metric,
            # Randomly generate value
            score=random.randint(0,100),
            benchmark_instance=self.benchmark,
            submission=self.submission
        )
