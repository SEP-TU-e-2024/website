

import os
import json
from unittest import mock

from django.urls import reverse

from api.models import UserProfile
from smtplib import SMTPException
from api.tokens import account_activation_token
from api.views.account_view import AccountView
from unittest.mock import patch, MagicMock
from django.core import mail
from django.http import HttpResponseRedirect
from django.core.mail import EmailMessage
from django.test import Client
from rest_framework.test import APITestCase, APIRequestFactory, force_authenticate
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import status

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

    # Valid signup
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

    def test_account_not_authenticated(self):
        #Call signup method on mock account view object
        self.req.user = None
        response = self.view(self.req)
        response.render()
        result = json.loads(response.content.decode())

        #Check reponses
        self.assertEqual(response.status_code, 401)
