from api.models import UserProfile, UserProfileManager
from django.contrib.auth.hashers import PBKDF2PasswordHasher
from django.test import TestCase


class TestUserProfileManager(TestCase):
    def setUp(self):
        #Set up mock profile manager
        self.upm = UserProfileManager()
        #Specify the user model
        self.upm.model = UserProfile
        
    def test_no_email_error(self):
        #Check whether profile manager raises value error if no email is provided
        with self.assertRaises(ValueError):
            #Try to create account without email
            self.upm.create_user(email="", password='abc')
    
    def test_succesful_creation(self):
        #Create regular user with valid email
        usr = self.upm.create_user(
            email='test@benchlab.com',
            password='abc'
        )
        #Check whether the email is stored correctly
        self.assertEqual(usr.email, 'test@benchlab.com')

        #Create hasher object for hashing the password
        hasher = PBKDF2PasswordHasher()
        #Check whether the password hashes match
        self.assertEqual(
            hasher.verify('abc', usr.password),
            True,
            'Password hash does not match'
        )

        #Test __str__ method
        self.assertEqual(str(usr), 'test@benchlab.com')

    def test_create_super_user(self):
        #Create a superuser
        usr = self.upm.create_superuser(
            email='super@benchlab.com',
            password='admin'
        )
        #Check whether the super user has the right privileges
        self.assertEqual(usr.is_superuser, True)
        self.assertEqual(usr.is_staff, True)
        self.assertEqual(usr.is_active, True)
        


