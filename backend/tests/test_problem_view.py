

import os
import json

from api.models import EvaluationSettings, Metric, ProblemCategory, SpecifiedProblem, UserProfile
from api.views.problem_view import Problems

from rest_framework.test import APITestCase, APIRequestFactory, force_authenticate

class TestProblemView(APITestCase):
    def setUp(self):
        # Create mock Problems view object
        self.view = Problems().as_view()

        # Create Request Factory object to create mock requests
        self.rf = APIRequestFactory()

        # Add mock Evaluation settings to database
        self.evaluation_settings = EvaluationSettings.objects.create()

        # Add mock Metric
        self.metric = Metric.objects.create(
            name="test_metric",
            label="test"
        )

        # Add mock problem directly to database
        self.category = ProblemCategory.objects.create(
            name='TestCategory',
            style=1,
            type=1,
            description='TestDescription'
        )

        # Add mock problem directly to database
        self.problem = SpecifiedProblem.objects.create(
            name='Test Problem',
            scoring_metric=self.metric,
            category=self.category,
            evaluation_settings=self.evaluation_settings
        )

        # Add mock problem directly to database
        self.problem2 = SpecifiedProblem.objects.create(
            name='Test Problem2',
            scoring_metric=self.metric,
            category=self.category,
            evaluation_settings=self.evaluation_settings
        )

        self.req = self.rf.post('/problems/occurrence_overview/')

    # Valid retrieval
    def test_problem_valid(self):
        #Call get method on mock problem occurrence view object
        response = self.view(self.req)
        result = json.loads(response.content.decode())

        #Check reponses
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            result[0]["name"],
            'TestCategory',
            'Name wrong'
        )
        self.assertEqual(
            result[0]["description"],
            'TestDescription',
            'Description wrong'
        )

        # Names of expected problems
        expected_problems = ["Test Problem", "Test Problem2"]

        # Check for missing problems
        for retrieved_problem in result[0]["specified_problems"]:
            self.assertIn(retrieved_problem["name"], expected_problems, 'Specified problem missing')

    # Non valid retrieval
    def test_problem_occurrence_non_valid(self):
        #Call get method on mock problem occurrence view object
        ProblemCategory.objects.all().delete()
        self.req = self.rf.post('/problems/occurrence_overview/')
        response = self.view(self.req)

        #Check reponses
        self.assertEqual(response.status_code, 404)
