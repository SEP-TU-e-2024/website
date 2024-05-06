# from django.shortcuts import render
from django.http import HttpResponse
from .serializers import ProblemSerializer
from .models import Problem
from rest_framework import generics
from django.contrib.auth.models import User
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import EmailMessage
from django.shortcuts import redirect
from django.template.loader import render_to_string

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from .serializers import UserSerializer
from .tokens import account_activation_token


# Create your views here.
def main(request):
    return HttpResponse("Hello, world!")

class RetrieveProblems(generics.ListAPIView):
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer

class AuthViewSet(ViewSet):
    """
    This class is responsible for handling all request related to authenticating an user.
    """

    @action(detail=False, methods=['POST'])
    def signup(self, request):
        """ Handles the signing up for users.

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
        user.set_password(request.data['password'])
        user.is_active=False
        user.save()

        # Sending verification email
        email_send = self.activateEmail(request, user)
        if not email_send: 
            user.delete()
            return Response({"error": "Failed to send email"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({}, status=status.HTTP_201_CREATED)

    def activate(self, uidb64, token):
        """ Activates an user in the database

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
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except:
            user = None

        # Checks token and sets user to active
        if user is not None and account_activation_token.check_token(user, token) :
            user.is_active = True
            user.save()

        # Redirects to login
        return redirect('http://localhost:5173/login')

    def activateEmail(self, request, user):
        """ Sends activation email

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
        message = render_to_string("email_template.html", {
            "user": user.username,
            "domain": get_current_site(request).domain,
            "uid": urlsafe_base64_encode(force_bytes(user.pk)),
            "token": account_activation_token.make_token(user),
            "protocol": "https" if request.is_secure() else "http",
        })
        email = EmailMessage(mail_subject, message, from_email="benchlab@outlook.com", to={user.email})
        return email.send()