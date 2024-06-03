from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views.auth_view import AuthViewSet
from .views.leaderboard_entry_view import LeaderboardEntryView
from .views.leaderboard_view import LeaderboardView
from .views.problem_occurence_view import ProblemOccurrenceView
from .views.problem_view import Problems
from .views.submit_view import SubmitViewSet
from .views.views import RetrieveProblems, main

# Routers are standard for viewsets
api_router = DefaultRouter()
api_router.register(r"auth", AuthViewSet, basename="auth")
api_router.register(r"submit", SubmitViewSet, basename="submit")

# Urlpatterns are default for normal views
urlpatterns = [
    path("", main),
    path("problems", RetrieveProblems.as_view()),
    path("problems/occurrence_overview", Problems.as_view()),
    path(
        "problems/problem_occurrence/<str:problem_id>",
         ProblemOccurrenceView.as_view(),
         name='ProblemOccurrence'
        ),
    path("auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("activate/<uidb64>/<token>", AuthViewSet.activate, name="activate"),
    path(
        "leaderboard/<str:problem_id>",
        LeaderboardView.as_view(),
        name="leaderboard"
    ),
    path(
        "leaderboard_entry/<str:submission_id>",
        LeaderboardEntryView.as_view(),
        name="leaderboardEntry"
    ),
    path(
        "loginEmail/<uidb64>/<token>",
        AuthViewSet.login_through_email,
        name="loginEmail",
    ),
    path(
        "confirmSubmission/<sidb64>/<token>",
        SubmitViewSet.confirm_submission,
        name="confirmSubmission",
    )
]

# Combining urls of routers and patterns
urlpatterns += api_router.urls
