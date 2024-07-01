from api.models import EvaluationSettings, Metric, SpecifiedProblem, Submission, UserProfile
from api.views.submit_view import SubmitViewSet
from django.core import mail
from django.test import RequestFactory
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework.test import APITestCase


class ConfirmSubmissionTest(APITestCase):
    def setUp(self):

        #Add mock profile directly to database
        self.user = UserProfile.objects.create(
            email='test@benchlab.com',
            name='Barteljaap',
            password='Barteljaap123',
        )

        #Add mock Metric to database
        self.sc_metric = Metric.objects.create(
            name='TestMetric'
        )

        #Add mock Evaluation settings to database
        self.evaluation_settings = EvaluationSettings.objects.create()

        #Add mock problem directly to database
        self.problem = SpecifiedProblem.objects.create(
            name='Test Problem',
            scoring_metric=self.sc_metric,
            evaluation_settings=self.evaluation_settings
        )

        #Add mock submission to database
        self.submission = Submission.objects.create(
            user=self.user,
            problem=self.problem,
        )

        #Instantiate SubmitView for testing
        self.view = SubmitViewSet()
        #Request Factory to make mock request
        rf = RequestFactory()

        #Add necessary information to make request count as valid
        request = rf.post('/', data={'email':'test@benchlab.com'})
        request.META['HTTP_HOST'] = 'example.com'
        request.data = {'email':'test@benchlab.com'}
        request.user = self.user

        #Send the email
        self.view.verify_submission(request, False, self.submission)
        

    def test_verification(self):
        #Extract problem id and token
        link_index = mail.outbox[0].body.find('http://example.com/api/submit/confirm')
        self.assertEqual(link_index == -1,False, 'Link index in unit test is wrong, please update it.')
        submission_sid, token = mail.outbox[0].body[link_index:].strip().split('/')[-3:-1]

        #Check that the submission id matches
        self.assertEqual(
            urlsafe_base64_encode(force_bytes(self.submission.id)),
            submission_sid,
            'Submission verification email verifies wrong submission!'
        )
        print(token)

        #TODO: Make this work
        # resp = self.client.get(f'/api/confirm_submission/{submission_sid}/{token}')
        # self.assertEqual(
        #     resp.status_code,
        #     status.HTTP_200_OK,
        #     f'Token verification went wrong, code: {resp.status_code}'
        # )
