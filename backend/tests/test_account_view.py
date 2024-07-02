

import json

from api.views.account_view import AccountView
from rest_framework.test import force_authenticate

from .create_test_data import CreateTestData


class TestAccountView(CreateTestData):
    def setUp(self):
        super(TestAccountView, self).setUp()

        # Create mock AccountView object
        self.view = AccountView().as_view()

        # Create mock request
        self.req = self.rf.get('/account')
        self.req.user = self.test_user

    # Valid retrieval
    def test_account_authenticated(self):
        #Call get method on mock account view object
        force_authenticate(self.req, user=self.test_user)
        response = self.view(self.req)
        result = json.loads(response.content.decode())

        #Check reponses
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            result["email"],
            'abc@abc.com',
            'User email wrong'
        )

    # Not authenticated
    def test_account_not_authenticated(self):
        #C all signup method on mock account view object
        self.req.user = None
        response = self.view(self.req)
        response.render()

        #Check reponses
        self.assertEqual(response.status_code, 401)
