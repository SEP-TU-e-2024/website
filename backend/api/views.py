# from django.shortcuts import render
from django.http import HttpResponse
from .serializers import ProblemSerializer
from .models import Problem, UploadFile
from rest_framework import generics
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import EmailMessage
from django.shortcuts import redirect
from django.template.loader import render_to_string
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient

from .serializers import UserSerializer
from .tokens import account_activation_token
from .models import UserProfile as User
import os


# Create your views here.
def main(request):
    return HttpResponse("Hello, world!")

class RetrieveProblems(generics.ListAPIView):
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer

class SubmitZip(ViewSet):
    """
    This class is responsible for handling all requests related to submitting a zip file.
    """
    
    @action(detail=False, methods=['POST'])
    def upload_file(self, request):
        try:
            uploaded_file = request.FILES
            if not uploaded_file:
                return HttpResponse({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

            connection_string = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
            print(connection_string)
            blob_service_client = BlobServiceClient.from_connection_string(str(connection_string))
            container_name = os.getenv("AZURE_STORAGE_CONTAINER_NAME")
            blob_client = blob_service_client.get_blob_client(container=container_name, blob=uploaded_file['file'].name)
            
            with uploaded_file['file'].open() as data:    
                blob_client.upload_blob(data)

            return HttpResponse({'message': 'File uploaded successfully'}, status=status.HTTP_200_OK)
        
        except Exception as e:
            print("Error: " + str(e))
            return HttpResponse({'error': 'An error occurred during file upload'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
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
        email_send = self.send_activate_email(request, user)
        if not email_send: 
            user.delete()
            return Response({"error": "Failed to send email"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({}, status=status.HTTP_201_CREATED)

    def login_through_email(self, uidb64, token):
        """ Handles loggin in through email.

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
        except Exception as e:
            print(e)

        # Checks token and sets user to active
        if user is not None and account_activation_token.check_token(user, token) :
            token = RefreshToken.for_user(user)
            response_data = {
                'refresh_token': str(token),
                'access_token': str(token.access_token),
            }
            redirect_url =  f"{os.getenv('FRONTEND_URL')}tokens/?refresh_token={response_data['refresh_token']}&access_token={response_data['access_token']}"
            return redirect(redirect_url)            
        return HttpResponse({}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'])
    def send_login_email(self, request):
        """ Sends activation email

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

            # Email setup
            mail_subject = "Login into your account."
            message = render_to_string("email_template_login.html", {
                "user": user.name,
                "domain": get_current_site(request).domain,
                "uid": urlsafe_base64_encode(force_bytes(user.pk)),
                "token": account_activation_token.make_token(user),
                "protocol": "https" if request.is_secure() else "http",
            })
            email = EmailMessage(mail_subject, message, from_email="benchlab@outlook.com", to={user.email})
            email.send()
            return HttpResponse({}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
        return HttpResponse({}, status=status.HTTP_400_BAD_REQUEST)

    def send_activate_email(self, request, user):
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
            "user": user.name,
            "domain": get_current_site(request).domain,
            "uid": urlsafe_base64_encode(force_bytes(user.pk)),
            "token": account_activation_token.make_token(user),
            "protocol": "https" if request.is_secure() else "http",
        })
        email = EmailMessage(mail_subject, message, from_email="benchlab@outlook.com", to={user.email})
        return email.send()
    
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
        user = None
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except Exception as e:
            print(e)

        # Checks token and sets user to active
        if user is not None and account_activation_token.check_token(user, token) :
            user.is_active = True
            user.save()

        # Redirects to login
        return redirect(f'{os.getenv("FRONTEND_URL")}login')
    
   