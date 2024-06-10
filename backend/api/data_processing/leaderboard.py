from rest_framework import serializers

from ..models import SpecifiedProblem, Submission
from ..serializers import SpecifiedProblemSerializer
from .leaderboard_entry import LeaderboardEntry, LeaderboardEntrySerializer


class Leaderboard:
    """Class to create a leaderboard for a specified problem"""

    def __init__(self, problem: SpecifiedProblem):
        self.problem = problem
        submissions = Submission.objects.all().filter(problem_id=problem)
        self.entries = [LeaderboardEntry(submission) for submission in submissions]
        # TODO: filter out not-evaluated entries
        self.entries = [entry for entry in self.entries if 'scoring_metric' in entry.results]
        self.rank_entries()

    def rank_entries(self):
        # Rank the entries based on the scoring metric of the problem.
        # In the future we could extend this to sort on multiple metrics and sometimes reversed depending what problem specifies.
        self.entries.sort(key=lambda entry: entry.results["scoring_metric"])

        # Add the rank to each entry.
        rank = 1
        for entry in self.entries:
            entry.rank = rank
            rank += 1


class LeaderboardSerializer(serializers.Serializer):
    """Serializer for leaderboard"""

    problem = SpecifiedProblemSerializer(read_only=True)
    entries = LeaderboardEntrySerializer(read_only=True, many=True)
