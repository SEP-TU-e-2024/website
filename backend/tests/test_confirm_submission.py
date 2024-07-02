from api.views.submit_view import SubmitViewSet
from django.core import mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

from .create_test_data import CreateTestData


class ConfirmSubmissionTest(CreateTestData):
    def setUp(self):
        super(ConfirmSubmissionTest, self).setUp()

        # Instantiate SubmitView for testing
        self.view = SubmitViewSet()

        # Add necessary information to make request count as valid
        request = self.rf.post('/', data={'email':'test@benchlab.com'})
        request.META['HTTP_HOST'] = 'example.com'
        request.data = {'email':'test@benchlab.com'}
        request.user = self.test_user

        # Send the email
        self.view.verify_submission(request, False, self.submission)
        

    def test_verification(self):
        # Extract problem id and token
        link_index = mail.outbox[0].body.find('http://example.com/api/submit/confirm')
        self.assertEqual(link_index == -1,False, 'Link index in unit test is wrong, please update it.')
        submission_sid, token = mail.outbox[0].body[link_index:].strip().split('/')[-3:-1]

        # Check that the submission id matches
        self.assertEqual(
            urlsafe_base64_encode(force_bytes(self.submission.id)),
            submission_sid,
            'Submission verification email verifies wrong submission!'
        )
        print(token)
