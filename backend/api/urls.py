from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import AuthViewSet, RetrieveProblems, SubmitZip, main

# Routers are standard for viewsets
api_router = DefaultRouter()
api_router.register(r"auth", AuthViewSet, basename="auth")
api_router.register(r"submit", SubmitZip, basename="submit")

# Urlpatterns are default for normal views
urlpatterns = [
    path("", main),
    path("problems", RetrieveProblems.as_view()),
    path("auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("activate/<uidb64>/<token>", AuthViewSet.activate, name="activate"),
    path(
        "loginEmail/<uidb64>/<token>",
        AuthViewSet.login_through_email,
        name="loginEmail",
    ),
]

# Combining urls of routers and patterns
urlpatterns += api_router.urls
