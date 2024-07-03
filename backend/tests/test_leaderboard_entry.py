import json
import random

from api.data_processing.leaderboard_entry import LeaderboardEntry
from api.views.leaderboard_entry_view import LeaderboardEntryView
from api.models import Result, Submission

from .create_test_data import CreateTestData


class LeaderboardEntryTest(CreateTestData):
    def setUp(self):
        super(LeaderboardEntryTest, self).setUp()

    # Test for valid creation of leaderboard entry
    def test_leaderboard_entry_valid(self):
        # Create LeaderboardEntry for testing purposes
        self.leaderboard_entry = LeaderboardEntry(self.problem, self.submission)

        # Assert the properties of the leaderboard
        self.assertEqual(self.leaderboard_entry.submitter.name, self.test_user.name)
        self.assertEqual(self.leaderboard_entry.submission, self.submission)
        self.assertEqual(self.leaderboard_entry.instance_entries[0].benchmark_instance.filepath, self.benchmark.filepath)
        self.assertEqual(self.leaderboard_entry.results[self.sc_metric.name], self.result.score)

    # Test for valid creation of leaderboard entry
    def test_leaderboard_entry_non_valid(self):
        # Create LeaderboardEntry with no results
        self.result = None
        Result.objects.all().delete()
        self.submission.is_verified = True
        self.leaderboard_entry = LeaderboardEntry(self.problem, self.submission)

        # Assert the properties of the leaderboard
        self.assertEqual(self.leaderboard_entry.submitter.name, self.test_user.name)
        self.assertEqual(self.leaderboard_entry.submission, self.submission)
        self.assertEqual(self.leaderboard_entry.instance_entries[0].benchmark_instance.filepath, self.benchmark.filepath)
        self.assertEqual(self.leaderboard_entry.results, dict())

    # Test for valid creation of leaderboard entry
    def test_leaderboard_entry_competition(self):
        # Create LeaderboardEntry with competition style category
        self.category.style = 0
        self.leaderboard_entry = LeaderboardEntry(self.problem, self.submission)

        # Assert the properties of the leaderboard
        self.assertEqual(self.leaderboard_entry.instance_entries, [])