import json
import random

from api.data_processing.leaderboard_entry import LeaderboardEntry
from api.models import (
    BenchmarkInstance,
    EvaluationSettings,
    Metric,
    ProblemCategory,
    Result,
    SpecifiedProblem,
    Submission,
    UserProfile,
)
from rest_framework.test import APITestCase


class LeaderboardEntryViewTest(APITestCase):
    def setUp(self):
        #Set up a test category
        self.cat = ProblemCategory.objects.create(
            name='TestCategory',
            style=1,
            type=1,
            description='TestDescription'
        )
        #Set up a test evaluation settings
        self.eval = EvaluationSettings.objects.create(cpu=1,time_limit=1)
        #Set up Metric
        self.sc_metric = Metric.objects.create(
            name='TestMetric'
        )
        #Set up a test specified problem
        self.problem = SpecifiedProblem.objects.create(
            name='TestProblem',
            evaluation_settings=self.eval,
            category=self.cat,
            scoring_metric=self.sc_metric
        )
        #Create a test benchmark
        self.benchmark = BenchmarkInstance.objects.create(filepath='a/b/c')
        
        # Create a testing profile
        self.profile = UserProfile(
            email='test@benchlab.com',
            name='test man',
            is_staff=False,
            password='jolanda'
        )

        #Create the submission
        self.submission = Submission.objects.create(
            problem_id=self.problem.id,
            name='test submission',
        )

        #Create a result for that submission
        self.result = Result.objects.create(
            metric=self.sc_metric,
            #Randomly generate value
            score=random.randint(0,100),
            benchmark_instance=self.benchmark,
            submission=self.submission
        )

        #Create LeaderboardEntry for testing purposes
        self.entries = LeaderboardEntry(self.submission)


    def test_leaderboard_entry(self):
        #Send a request to the api endpoint
        resp = self.client.get('/api/leaderboard_entry/' + str(self.submission.id))

        # unpack the json object
        result = json.loads(resp.content.decode())

        #Test attributes for submission
        self.assertEqual(str(self.submission.id), result['submission']['id'])
        self.assertEqual(str(self.problem.id), result['submission']['problem'])
        self.assertEqual(self.submission.name, result['submission']['name'])
        
        #Test attributes for results object
        self.assertEqual(self.result.score, float(result['results']['TestMetric']))
        