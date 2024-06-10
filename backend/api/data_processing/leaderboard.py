from rest_framework import serializers

from ..models import Metric, SpecifiedProblem, Submission
from ..serializers import SpecifiedProblemSerializer
from .leaderboard_entry import LeaderboardEntry, LeaderboardEntrySerializer


class Leaderboard():
    """Class to create a leaderboard for a specified problem"""
    def __init__(self, problem:SpecifiedProblem):
        self.problem = problem
        submissions = Submission.objects.all().filter(problem=problem)
        self.entries = [LeaderboardEntry(submission) for submission in submissions]
        self.unranked_entries = []
        self.rank_entries()

    def rank_entries(self):
        # Rank the entries based on the scoring metric of the problem.
        # In the future we could extend this to sort on multiple metrics and sometimes reversed depending what problem specifies.
        unranked_entries = set()

        for entry in self.entries:
            if self.problem.scoring_metric.name not in entry.results.keys():
                unranked_entries.add(entry)
                break

        for unranked_entry in unranked_entries:
            self.entries.remove(unranked_entry)
            self.unranked_entries.append(unranked_entry)

        self.entries.sort(key=lambda entry: entry.results[self.problem.scoring_metric.name],
                            reverse=( self.problem.scoring_metric.order == Metric.Order.COST))

        # Add the rank to each entry.
        rank = 1
        for entry in self.entries:
            entry.rank = rank
            rank += 1


class LeaderboardSerializer(serializers.Serializer):
    """Serializer for leaderboard"""

    problem = SpecifiedProblemSerializer(read_only=True)
    entries = LeaderboardEntrySerializer(read_only=True, many=True)