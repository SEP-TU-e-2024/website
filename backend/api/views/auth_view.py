# from django.shortcuts import render
import logging
import os
from smtplib import SMTPException

from django.contrib.sites.shortcuts import get_current_site
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import EmailMessage
from django.http import HttpResponse
from django.shortcuts import redirect
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework_simplejwt.tokens import RefreshToken

from ..models import UserProfile as User
from ..serializers import UserSerializer
from ..tokens import account_activation_token


def main(request):
    return HttpResponse("Hello, world!")


class AuthViewSet(ViewSet):
    """
    This class is responsible for handling all request related to authenticating an user.
    """
    logger = logging.getLogger(__name__)

    @action(detail=False, methods=["POST"])
    def signup(self, request):
        """Handles the signing up for users.

        Parameters
        ----------
        request : HTTP Post request
            Request containing 3 string attributes: email, username and password

        Notes
        -----
        The method creates an user in the database and puts them on non active, after which verification email is sent
        """

        # Converts JSON data into python object and checks validaty
        serializer = UserSerializer(data=request.data)
        if not serializer.is_valid():
            for field, messages in serializer.errors.items():
                return Response({"error": messages}, status=status.HTTP_400_BAD_REQUEST)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Setting user password and disabling user
        user = serializer.save()
        user.set_password(request.data["password"])
        user.is_active = False
        user.save()

        # Sending verification email
        email_send = self.send_activate_email(request, user)
        if not email_send:
            self.logger.warning("Failed to sent email, deleting user")
            user.delete()
            return Response(
                {"error": "Failed to send email"}, status=status.HTTP_400_BAD_REQUEST
            )
        return Response({}, status=status.HTTP_201_CREATED)

    def login_through_email(self, uidb64, token):
        """Handles loggin in through email.

        Parameters
        ----------
        uidb64 : string
            Base 64 encoded uid of an user
        token : string
            Unique identication token for user

        Returns
        -------
        redirect : HTTP response
            Redirects the user's browser to the token authenticator in the front end.
        """
        # Tries to get user from database
        user = None
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except ObjectDoesNotExist as e:
            self.logger.warning("Failed to find user")
            self.logger.warning(e)
            return HttpResponse({"User error" : "User not found."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Checks token and sets user to active
        if user is not None and account_activation_token.check_token(user, token):
            token = RefreshToken.for_user(user)
            response_data = {
                "refresh_token": str(token),
                "access_token": str(token.access_token),
            }
            redirect_url = f"{os.getenv('FRONTEND_URL')}tokens/?refresh_token={response_data['refresh_token']}&access_token={response_data['access_token']}"
            return redirect(redirect_url)
        self.logger.warning("Invalid token supplied")
        return HttpResponse({"User error" : "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["POST"])
    def send_login_email(self, request):
        """Sends activation email

        Parameters
        ----------
        request : HTTP Post request
            Original login request

        Notes
        -----
        Uses email templates defined by email_template_login.html
        """
        user = None
        try:
            # Gets user by email
            user = User.objects.get(email=request.data["email"])
        except ObjectDoesNotExist:
            self.logger.warning("Failed to find user")
            return HttpResponse({"User error" : "User not found."}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            # Email setup
            mail_subject = "Login into your account."
            message = render_to_string(
                "email_template_login.html",
                {
                    "user": user.name,
                    "domain": get_current_site(request).domain,
                    "uid": urlsafe_base64_encode(force_bytes(user.pk)),
                    "token": account_activation_token.make_token(user),
                    "protocol": "https" if request.is_secure() else "http",
                },
            )
            email = EmailMessage(
                mail_subject,
                message,
                from_email=os.getenv("EMAIL_FROM"),
                to={user.email},
            )
            email.send()
        except SMTPException:
            self.logger.warning("File to send email")
            HttpResponse({"Email erorr" : "Failed to sent email"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return HttpResponse({}, status=status.HTTP_200_OK)

    def send_activate_email(self, request, user):
        """Sends activation email

        Parameters
        ----------
        request : HTTP Post request
            Original signup request
        user : User
            User to send email to

        Notes
        -----
        Uses email templates defined by email_template.html

        Returns
        -------
        send : boolean
            Send email and returns whether it was succesfull
        """

        mail_subject = "Activate your user account."
        message = render_to_string(
            "email_template.html",
            {
                "user": user.name,
                "domain": get_current_site(request).domain,
                "uid": urlsafe_base64_encode(force_bytes(user.pk)),
                "token": account_activation_token.make_token(user),
                "protocol": "https" if request.is_secure() else "http",
            },
        )
        email = EmailMessage(
            mail_subject, message, from_email=os.getenv("EMAIL_FROM"), to={user.email}
        )
        return email.send()

    def activate(self, uidb64, token):
        """Activates an user in the database

        Parameters
        ----------
        uidb64 : string
            Base 64 encoded uid of an user
        token : string
            Unique identication token for user

        Returns
        -------
        redirect : HTTP response
            Redirects the user's browser to the login page URL.
        """

        # Decodes uid and gets user object from database
        user = None
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except ObjectDoesNotExist:
            self.logger.warning("Failed to locate user")
            return HttpResponse({"User error" : "User not found."}, status=status.HTTP_400_BAD_REQUEST)

        # Checks token and sets user to active
        if user is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            return redirect(f'{os.getenv("FRONTEND_URL")}login')

        # Redirects to login
        self.logger.warning("Invalid token supplied")
        return HttpResponse({"User error" : "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)