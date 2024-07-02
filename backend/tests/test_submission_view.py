

import json

from api.models import EvaluationSettings, Metric, SpecifiedProblem, Submission, UserProfile
from api.views.submission_view import SubmissionView
from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate


class TestSubmissionView(APITestCase):
    def setUp(self):
        # Create mock SubmissionView object
        self.view = SubmissionView().as_view()
        
        # Create Request Factory object to create mock requests
        self.rf = APIRequestFactory()
        
        # Create a new user for testing
        self.test_user = UserProfile.objects.create(
            email='abc@abc.com'
        )
        self.test_user.is_active = True
        self.test_user.save()

        # Add mock Metric to database
        self.sc_metric = Metric.objects.create(
            name='TestMetric'
        )

        # Add mock Evaluation settings to database
        self.evaluation_settings = EvaluationSettings.objects.create()

        # Add mock problem directly to database
        self.problem = SpecifiedProblem.objects.create(
            name='Test Problem',
            scoring_metric=self.sc_metric,
            evaluation_settings=self.evaluation_settings
        )

        #Add mock submission to database
        self.submission = Submission.objects.create(
            name="mysubmissions",
            user=self.test_user,
            problem=self.problem,
        )

        self.req = self.rf.get('/submissions')
        self.req.user = self.test_user

    # Valid retrieval
    def test_submission_authenticated(self):

        #Call get method on mock SubmissionView object
        force_authenticate(self.req, user=self.test_user)
        response = self.view(self.req)
        result = json.loads(response.content.decode())

        #Check reponses
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            result[0]["name"],
            'mysubmissions',
            'Wrong Submissions'
        )

    # Not authenticated
    def test_submission_not_authenticated(self):
        #Call signup method on mock submissions view object
        self.req.user = None
        response = self.view(self.req)
        response.render()

        #Check reponses
        self.assertEqual(response.status_code, 401)
