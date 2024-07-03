

import json

from api.views.problem_occurence_view import ProblemOccurrenceView

from .create_test_data import CreateTestData


class TestProblemOccurrenceView(CreateTestData):
    def setUp(self):
        super(TestProblemOccurrenceView, self).setUp()

        # Create mock ProblemOccurrenceView object
        self.view = ProblemOccurrenceView().as_view()

        # Create mock request
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
