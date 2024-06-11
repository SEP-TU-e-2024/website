from rest_framework import serializers

from ..models import Result, SpecifiedProblem, Submission
from ..serializers import ProfileSerializer, SubmissionSerializer
from .leaderboard_instance_entry import LeaderboardInstanceEntry, LeaderboardInstanceEntrySerializer


class LeaderboardEntry:
    """Class to create a leaderboard entry for a submission"""

    def __init__(self, problem: SpecifiedProblem, submission: Submission):
        # Save the submission and submission user
        self.submission = submission
        self.submitter = submission.user

        # Create list of leaderboard instance entries.
        self.instance_entries = [LeaderboardInstanceEntry(submission, benchmark_instance)
                                 for benchmark_instance in problem.benchmark_instances.all()]

        # Get the results for the submission
        submission_results = Result.objects.filter(submission=submission)

        # Compute the aggerate results for the submission and each metric of the problem.
        self.results = dict()
        for metric in problem.metrics.all():
            scores = [scores['score'] for scores in submission_results.filter(metric=metric).values('score')]
            self.results[metric.name] = sum(scores) / len(scores)

        # Add a rank, which is not known
        self.rank = 0


class LeaderboardEntrySerializer(serializers.Serializer):
    """Serializer for leaderboard entry"""

    # Store the submission of the entry
    submission = SubmissionSerializer(read_only=True)

    # Store the profile of the submitter
    submitter = ProfileSerializer(read_only=True)

    # Dictionary specifying leaderboard column keys with entry values
    results = serializers.DictField(read_only=True, child=serializers.FloatField())

    # Dictionary specifying the benchmark instances for this leaderboard entry
    instance_entries = LeaderboardInstanceEntrySerializer(read_only=True, many=True)

    # Rank of the entry, which depends on other leaderboard entries
    rank = serializers.IntegerField(read_only=True)
