from rest_framework import serializers

from ..models import SpecifiedProblem, Submission, ProblemMetric, Metric
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
        problem_metrics = ProblemMetric.objects.filter(problem=self.problem).order_by('position')
        unranked_entries = set()
        rankable_entries = self.entries

        for problem_metric in problem_metrics:
            metric_key = problem_metric.metric.name

            for entry in self.entries:
                if metric_key not in entry.results:
                    rankable_entries.remove(entry)
                    unranked_entries.add(entry)

        self.unranked_entries.extend(unranked_entries)

        
        for problem_metric in problem_metrics:
            metric_key = problem_metric.metric.name
            self.entries.sort(key=lambda entry: entry.results[metric_key],
                              reverse=(problem_metric.metric.order == Metric.Order.COST))

        # Add the rank to each entry.
        rank = 1
        for entry in self.entries:
            entry.rank = rank
            rank += 1


class LeaderboardSerializer(serializers.Serializer):
    """Serializer for leaderboard"""

    problem = SpecifiedProblemSerializer(read_only=True)
    entries = LeaderboardEntrySerializer(read_only=True, many=True)