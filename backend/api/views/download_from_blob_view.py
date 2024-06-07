# download_problem_view.py

import logging
import os
from azure.storage.blob import BlobServiceClient
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from django.http import FileResponse, HttpResponse
from api.models import SpecifiedProblem


class DownloadFromBlobViewSet(ViewSet):
    """
    This class is responsible for handling all requests related to downloading a problem file from the blobstorage.
    """

    logger = logging.getLogger(__name__)

    # TODO make this generic to download everything from the blob storage, rename file + url
    @action(detail=False, methods=["POST"])
    def download_file(self, request):
        try:
            container = request.data["container"]
            file_path = request.data["filepath"]
            connection_string = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
            blob_service_client = BlobServiceClient.from_connection_string(
                str(connection_string)
            )

            # add .zip to the file_path
            file_path = file_path
            print("File path" + str(file_path))
            blob_client = blob_service_client.get_blob_client(
                container=container, blob=file_path
            )
            download_stream = blob_client.download_blob()

            # Return the file content
            response = HttpResponse(
                download_stream.readall(), content_type="application/octet-stream"
            )
            response["Content-Disposition"] = (
                f"attachment; filename={os.path.basename(file_path)}"
            )
            return response
        except Exception as e:
            self.logger.error(f"An error occurred: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
