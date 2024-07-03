

import os
from smtplib import SMTPException
from unittest import mock

from api.models import UserProfile
from api.tokens import account_activation_token
from api.views.auth_view import AuthViewSet
from django.core import mail
from django.core.mail import EmailMessage
from django.http import HttpResponseRedirect
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import status

from .create_test_data import CreateTestData


class TestAuthView(CreateTestData):
    def setUp(self):
        super(TestAuthView, self).setUp()

        # Create mock AuthView object
        self.auth = AuthViewSet()

    # Valid signup
    def test_sign_up_valid(self):
        # Construct mock request for signing up
        req = self.rf.post('auth/signup/')
        req.data = {
                'email':'test@benchlab.com',
                'username':'benchlab user',
                'password':'123'
            }
        
        # Call signup method on mock auth view object
        self.auth.signup(req)
        
        # Extract token and uid from the mail that was sent by the signup method
        link_index = mail.outbox[0].body.find(os.getenv("FRONTEND_URL") + "/verify")
        uid, token = mail.outbox[0].body[link_index:].strip().split('/')[-2:]
        print(f'Token: {token}')

        # Decode the uid
        uid_decoded = force_str(urlsafe_base64_decode(uid))

        # Get the user object from storage
        user = UserProfile.objects.get(pk=uid_decoded)
        
        # Check whether the mail was sent for the right user
        self.assertEqual(
            user.name,
            'benchlab user',
            'Registered username does not match name in database.'
        )
        # Check whether the mail was sent for the right email
        self.assertEqual(
            user.email,
            'test@benchlab.com',
            'Registered email does not match emailin database.'
        )


    # Invalid email
    def test_signup_invalid(self):
        # Tests whether an invalid signup is handled correctly
        req = self.rf.post('auth/signup/')
        req.data = {
            'email':'asd',
            'username':'benchlab user',
            'password':'123'
        }
    
        # Call signup request
        resp = self.auth.signup(req)
        
        # Verify that a bad request response code is thrown
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
    
    # Used email
    def test_signup_email_in_use(self):
        # Tests whether an invalid signup is handled correctly
        req = self.rf.post('auth/signup')
        req.data = {
            'email':'abc@abc.com',
            'username':'benchlab user',
            'password':'123'
        }
    
        # Call signup request
        resp = self.auth.signup(req)
        # Verify that a bad request response code is thrown
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    # Failed email
    @mock.patch.object(AuthViewSet, 'send_activate_email')
    def test_signup_failed_send_email(self, mock_send_email):
        mock_send_email.return_value = False

        # Tests whether an invalid signup is handled correctly
        req = self.rf.post('auth/signup')
        req.data = {
            'email':'abc1@abc.com',
            'username':'benchlab user',
            'password':'123'
        }
    
        # Call signup request
        resp = self.auth.signup(req)
        
        # Verify that a bad request response code is thrown
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_non_existent_user(self):
        # Tests whether a non existen user cannot login (through email)
        response = self.auth.login_through_email(
            None,
            urlsafe_base64_encode(b'4d9856e8-f8ae-4077-8a20-c5c4b1b81600'),
            None
        )

        # Assert that the right error was thrown
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertIn("error=User%20not%20found", response.url)
    
    def test_login_invalid_token(self):
        # Tests whether a user cannot login with an invalid token
        response = self.auth.login_through_email(
            None,
            urlsafe_base64_encode(force_bytes(self.test_user.pk)),
            'test'
        )
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertIn('error=Invalid%20link', response.url)

    def test_login_inactive_user(self):
        response = self.auth.login_through_email(
            None,
            urlsafe_base64_encode(force_bytes(self.test_user_non_active.pk)),
            'test'
        )
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertIn('error=Account%20not%20activated', response.url)

    def test_send_login_mail_valid(self):
        #Construct request with valid credentials
        req = self.rf.post(
            '/',
        )
        req.data = {
                'email':'abc@abc.com',
                'username':'benchlab user',
                'password':'123'
            }
        
        # Send the email
        r = self.auth.send_login_email(req)
        
        # Check that the request was succesful
        self.assertEqual(r.status_code, status.HTTP_200_OK)

    
    # Test that no email will be sent if an invalid email is entered
    def test_send_login_non_existent(self):
        # Construct request with invalid email
        req = self.rf.post('/')
        req.data = {
            'email':'doesnt exist',
            'username':'test',
            'password':'123'
        }
        
        # Try to call the email with invalid credentials
        r = self.auth.send_login_email(req)
        
        # Assert that the right errors are thrown
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(r.data,  {"detail": "User not found."})
    
    # Test for error message during SMTP exception
    @mock.patch.object(EmailMessage, 'send', side_effect=SMTPException())
    def test_send_login_smtp_exception(self, mock_send):
        # Construct request with invalid email
        req = self.rf.post('/')
        req.data = {
            'email':'abc@abc.com',
            'username':'benchlab user',
            'password':'123'
        }
        
        # Try to call the email with invalid credentials
        r = self.auth.send_login_email(req)
        
        # Assert that the right errors are thrown
        self.assertEqual(r.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertEqual(r.data,  {"detail": "Failed to send email"})
    
    def test_activate_valid(self):
        # Test whether a valid user can activate their account
        response = self.auth.activate(
            None, # Encode the UUID
            urlsafe_base64_encode(force_bytes(self.test_user.id)), # Create a new valid token
            account_activation_token.make_token(self.test_user)
        )
        # Check that the user is directed to the front page
        self.assertEqual(type(response) == HttpResponseRedirect, True)

    def test_activate_non_existent(self):
        # Tests whether a non existent user can activate their account
        response = self.auth.activate(
            None,
            urlsafe_base64_encode(force_bytes('4d9856e8-f8ae-4077-8a20-c5c4b1b81600')), # Encode a random UUID that is not in the db
            None # Don't need to pass a valid token
        )
        # Check that the right error is thrown
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {"error": "User not found."})

    def test_activate_invalid_token(self):
        # Tests whether a user can activate with an invalid token
        response = self.auth.activate(
            None,
            urlsafe_base64_encode(force_bytes(self.test_user.pk)), # Encode the UUID
            'test' # Random invalid token
        )

        # Check whether error is thrown
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data,  {"error": "Invalid token."},'invalid token ,or user already activated"')

    