

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
        self.auth = AuthViewSet()
        self.rf = RequestFactory()
        #create new user
        self.test_user = UserProfile.objects.create(
            email='abc@abc.com'
        )
    def test_sign_up_valid(self):
        req = self.rf.post(
            '/',
            data={
                'email':'test@benchlab.com',
                'username':'benchlab user',
                'password':'123'
            }
        )
        req.data = {
                'email':'test@benchlab.com',
                'username':'benchlab user',
                'password':'123'
            }
    
        self.auth.signup(req)
        
        link_index = mail.outbox[0].body.find('http://testserver/api/activate/')
        uid, token = mail.outbox[0].body[link_index:].strip().split('/')[-2:]
  
        uid_decoded = force_str(urlsafe_base64_decode(uid))
        user = UserProfile.objects.get(pk=uid_decoded)
        
        self.assertEqual(
            user.name,
            'benchlab user',
            'Registered username does not match name in database.'
        )
        self.assertEqual(
            user.email,
            'test@benchlab.com',
            'Registered email does not match emailin database.'
        )

        resp = self.auth.login_through_email(uid, token)
        self.assertEqual(
            resp.status_code,
            status.HTTP_302_FOUND,
            'Could not validate token'
        )

    def test_signup_invalid(self):
        req = self.rf.post(
            '/',
            data={
                'email':'asd',
                'username':'benchlab user',
                'password':'123'
            }
        )
        req.data = {
                'email':'asd',
                'username':'benchlab user',
                'password':'123'
            }
    
        resp = self.auth.signup(req)
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_login_non_existent(self):
        r = self.auth.login_through_email(
            urlsafe_base64_encode(b'4d9856e8-f8ae-4077-8a20-c5c4b1b81600'),
            None
        )
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(r.content, b'User error: Invalid UUID')

    def test_login_invalid_token(self):
        r = self.auth.login_through_email(urlsafe_base64_encode(force_bytes(self.test_user.pk)), 'test')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(r.content, b'User error: Invalid Token')

    def test_send_login_mail_valid(self):
        req = self.rf.post(
            '/',
            data={
                'email':'abc@abc.com',
                'username':'benchlab user',
                'password':'123'
            }
        )
        req.data = {
                'email':'abc@abc.com',
                'username':'benchlab user',
                'password':'123'
            }
        r = self.auth.send_login_email(req)
        self.assertEqual(r.status_code, status.HTTP_200_OK)

    def test_send_login_non_existent(self):
        req = self.rf.post(
            '/',
            data={
                'email':'doesnt exist',
                'username':'test',
                'password':'123'
            }
        )
        req.data = {
                'email':'doesnt exist',
                'username':'test',
                'password':'123'
            }
        r = self.auth.send_login_email(req)
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(r.content, b"User error: User not found")
    
    def test_send_login_smtp_exception(self):
        #TODO: figure out how to trigger SMPT exception
        pass
    
    def test_activate_valid(self):
        r = self.auth.activate(
            urlsafe_base64_encode(force_bytes(self.test_user.id)),
            account_activation_token.make_token(self.test_user)
        )
        self.assertEqual(type(r) == HttpResponseRedirect, True)

    def test_activate_non_existent(self):
        r = self.auth.activate(
            urlsafe_base64_encode(force_bytes('4d9856e8-f8ae-4077-8a20-c5c4b1b81600')),
            None
        )
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(r.content, b"User error: User not found")

    def test_activate_invalid_token(self):
        r = self.auth.activate(
            urlsafe_base64_encode(force_bytes(self.test_user.pk)),
            'test'
        )
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(r.content, b'User error: Invalid Token')

    