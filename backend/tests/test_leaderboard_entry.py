import json

from api.data_processing.leaderboard_entry import LeaderboardEntry
from api.views.leaderboard_entry_view import LeaderboardEntryView

from .create_test_data import CreateTestData


class LeaderboardEntryViewTest(CreateTestData):
    def setUp(self):
        super(LeaderboardEntryViewTest, self).setUp()

        # Create mock view
        self.view = LeaderboardEntryView().as_view()

        self.problem.benchmark_instances.set([self.benchmark])

        # Create LeaderboardEntry for testing purposes
        self.entries = LeaderboardEntry(self.problem, self.submission)

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
        self.assertEqual(response.data,  {'error':"Submission with id f9e9cb40-9f4c-4fa3-8fa5-2004f4e02111 was not found"}, 'submission id wrong"')
        

    def test_leaderboard_entry_bad_problem(self):
        # Create mock request
        self.req = self.rf.get(f'/api/leaderboard/f9e9cb40-9f4c-4fa3-8fa5-2004f4e02111/{str(self.submission.id)}')
        response = self.view(self.req, "f9e9cb40-9f4c-4fa3-8fa5-2004f4e02111",  self.submission.id)

        # Assert the response status code
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data,  {'error':"Problem with id f9e9cb40-9f4c-4fa3-8fa5-2004f4e02111 was not found"}, 'submission id wrong"')
        