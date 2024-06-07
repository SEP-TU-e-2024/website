from api.models import SpecifiedProblem, Submission, UserProfile
from api.views.submit_view import SubmitViewSet
from django.core import mail
from django.test import RequestFactory
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import status
from rest_framework.test import APITestCase


class ConfirmSubmissionTest(APITestCase):
    def setUp(self):

        #Add mock profile directly to database
        self.user = UserProfile.objects.create(
            email='test@benchlab.com',
            name='Barteljaap',
            password='Barteljaap123',
        )

        #Add mock problem directly to database
        self.problem = SpecifiedProblem.objects.create(
            name='Test Problem',
            metrics='Metric'
        )

        #Add mock submission to database
        self.submission = Submission.objects.create(
            user=self.user,
            problem_id=self.problem,
        )

        #Instantiate SubmitView for testing
        self.view = SubmitViewSet()
        #Request Factory to make mock request
        rf = RequestFactory()

        #Add necessary information to make request count as valid
        request = rf.post('/', data={'email':'test@benchlab.com'})
        request.META['HTTP_HOST'] = 'example.com'
        request.data = {'email':'test@benchlab.com'}

        #Send the email
        self.view.verify_submission(request, False, self.submission)
        

    def test_verification(self):
        #Extract problem id and token
        link_index = mail.outbox[0].body.find('http://example.com/api/confirmSubmission/')
        submission_sid, token = mail.outbox[0].body[link_index:].strip().split('/')[-2:]

        #Check that the submission id matches
        self.assertEqual(
            urlsafe_base64_encode(force_bytes(self.submission.id)),
            submission_sid,
            'Submission verification email verifies wrong submission!'
        )

        resp = self.view.confirm_submission(submission_sid, token)
        self.assertEqual(
            resp.status_code,
            status.HTTP_200_OK,
            f'Token verification went wrong code: {resp.status_code}'
        )
