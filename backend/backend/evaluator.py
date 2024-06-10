from api.models import Submission
from api.serializers import SubmissionSerializer


def evaluate_submission(submission: Submission):
	print(f'Submission made: {submission}, {SubmissionSerializer(submission).data}')

	# TODO