import json
import random

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


class LeaderboardViewTest(APITestCase):
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
            name='test metric'
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
        self.profile = UserProfile.objects.create(
            email='test@benchlab.com',
            name='test man',
            is_staff=False,
            password='jolanda'
        )

        #Add 100 random submissions
        self.submissions = []
        self.results = []
        for i in range(100):
            #Create the submission
            self.submissions += [Submission.objects.create(
                user=self.profile,
                problem=self.problem,
                name=f'test submission {i}',
            )]
            
            #Create a result for that submission
            self.results += [Result.objects.create(
                metric=self.sc_metric,
                #Randomly generate value
                score=random.randint(0,100),
                benchmark_instance=self.benchmark,
                submission=self.submissions[i]
            )]



    def test_leaderboard(self):
        #Send a request to the api endpoint
        resp = self.client.get('/api/leaderboard/' + str(self.problem.id))

        # unpack the json object
        result = json.loads(resp.content.decode())

        #check whether leaderboard is sorted
        prev = -1
        for score in result['entries']:
            #Get the current entry score
            current = float(score['results']['test metric'])
            #Compare previous entry to next entry (in order of the list), throw error if not ascending
            self.assertGreaterEqual(current, prev, 'LeaderboardEntry not sorted!')
            #Update pointer to previous entry
            prev = current
        
        
        #TODO: Add more unit tests when metrics are properly defined