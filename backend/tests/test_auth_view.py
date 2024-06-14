

from api.models import UserProfile
from api.tokens import account_activation_token
from api.views.auth_view import AuthViewSet
from django.core import mail
from django.http import HttpResponseRedirect
from django.test import RequestFactory, TestCase
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import status


class TestAuthView(TestCase):
    def setUp(self):
        #Create mock AuthView object
        self.auth = AuthViewSet()
        #Create Request Factory object to create mock requests
        self.rf = RequestFactory()
        #Create a new user for testing
        self.test_user = UserProfile.objects.create(
            email='abc@abc.com'
        )
    def test_sign_up_valid(self):
        #Tests whether a valid signup works
        #Construct mock request for signing up
        req = self.rf.post(
            '/',
        )
        #Add parameters
        req.data = {
                'email':'test@benchlab.com',
                'username':'benchlab user',
                'password':'123'
            }
        #Call signup method on mock auth view object
        self.auth.signup(req)
        
        #Extract token and uid from the mail that was sent by the signup method
        link_index = mail.outbox[0].body.find('http://testserver/api/activate/')
        uid, token = mail.outbox[0].body[link_index:].strip().split('/')[-2:]
        print(f'Token: {token}')
        #Decode the uid
        uid_decoded = force_str(urlsafe_base64_decode(uid))
        #Get the user object from storage
        user = UserProfile.objects.get(pk=uid_decoded)
        
        #Check whether the mail was sent for the right user
        self.assertEqual(
            user.name,
            'benchlab user',
            'Registered username does not match name in database.'
        )
        #Check whether the mail was sent for the right email
        self.assertEqual(
            user.email,
            'test@benchlab.com',
            'Registered email does not match emailin database.'
        )


    def test_signup_invalid(self):
        #Tests whether an invalid signup is handled correctly
        #Make mockup request with invalid email
        req = self.rf.post(
            '/',
        )
        req.data = {
                'email':'asd',
                'username':'benchlab user',
                'password':'123'
            }
    
        #Call signup request
        resp = self.auth.signup(req)
        #Verify that a bad request response code is thrown
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_login_non_existent(self):
        #Tests whether a non existen user cannot login (through email)
        #Try to login with a random uid that does not exist in the db
        r = self.auth.login_through_email(
            urlsafe_base64_encode(b'4d9856e8-f8ae-4077-8a20-c5c4b1b81600'),
            None
        )
        #Assert that the right error was thrown
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)

        self.assertEqual(r.data,{'User error': 'User not found.'})

    def test_login_invalid_token(self):
        #Tests whether a user cannot login with an invalid token
        #Try to login with a valid user but with a random invalid token
        r = self.auth.login_through_email(urlsafe_base64_encode(force_bytes(self.test_user.pk)), 'test')
        
        #Check whether the right error was thrown
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(r.data, {"User error": "Invalid token."})

    def test_send_login_mail_valid(self):
        #Verifies whether send_login_mail method works on valid credentials

        #Construct request with valid credentials
        req = self.rf.post(
            '/',
        )
        req.data = {
                'email':'abc@abc.com',
                'username':'benchlab user',
                'password':'123'
            }
        
        #Send the email
        r = self.auth.send_login_email(req)
        #Check that the request was succesful
        self.assertEqual(r.status_code, status.HTTP_200_OK)

    def test_send_login_non_existent(self):
        #Test that no email will be sent if an invalid email is entered

        #Construct request with invalid email
        req = self.rf.post(
            '/',
        )
        req.data = {
                'email':'doesnt exist',
                'username':'test',
                'password':'123'
            }
        
        #Try to call the email with invalid credentials
        r = self.auth.send_login_email(req)
        #Assert that the right errors are thrown
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(r.data,  {"User error": "User not found."})
    
    def test_send_login_smtp_exception(self):
        #TODO: figure out how to trigger SMPT exception
        pass
    
    def test_activate_valid(self):
        #Test whether a valid user can activate their account
        r = self.auth.activate(
            #Encode the UUID
            urlsafe_base64_encode(force_bytes(self.test_user.id)),
            #Create a new valid token
            account_activation_token.make_token(self.test_user)
        )
        #Check that the user is directed to the front page
        self.assertEqual(type(r) == HttpResponseRedirect, True)

    def test_activate_non_existent(self):
        #Tests whether a non existent user can activate their account
        r = self.auth.activate(
            #Encode a random UUID that is not in the db
            urlsafe_base64_encode(force_bytes('4d9856e8-f8ae-4077-8a20-c5c4b1b81600')),
            #Don't need to pass a valid token
            None
        )
        #Check that the right error is thrown
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(r.data, {"User error": "User not found."})

    def test_activate_invalid_token(self):
        #Tests whether a user can activate with an invalid token
        r = self.auth.activate(
            #Encode the UUID
            urlsafe_base64_encode(force_bytes(self.test_user.pk)),
            #Random invalid token
            'test'
        )
        #Check whether error is thrown
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(r.data,  {"User error": "Invalid token."},'invalid token ,or user already activated"')

    