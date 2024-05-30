from rest_framework import serializers

from ..models import Result, Submission
from ..serializers import ProfileSerializer, SubmissionSerializer


class LeaderboardEntry():
    """Class to create a leaderboard entry for a submission"""
    def __init__(self, submission:Submission):
        # Save the submission and submission user
        self.submission = submission
        self.submitter = submission.user

        # Convert the results into a JSON string
        self.results = dict()
        for result in Result.objects.all().filter(submission=submission):
            self.results[result.metric] = float(result.score)
        
        # Add a rank, which is not known
        self.rank = 0


class LeaderboardEntrySerializer(serializers.Serializer):
    """Serializer for leaderboard entry"""
    # Store the submission of the entry
    submission = SubmissionSerializer(read_only=True)

    # Store the profile of the submitter
    submitter = ProfileSerializer(read_only=True)

    # Dictionary specifying leaderboard column keys with entry values
    results = serializers.DictField(read_only=True, child=serializers.CharField(max_length=512))

    # Rank of the entry, which depends on other leaderboard entries
    rank = serializers.IntegerField(read_only=True)