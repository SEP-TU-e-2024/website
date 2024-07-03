

from unittest import mock

from api.models import StorageLocation
from api.views.download_from_blob_view import DownloadFromBlobViewSet
from azure.storage.blob import BlobServiceClient
from django.http import HttpResponse

from .create_test_data import CreateTestData


class TestDownloadFromBlob(CreateTestData):
    def setUp(self):
        super(TestDownloadFromBlob, self).setUp()

        # Create mock DownloadFromBlobViewSet object
        self.view = DownloadFromBlobViewSet()

        # Create mock request
        self.req = self.rf.get('/download/storage_location', {'id': self.storage_location.id})

    # Succesfull Download
    @mock.patch.object(DownloadFromBlobViewSet, 'download_file')
    def test_download_valid(self, mock_download):
        # Mock download
        mock_download.return_value = HttpResponse(status=200)
        
        # Call get method on mock account view object
        response = self.view.storage_location(self.req)

        # Check reponses
        self.assertEqual(response.status_code, 200)

    # Download succesfull Azure Mock
    @mock.patch.object(BlobServiceClient, 'from_connection_string')
    def test_download_valid_azure(self, mock_connection):
        # Call get method on mock account view object
        response = self.view.storage_location(self.req)

        # Check reponses
        self.assertEqual(response.status_code, 200)

    # Download Failed
    @mock.patch.object(DownloadFromBlobViewSet, 'download_file')
    def test_download_failed(self, mock_download):
        # Mock download
        mock_download.return_value = HttpResponse(status=400)
        
        # Call get method on mock account view object
        response = self.view.storage_location(self.req)

        # Check reponses
        self.assertEqual(response.status_code, 400)

    # Download Failed Azure Mock
    def test_download_failed_azure(self):
        # Call get method on mock account view object
        response = self.view.storage_location(self.req)

        # Check reponses
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data,  {"error": "File download failed"}, 'File download failed"')

    # Object not found
    def test_download_not_found(self):
        # Mock request
        self.req = self.rf.get('/download/storage_location', {'id': "f9e9cb40-9f4c-4fa3-8fa5-2004f4e02111"})
        
        # Call get method on mock account view object
        response = self.view.storage_location(self.req)

        # Check reponses
        self.assertEqual(response.status_code, 404)

    # Object not downloadable
    def test_download_not_allowed(self):
        # Create storage location
        self.storage_location = StorageLocation.objects.create(
            container="submissions",
            filepath="test.zip",
            is_downloadable = False
        )

        self.req = self.rf.get('/download/storage_location', {'id': self.storage_location.id})
        
        # Call get method on mock account view object
        response = self.view.storage_location(self.req)

        # Check reponses
        self.assertEqual(response.status_code, 403)
