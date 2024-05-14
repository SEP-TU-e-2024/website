import hashlib
from datetime import datetime, timedelta, timezone

import six
from django.contrib.auth.tokens import PasswordResetTokenGenerator


class AccountActivationTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return (
            six.text_type(user.pk)
            + six.text_type(timestamp)
            + six.text_type(user.is_active)
        )


class SubmissionConfirmTokenGenerator:
    TOKEN_EXPIRATION_TIME = 0.5  # Token expiration time in hours

    def make_token(self, submission):
        """Hashes unique properties of a submission object into a unique string"""
        hash_value = hashlib.sha256(
            (
                str(submission.id)
                + str(submission.created_at)
                + str(submission.is_verified)
            ).encode()
        ).hexdigest()
        return hash_value

    def check_token(self, submission, token):
        """Compares 2 hash tokens on equality and expiration"""
        if not submission or not token:
            return False

        token_confirm = self.make_token(submission)
        return token == token_confirm and not self.token_expired(submission.created_at)

    def token_expired(self, submission_created_at):
        """Checks if token is expired"""
        expiration_time = submission_created_at + timedelta(
            hours=self.TOKEN_EXPIRATION_TIME
        )
        # Make datetime.now() aware of timezone
        now = datetime.now(timezone.utc)
        return expiration_time < now


account_activation_token = AccountActivationTokenGenerator()
submission_confirm_token = SubmissionConfirmTokenGenerator()
