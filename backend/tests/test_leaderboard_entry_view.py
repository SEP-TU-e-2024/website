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
from api.views.leaderboard_entry_view import LeaderboardEntryView
from rest_framework.test import APIRequestFactory, APITestCase
from api.views.leaderboard_entry_view import LeaderboardEntryView


class LeaderboardEntryViewTest(APITestCase):
    def setUp(self):
        # Create mock view 
        self.view = LeaderboardEntryView().as_view()

        # Set up a test category
        self.cat = ProblemCategory.objects.create(
            name='TestCategory',
            style=1,
            type=1,
            description='TestDescription'
        )
        
        # Set up a test evaluation settings
        self.eval = EvaluationSettings.objects.create(cpu=1,time_limit=1)
        
        # Set up Metric
        self.sc_metric = Metric.objects.create(
            name='TestMetric'
        )

        #Create a test benchmark
        self.benchmark = BenchmarkInstance.objects.create(filepath='a/b/c')

        #Set up a test specified problem
        self.problem = SpecifiedProblem.objects.create(
            name='TestProblem',
            evaluation_settings=self.eval,
            category=self.cat,
            scoring_metric=self.sc_metric
        )

        self.problem.benchmark_instances.set([self.benchmark])

        # Create a testing profile
        self.profile = UserProfile.objects.create(
            email='test@benchlab.com',
            name='test man',
            is_staff=False,
            password='jolanda'
        )

        # Create the submission
        self.submission = Submission.objects.create(
            user=self.profile,
            problem=self.problem,
            name='test submission',
        )

        # Create a result for that submission
        self.result = Result.objects.create(
            metric=self.sc_metric,
            # Randomly generate value
            score=random.randint(0,100),
            benchmark_instance=self.benchmark,
            submission=self.submission
        )

        # Create LeaderboardEntry for testing purposes
        self.entries = LeaderboardEntry(self.problem, self.submission)
        
        # Setup request factory
        self.rf = APIRequestFactory()


    def test_leaderboard_entry(self):
        # Create mock request
        self.req = self.rf.get(f'/api/leaderboard_entry/{str(self.problem.id)}/{str(self.submission.id)}')
        response = self.view(self.req, self.problem.id, self.submission.id)

        # Unpack the json object
        result = json.loads(response.content.decode())

        # Check reponses
        self.assertEqual(response.status_code, 200)

        # Test attributes for submission
        self.assertEqual(str(self.submission.id), result['submission']['id'])
        self.assertEqual(str(self.problem.id), result['submission']['problem'])
        self.assertEqual(self.submission.name, result['submission']['name'])
        
        # Test attributes for results object
        self.assertEqual(self.result.score, float(result['instance_entries'][0]["results"]['TestMetric']))
        
    def test_leaderboard_entry_bad_submission(self):
        # Create mock request
        self.req = self.rf.get(f'/api/leaderboard_entry/{str(self.problem.id)}/f9e9cb40-9f4c-4fa3-8fa5-2004f4e02111')
        response = self.view(self.req, self.problem.id, 'f9e9cb40-9f4c-4fa3-8fa5-2004f4e02111')

        # Assert the response status code
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data,  {'error':f"Submission with id f9e9cb40-9f4c-4fa3-8fa5-2004f4e02111 was not found"}, 'submission id wrong"')
        

    def test_leaderboard_entry_bad_problem(self):
        # Create mock request
        self.req = self.rf.get(f'/api/leaderboard/f9e9cb40-9f4c-4fa3-8fa5-2004f4e02111/{str(self.submission.id)}')
        response = self.view(self.req, "f9e9cb40-9f4c-4fa3-8fa5-2004f4e02111",  self.submission.id)

        # Assert the response status code
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data,  {'error':f"Problem with id f9e9cb40-9f4c-4fa3-8fa5-2004f4e02111 was not found"}, 'submission id wrong"')
        