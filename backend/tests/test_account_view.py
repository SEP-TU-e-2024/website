

import json

from api.models import UserProfile
from api.views.account_view import AccountView
from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate


class TestAccountView(APITestCase):
    def setUp(self):
        #Create mock AccountView object
        self.view = AccountView().as_view()
        #Create Request Factory object to create mock requests
        self.rf = APIRequestFactory()
        #Create a new user for testing
        self.test_user = UserProfile.objects.create(
            email='abc@abc.com'
        )
        self.test_user.is_active = True
        self.test_user.save()

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
