

import json

from api.models import EvaluationSettings, Metric, ProblemCategory, SpecifiedProblem
from api.views.problem_occurence_view import ProblemOccurrenceView
from rest_framework.test import APIRequestFactory, APITestCase


class TestProblemOccurrenceView(APITestCase):
    def setUp(self):
        # Create mock ProblemOccurrenceView object
        self.view = ProblemOccurrenceView().as_view()

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

        self.req = self.rf.get('/problems/problem_occurrence/' + str(self.problem.id))

    # Valid retrieval
    def test_problem_occurrence_valid(self):
        # Call get method on mock problem occurrence view object
        response = self.view(self.req, self.problem.id)
        result = json.loads(response.content.decode())

        # Check reponses
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            result["name"],
            'Test Problem',
            'Name wrong'
        )
        self.assertEqual(
            result["category"]["name"],
            'TestCategory',
            'Category wrong'
        )

    # Non valid retrieval
    def test_problem_occurrence_non_valid(self):
        # Call get method on mock problem occurrence view object
        self.req = self.rf.get('/problems/problem_occurrence/f9e9cb40-9f4c-4fa3-8fa5-2004f4e02111')
        response = self.view(self.req, "f9e9cb40-9f4c-4fa3-8fa5-2004f4e02111")

        # Check reponses
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data,  {"detail": "Problem not found."}, 'Problem was actually found')
