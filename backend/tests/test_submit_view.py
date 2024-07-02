

from unittest import mock

from api.tokens import submission_confirm_token
from api.views.submit_view import SubmitViewSet
from azure.storage.blob import BlobServiceClient
from django.contrib.auth.models import AnonymousUser
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.mail import EmailMessage
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework.exceptions import ErrorDetail

from .create_test_data import CreateTestData


class TestSubmitViewSet(CreateTestData):
    def setUp(self):
        super(TestSubmitViewSet, self).setUp()

        # Create mock SubmissionView object
        self.view = SubmitViewSet()
        
        # Creat mock file
        file_content = b'This is a test file content'
        self.file = SimpleUploadedFile("test_file.zip", file_content, content_type="text/plain")


    # Valid retrieval
    @mock.patch.object(BlobServiceClient, 'from_connection_string')
    def test_submission_authenticated(self, mock_connection):
        # Create request
        self.req = self.rf.post('/submit/submit', {'file': self.file})
        self.req.user = self.test_user
        self.req.data = {
            'name':'mycoolsubmission',
            'is_downloadable' : True,
            "problem" : self.problem.id
        }

        # Call submit method on mock SubmitViewSet object
        response = self.view.submit(self.req)

        # Check reponses
        self.assertEqual(response.status_code, 200)

    # Invalid submission data
    @mock.patch.object(BlobServiceClient, 'from_connection_string')
    def test_invalid_data(self, mock_connection):
        # Create request
        self.req = self.rf.post('/submit/submit', {'file': self.file})
        self.req.user = self.test_user
        self.req.data = {}

        # Call submit method on mock SubmitViewSet object
        response = self.view.submit(self.req)

        # Check reponses
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data,  {"detail": [ErrorDetail(string='This field is required.', code='required')]}, 'submission data"')

    # No file provided
    @mock.patch.object(BlobServiceClient, 'from_connection_string')
    def test_no_file(self, mock_connection):
        # Create request
        self.req = self.rf.post('/submit/submit')
        self.req.user = self.test_user
        self.req.data = {}

        # Call submit method on mock SubmitViewSet object
        response = self.view.submit(self.req)

        # Check reponses
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data,  {"detail": "No file provided"}, 'No file"')

    # Invalid file provided
    @mock.patch.object(BlobServiceClient, 'from_connection_string')
    def test_invalid_file(self, mock_connection):
        # Create request
        file_content = b'This is a test file content'
        self.file = SimpleUploadedFile("test_file.txt", file_content, content_type="text/plain")
        self.req = self.rf.post('/submit/submit', {'file': self.file})
        self.req.user = self.test_user
        self.req.data = {}

        # Call submit method on mock SubmitViewSet object
        response = self.view.submit(self.req)

        # Check reponses
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data,  {"detail": "Invalid file provided"}, 'Invalid file"')

    # Mock Azure upload error
    @mock.patch.object(BlobServiceClient, 'from_connection_string')
    def test_azure_upload_error(self, mock_connection):
        mock_connection.return_value = None

        # Create request
        self.req = self.rf.post('/submit/submit', {'file': self.file})
        self.req.user = self.test_user
        self.req.data = {
            'name':'mycoolsubmission',
            'is_downloadable' : True,
            "problem" : self.problem.id
        }

        # Call submit method on mock SubmitViewSet object
        response = self.view.submit(self.req)

        # Check reponses
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.data,  {"detail": "An error occurred during file upload"}, 'Upload error')

    # Mock Email send error
    @mock.patch.object(EmailMessage, 'send')
    def test_email_fail(self, mock_send):
        mock_send.return_value = False

        # Create request
        self.req = self.rf.post('/submit/submit', {'file': self.file})
        self.req.user = AnonymousUser()
        self.req.data = {
            'email':'myemail@email.com',
            'name':'mycoolsubmission',
            'is_downloadable' : True,
            "problem" : self.problem.id
        }

        # Call submit method on mock SubmitViewSet object
        response = self.view.submit(self.req)

        # Check reponses
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.data,  {'error': 'An error occurred during sending of verification email'}, 'Upload error')

    def test_activate_valid(self):
        # Test whether a valid user can activate their account
        response = self.view.activate(
            None,
            urlsafe_base64_encode(force_bytes(self.submission.id)), # Encode the UUID
            submission_confirm_token.make_token(self.submission) # Create a new valid token
        )

        # Check that the user is directed to the front page
        self.assertEqual(response.status_code, 302)

    def test_activate_non_existent(self):
        # Tests whether a non existent submission can be activated
        response = self.view.activate(
            None,
            urlsafe_base64_encode(force_bytes('4d9856e8-f8ae-4077-8a20-c5c4b1b81600')), #Encode the UUID
            None
        )

        #Check that the right error is thrown
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {"detail": "Submission not found."})

    def test_activate_invalid_token(self):
        # Tests whether a non existent submission can be activated
        response = self.view.activate(
            None,
            urlsafe_base64_encode(force_bytes(self.submission.id)), # Encode the UUID
            'test'  # Random invalid token
        )

        #Check that the right error is thrown
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {"detail": "Invalid token."},'invalid token, or submission already activated')

    
