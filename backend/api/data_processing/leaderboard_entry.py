from rest_framework import serializers

from ..models import Result, Submission
from ..serializers import ProfileSerializer, SubmissionSerializer


class LeaderboardEntry():
    """Class to create a leaderboard entry for a submission"""
    def __init__(self, submission:Submission):
        # Save the submission and submission user
        self.submission = submission
        self.submitter = submission.user

        # Create instance and result dictionary to store the results for all instances
        self.instances = dict()
        results = dict()
        
        # Get the results for the specified submission
        for result in Result.objects.all().filter(submission=submission):
            # Create a dictionary in the instances for the benchmark instance key
            instance_key = result.benchmark_instance.id
            if (instance_key not in self.instances):
                self.instances[instance_key] = dict()
            
            # Add the result to the instance dictionary
            self.instances[instance_key][result.metric.name] = float(result.score)

            # Add metric result to a scores list
            if (result.metric.name not in results):
                results[result.metric.name] = []

            results[result.metric.name].append(float(result.score))

        # Compute aggerate results for the entry.
        self.results = dict()
        for metric in results.keys():
            scores = results[metric]
            self.results[metric] = sum(scores) / len(scores)

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

    # Dictionary specifying the instances for this leaderboard entry
    instances = serializers.DictField(read_only=True,
        child=serializers.DictField(
            child=serializers.FloatField(), read_only=True))

    # Rank of the entry, which depends on other leaderboard entries
    rank = serializers.IntegerField(read_only=True)