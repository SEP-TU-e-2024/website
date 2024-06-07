import json

from api.models import (
    BenchmarkInstance,
    EvaluationSettings,
    ProblemCategory,
    Result,
    SpecifiedProblem,
)
from rest_framework.test import APITestCase


class ResultViewTest(APITestCase):
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
        self.benchmark = BenchmarkInstance.objects.create(filepath='a/b/c')
        self.result = Result.objects.create(metric='Test1', value=100,benchmark_instance=self.benchmark)



    def test_result(self):
        #Send a request to the api endpoint
        resp = self.client.get('/api/result/' + str(self.result.id))

        # unpack the json object
        result = json.loads(resp.content.decode())
        
        #test result attributes
        self.assertEqual(result['metric'], self.result.metric)
        self.assertEqual(float((result['value'])), self.result.value)