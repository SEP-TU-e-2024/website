# from django.shortcuts import render
import logging
import os

from azure.storage.blob import BlobServiceClient
from django.contrib.sites.shortcuts import get_current_site
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import EmailMessage
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from ..models import Submission
from ..serializers import SubmissionSerializer
from ..tokens import submission_confirm_token

class SubmitViewSet(ViewSet):
    """
    This class is responsible for handling all requests related to submitting a zip file.
    """

    @action(detail=False, methods=["POST"])
    def upload_submission(self, request):
        request_files = request.FILES
        if not request_files:
            logger = logging.getLogger(__name__) 
            logger.warning("No file provided")
            return HttpResponse(
                {"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Checks validity of submitted data
        serializer = SubmissionSerializer(data=request.data)
        if not serializer.is_valid():
            for field, messages in serializer.errors.items():
                return Response({"error": messages}, status=status.HTTP_400_BAD_REQUEST)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Stores submission in database
        submission = serializer.save()
        if not self.save_to_blob_storage(request_files, submission.id):
            logger = logging.getLogger(__name__) 
            logger.warning("Failed to upload file")
            return HttpResponse(
                {"error": "An error occurred during file upload"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # Check if user is logged in
        # TODO Use proper session management
        if request.data["logged_in"] == "True":
            submission.is_verified = True
            submission.save()
            return HttpResponse({}, status=status.HTTP_200_OK)
        
        # User not logged in, hence sent email
        if not self.send_submission_email(request, submission):
            logger = logging.getLogger(__name__) 
            logger.warning("Failed to sent email, deleting submission")
            submission.delete()
            return HttpResponse(
                {"error": "An error occurred during sending of verification email"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
        return HttpResponse({}, status=status.HTTP_200_OK)
        

    def send_submission_email(self, request, submission):
        """Send email to confirm submission

        Parameters
        ----------
        request : HTTP Post request
            Original submission request
        submission : Submission object
            Used for creating the token

        Returns
        -------
        is_send : bool
        """

        # Email setup
        mail_subject = "Confirm your submission."
        message = render_to_string(
            "email_template_confirm_submission.html",
            {
                "domain": get_current_site(request).domain,
                "sid": urlsafe_base64_encode(force_bytes(submission.id)),
                "token": submission_confirm_token.make_token(submission),
                "protocol": "https" if request.is_secure() else "http",
            },
        )
        email = EmailMessage(
            mail_subject,
            message,
            from_email=os.getenv("EMAIL_FROM"),
            to={request.data["email"]},
        )
        return email.send()

    def confirm_submission(self, sidb64, token):
        """Activates submission in backend

        Parameters
        ----------
        sidb64 : string
            Base 64 encoded submission id
        token : string
            Unique identication token for submission
        """

        # Decodes sid and gets submission information from database
        submission = None
        try:
            sid = force_str(urlsafe_base64_decode(sidb64))
            submission = Submission.objects.get(id=sid)
        except ObjectDoesNotExist as e:
            logger = logging.getLogger(__name__) 
            logger.warning("Could not locate user")
            return HttpResponse({"User error" : "User not found."}, status=status.HTTP_400_BAD_REQUEST)

        # Checks token validity
        if submission is not None and submission_confirm_token.check_token(
            submission, token
        ):
            # Puts submission to verified
            submission.is_verified = True
            submission.save()
            return HttpResponse({}, status=status.HTTP_200_OK)
        return HttpResponse({"Submission error" : "Submission not found"}, status=status.HTTP_400_BAD_REQUEST)

    def save_to_blob_storage(self, file, submission_id):
        """Saves a file to Azure Blob Storage

        Parameters
        ----------
        file : File
            File to be saved (zip format)
        submission_id : string
            Unique identifier for submission
        """

        try:
            connection_string = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
            blob_service_client = BlobServiceClient.from_connection_string(
                str(connection_string)
            )
            container_name = os.getenv("AZURE_STORAGE_CONTAINER_NAME")
            blob_client = blob_service_client.get_blob_client(
                container=container_name, blob=f"{submission_id}.zip"
            )

            with file["file"].open() as data:
                blob_client.upload_blob(data)

            return True

        except Exception as e:
            logger = logging.getLogger(__name__) 
            logger.warning("File failed to upload")
            return False
