
from api.models import UserProfile
from api.views.auth_view import AuthViewSet
from django.core import mail
from django.test import RequestFactory, TestCase
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from rest_framework import status


class TestAuthView(TestCase):
    def setUp(self):
        self.auth = AuthViewSet()
        self.rf = RequestFactory()

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
                'email':'',
                'username':'benchlab user',
                'password':'123'
            }
        )
        req.data = {
                'email':'',
                'username':'benchlab user',
                'password':'123'
            }
    
        self.auth.signup(req)


