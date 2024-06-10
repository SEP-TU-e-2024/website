from rest_framework import serializers

from ..models import Metric, SpecifiedProblem, Submission
from ..serializers import SpecifiedProblemSerializer
from .leaderboard_entry import LeaderboardEntry, LeaderboardEntrySerializer


class Leaderboard:
    """Class to create a leaderboard for a specified problem"""

    def __init__(self, problem: SpecifiedProblem):
        self.problem = problem
        submissions = Submission.objects.all().filter(problem=problem)
        entries = [LeaderboardEntry(submission) for submission in submissions]

        def is_rankable_entry(entry):
            return self.problem.scoring_metric.name in entry.results.keys()
        
        self.entries = list(filter(lambda entry: is_rankable_entry(entry), entries))
        self.unranked_entries = list(filter(lambda entry: not is_rankable_entry(entry), entries))
        
        self.rank_entries()

    def rank_entries(self):
        """Rank the entries based on the scoring metrics"""
        
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
