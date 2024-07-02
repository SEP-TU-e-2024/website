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

        #Create the submission
        self.submission = Submission.objects.create(
            user=self.profile,
            problem=self.problem,
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
        self.entries = LeaderboardEntry(self.problem, self.submission)
        
        # Setup request factory
        self.factory = APIRequestFactory()


    def test_leaderboard_entry(self):
        #Send a request to the api endpoint
        resp = self.client.get(f'/api/leaderboard_entry/{str(self.problem.id)}/{str(self.submission.id)}' )
        
        # unpack the json object
        result = json.loads(resp.content.decode())

        #Test attributes for submission
        self.assertEqual(str(self.submission.id), result['submission']['id'])
        self.assertEqual(str(self.problem.id), result['submission']['problem'])
        self.assertEqual(self.submission.name, result['submission']['name'])
        
        #Test attributes for results object
        self.assertEqual(self.result.score, float(result['instance_entries'][0]["results"]['TestMetric']))
        
    def test_leaderboard_entry_bad_submission(self):
        #Send a request to the api endpoint
        request = self.factory.get(f'/api/leaderboard/{str(self.problem.id)}/f9e9cb40-9f4c-4fa3-8fa5-2004f4e02111')

        # Call the view function directly
        view = LeaderboardEntryView.as_view()
        response = view(request, submission_id=self.submission.id,  problem_id='f9e9cb40-9f4c-4fa3-8fa5-2004f4e02111')  # Pass the same ID here

        # Assert the response status code
        self.assertEqual(response.status_code, 400)

    def test_leaderboard_entry_bad_problem(self):
        #Send a request to the api endpoint
        request = self.factory.get(f'/api/leaderboard/f9e9cb40-9f4c-4fa3-8fa5-2004f4e02111/{str(self.submission.id)}')

        # Call the view function directly
        view = LeaderboardEntryView.as_view()
        response = view(request, submission_id="f9e9cb40-9f4c-4fa3-8fa5-2004f4e02111",  problem_id=self.problem.id)  # Pass the same ID here

        # Assert the response status code
        self.assertEqual(response.status_code, 400)
        