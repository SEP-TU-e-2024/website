# from django.shortcuts import render
import logging
import os

from azure.storage.blob import BlobServiceClient
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet


class DownloadProblemViewSet(ViewSet):
    """
    This class is responsible for handling all requests related to downloading a problem file from the blobstorage.
    """

    logger = logging.getLogger(__name__)

    @action(detail=False, methods=["POST"])
    def download_problem(self, request):
        try:
            file_path = request.data["file_path"]
            connection_string = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
            blob_service_client = BlobServiceClient.from_connection_string(
                str(connection_string)
            )
            container_name = os.getenv(
                "AZURE_STORAGE_SPECIFIED_PROBLEMS_CONTAINER_NAME"
            )
            blob_client = blob_service_client.get_blob_client(
                container=container_name, blob=f"{file_path}"
            )
            download_stream = blob_client.download_blob()

            return Response("Ok", status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
