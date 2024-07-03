
from api.data_processing.leaderboard_instance_entry import LeaderboardInstanceEntry
from api.models import Result

from .create_test_data import CreateTestData


class LeaderboardInstanceEntryTest(CreateTestData):
    def setUp(self):
        super(LeaderboardInstanceEntryTest, self).setUp()

    # Test for valid creation of leaderboard entry
    def test_leaderboard_instance_entry_valid(self):
        # Verify submission
        self.submission.is_verified = True

        # Create a duplicate result for that submission
        self.result2 = Result.objects.create(
            metric=self.sc_metric,
            # Randomly generate value
            score=self.result.score,
            benchmark_instance=self.benchmark,
            submission=self.submission
        )

        # Create LeaderboardEntry for testing purposes
        self.leaderboard_instance_entry = LeaderboardInstanceEntry(self.submission, self.benchmark)

        # Assert the properties of the leaderboard
        self.assertEqual(self.leaderboard_instance_entry.benchmark_instance, self.benchmark)
        self.assertEqual(self.leaderboard_instance_entry.results[self.sc_metric.name], self.result.score)

    # Test for valid creation of leaderboard entry
    def test_leaderboard_instance_entry_non_valid(self):
        # Create LeaderboardEntry with no results
        self.result = None
        Result.objects.all().delete()
        self.submission.is_verified = True
        self.leaderboard_instance_entry = LeaderboardInstanceEntry(self.submission, self.benchmark)

        # Assert the properties of the leaderboard
        self.assertEqual(self.leaderboard_instance_entry.results, dict())