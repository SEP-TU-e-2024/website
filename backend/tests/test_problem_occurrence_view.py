import json

from api.models import EvaluationSettings, ProblemCategory, SpecifiedProblem
from rest_framework.test import APITestCase


class ProblemOccurenceViewTest(APITestCase):
    def setUp(self):
        #Set up a test category
        self.cat = ProblemCategory.objects.create(
            name='TestCategory',
            style='TestStyle',
            type='TestType',
            description='TestDescription'
        )
        #Set up a test evaluation settings
        self.eval = EvaluationSettings.objects.create(cpu=1,time_limit=1)
        #Set up a test specified problem
        self.problem = SpecifiedProblem.objects.create(
            name='TestProblem',
            evaluation_settings=self.eval,
            metrics='Test1, Test2',
            category=self.cat
        )


    def test_problem_list(self):
        #Send a request to the api endpoint
        resp = self.client.get('/api/problems/problem_occurrence/' + str(self.problem.id))

        # unpack the json object
        problem = json.loads(resp.content.decode())
        
        #test specified problem attributes
        self.assertEqual(problem['id'], str(self.problem.id))
        self.assertEqual(problem['name'], self.problem.name)
        self.assertEqual(problem['metrics'], self.problem.metrics)
        self.assertEqual(problem['category'], str(self.cat.id))

        #get the evaluation settings
        evaluation = problem['evaluation_settings']
        self.assertEqual(evaluation['cpu'], 1)
        self.assertEqual(evaluation['time_limit'], 1.0)

