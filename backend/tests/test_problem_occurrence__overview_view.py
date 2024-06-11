import json

from api.models import EvaluationSettings, ProblemCategory, SpecifiedProblem
from django.urls import reverse
from rest_framework.test import APITestCase


class ProblemOccurenceViewTest(APITestCase):
    def setUp(self):
        #Set up a test category
        cat = ProblemCategory.objects.create(
            name='TestCategory',
            style=1,
            type='TestType',
            description='TestDescription'
        )
        #Set up a test evaluation settings
        eval = EvaluationSettings.objects.create(cpu=1,time_limit=1)
        #Set up a test specified problem
        SpecifiedProblem.objects.create(
            name='TestProblem',
            evaluation_settings=eval,
            metrics='Test1, Test2',
            category=cat
        )


    def test_problem_list(self):
        #Send a request to the api endpoint
        url = reverse('ProblemOverview')
        resp = self.client.post(url)

        #unpack the json object, get the first category
        category = json.loads(resp.content.decode())[0]
        self.assertEqual(category['name'], 'TestCategory')
        self.assertEqual(category["style"], 1)
        self.assertEqual(category['type'], 'TestType')
        self.assertEqual(category['description'], 'TestDescription')

        #get the first problem in that category
        problem = category['specified_problems'][0]
        self.assertEqual(problem['name'], 'TestProblem')
        self.assertEqual(problem['metrics'], 'Test1, Test2')

        #get the evaluation settings
        evaluation = problem['evaluation_settings']
        self.assertEqual(evaluation['cpu'], 1)
        self.assertEqual(evaluation['time_limit'], 1.0)

        #check whether the specified problem refers back to the right category
        self.assertEqual(category['id'], problem['category'])
