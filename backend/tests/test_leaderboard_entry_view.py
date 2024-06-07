import json
import random

from api.data_processing.leaderboard_entry import LeaderboardEntry
from api.models import (
    BenchmarkInstance,
    EvaluationSettings,
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
            problem_id=self.problem,
            submission_name='test submission',
        )

        #Create a result for that submission
        self.result = Result.objects.create(
            metric='scoring_metric',
            #Randomly generate value
            value=random.randint(0,100),
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
        self.assertEqual(str(self.problem.id), result['submission']['problem_id'])
        self.assertEqual(self.submission.submission_name, result['submission']['submission_name'])
        
        #Test attributes for results object
        self.assertEqual(self.result.value, float(result['results']['scoring_metric']))
        self.assertEqual(self.result.rank, result['results']['rank'])
        # self.assertEqual(self.result)
        print(result)
        