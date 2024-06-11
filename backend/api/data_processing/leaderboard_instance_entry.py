from rest_framework import serializers

from ..models import BenchmarkInstance, Result, Submission
from ..serializers import BenchmarkInstanceSerializer


class LeaderboardInstanceEntry:
    """Class to create a leaderboard entry for a submission"""

    def __init__(self, submission: Submission, benchmark_instance: BenchmarkInstance):
        # Save the benchmark instance
        self.benchmark_instance = benchmark_instance

        # Create results dictionary to store the results for this instance
        self.results = dict()
        
        # Get the results for the specified submission
        for result in Result.objects.filter(submission=submission, benchmark_instance=benchmark_instance):
            if (submission.is_verified and result.metric.name in self.results):
                print(f"metric {result.metric.name} is duplicate in results of " +
                      f"submission {submission.name} for instance {benchmark_instance.id}")
            # Add the result to the instance dictionary
            self.results[result.metric.name] = float(result.score)


class LeaderboardInstanceEntrySerializer(serializers.Serializer):
    """Serializer for leaderboard entry"""

    # Store the submission of the entry
    benchmark_instance = BenchmarkInstanceSerializer(read_only=True)

    # Dictionary specifying leaderboard column keys with entry values
    results = serializers.DictField(read_only=True, child=serializers.FloatField())
