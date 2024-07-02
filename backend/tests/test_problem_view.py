

import json

from api.models import ProblemCategory
from api.views.problem_view import Problems

from .create_test_data import CreateTestData


class TestProblemView(CreateTestData):
    def setUp(self):
        super(TestProblemView, self).setUp()

        # Create mock Problems view object
        self.view = Problems().as_view()

        # Create mock request
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
