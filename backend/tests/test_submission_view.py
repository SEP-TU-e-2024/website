

import json

from api.views.submission_view import SubmissionView
from rest_framework.test import force_authenticate

from .create_test_data import CreateTestData


class TestSubmissionView(CreateTestData):
    def setUp(self):
        super(TestSubmissionView, self).setUp()

        # Create mock SubmissionView object
        self.view = SubmissionView().as_view()
       
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
            'mysubmission',
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
