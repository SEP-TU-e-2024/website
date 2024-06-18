from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views.auth_view import AuthViewSet
from .views.download_from_blob_view import DownloadFromBlobViewSet
from .views.in_development_view import InDevelopmentView
from .views.leaderboard_entry_view import LeaderboardEntryView
from .views.leaderboard_view import LeaderboardView
from .views.problem_occurence_view import ProblemOccurrenceView
from .views.problem_view import Problems
from .views.submit_view import SubmitViewSet
from .views.account_view import AccountView
from .views.submission_view import SubmissionView

# Routers are standard for viewsets
api_router = DefaultRouter()
api_router.register(r"auth", AuthViewSet, basename="auth")
api_router.register(r"submit", SubmitViewSet, basename="submit")
api_router.register(
    r"download", DownloadFromBlobViewSet, basename="download"
)

# Urlpatterns are default for normal views
urlpatterns = [
    path("problems/occurrence_overview", Problems.as_view()),
    path("account", AccountView.as_view()),
    path("submissions", SubmissionView.as_view()),
    path(
        "problems/problem_occurrence/<str:problem_id>",
        ProblemOccurrenceView.as_view(),
        name="ProblemOccurrence",
    ),
    path("auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("activate/<uidb64>/<token>", AuthViewSet.activate, name="activate"),
    path("leaderboard/<str:problem_id>", LeaderboardView.as_view(), name="leaderboard"),
    path(
        "leaderboard_entry/<str:submission_id>",
        LeaderboardEntryView.as_view(),
        name="leaderboardEntry",
    ),
    path(
        "login/<uidb64>/<token>",
        AuthViewSet.login_through_email,
        name="login",
    ),
    path(
        "confirm_submission/<sidb64>/<token>",
        SubmitViewSet.confirm_submission,
        name="confirm_submission",
    ),
    path(
        "in_development",
        InDevelopmentView.as_view(),
        name="in_development"
    )
]

# Combining urls of routers and patterns
urlpatterns += api_router.urls
