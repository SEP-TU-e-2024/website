import os
from datetime import datetime, timedelta, timezone

import six
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.crypto import constant_time_compare, salted_hmac


class AccountActivationTokenGenerator(PasswordResetTokenGenerator):
    """
    Generator for creating a signed, hashed key unique to a user
    """
    def _make_hash_value(self, user, timestamp):
        return (
            six.text_type(user.pk)
            + six.text_type(timestamp)
            + six.text_type(user.is_active)
        )


class SubmissionConfirmTokenGenerator:
    """
    Generator for creating a signed, hashed key unique to a submission
    """
    TOKEN_EXPIRATION_TIME = 0.5  # Token expiration time in hours
    secret = os.getenv("SECRET_KEY") # Secret key to sign with
    salt_key = "api.tokens.SubmissionConfirmTokenGenerator" # Salt key

    def make_token(self, submission):
        """Hashes unique properties of a submission object into a unique string"""
        hmac_hash = salted_hmac(
            self.salt_key,
            ( str(submission.id)
            + str(submission.created_at)
            + str(submission.is_verified)
            ).encode(),
            secret=self.secret,
            algorithm='sha256'
        ).hexdigest()[::2] # Limit url length by dividing in half

        return hmac_hash

    def check_token(self, submission, token):
        """Compares 2 hash tokens on equality and expiration"""
        
        # Checks for existence of submisison and token
        if not submission or not token:
            return False

        # Creates token with given submission
        token_confirm = self.make_token(submission)

        # Constant time compares tokens to hide information
        return constant_time_compare(token, token_confirm) and not self.token_expired(submission.created_at)

    def token_expired(self, submission_created_at):
        """Checks if token is expired"""

        # Computes expiration time
        expiration_time = submission_created_at + timedelta(
            hours=self.TOKEN_EXPIRATION_TIME
        )
        # Make datetime.now() aware of timezone
        now = datetime.now(timezone.utc)
        return expiration_time < now

# Instantiates the generators
account_activation_token = AccountActivationTokenGenerator()
submission_confirm_token = SubmissionConfirmTokenGenerator()
