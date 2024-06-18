from rest_framework import serializers

from ..models import Metric, SpecifiedProblem, Submission
from ..serializers import SpecifiedProblemSerializer
from .leaderboard_entry import LeaderboardEntry, LeaderboardEntrySerializer


class Leaderboard:
    """Class to create a leaderboard for a specified problem"""

    def __init__(self, problem: SpecifiedProblem):
        self.problem = problem
        submissions = Submission.objects.filter(problem=problem)
        entries = [LeaderboardEntry(problem, submission) for submission in submissions]

        def is_rankable_entry(entry):
            return self.problem.scoring_metric.name in entry.results.keys() and entry.submission.is_verified
        
        self.entries = list(filter(lambda entry: is_rankable_entry(entry), entries))
        self.unranked_entries = list(filter(lambda entry: not is_rankable_entry(entry), entries))
        
        self.rank_entries()

    def rank_entries(self):
        """Rank the entries based on the scoring metric"""
        
        self.entries.sort(key=lambda entry: entry.results[self.problem.scoring_metric.name],
                            reverse=( self.problem.scoring_metric.order == Metric.Order.REWARD))

        # Add the rank to each entry.
        rank = 1
        for entry in self.entries:
            entry.rank = rank
            rank += 1


class LeaderboardSerializer(serializers.Serializer):
    """Serializer for leaderboard"""

    problem = SpecifiedProblemSerializer(read_only=True)
    entries = LeaderboardEntrySerializer(read_only=True, many=True)
    unranked_entries = LeaderboardEntrySerializer(read_only=True, many=True)
