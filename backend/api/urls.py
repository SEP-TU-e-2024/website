from django.urls import path
from .views import main, RetrieveProblems

urlpatterns = [
    path("", main),
    path("problems", RetrieveProblems.as_view())
]
