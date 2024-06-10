import uuid

from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models


class Problem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class UserProfileManager(BaseUserManager):
    """Manager for user profiles"""

    def create_user(self, email, password=None):
        """Create a new user profile"""
        if not email:
            raise ValueError("User must have an email address")

        email = self.normalize_email(email)
        user = self.model(email=email)

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password):
        """Create a new superuser profile"""
        user = self.create_user(email, password)
        user.is_superuser = True
        user.is_staff = True
        user.is_active = True

        user.save(using=self._db)

        return user


class UserProfile(AbstractBaseUser, PermissionsMixin):
    """Database model for users in the system"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(max_length=255, unique=True, null=False)
    name = models.CharField(max_length=255, null=True, blank=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    password = models.CharField(max_length=128, blank=True, null=True)

    objects = UserProfileManager()

    USERNAME_FIELD = "email"

    def __str__(self):
        """Return string representation of our user"""
        return self.email


class EvaluationSettings(models.Model):
    """Settings for a problem"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cpu = models.IntegerField()
    time_limit = models.FloatField()

    class Meta:
        verbose_name = "evaluation settings"
        verbose_name_plural = "evaluation settings"


class StorageLocation(models.Model):
    """Storage path reference to locate file(s)"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    filepath = models.CharField(max_length=256, null=True, blank=True)


class Simulator(StorageLocation):
    """Program that will evaluate solvers"""

    pass


class Validator(StorageLocation):
    """Program that will evaluate solutions"""

    pass


class BenchmarkInstance(StorageLocation):
    """Single data instance for an optimization problem"""

    pass


class SpecifiedProblem(models.Model):
    """Specified problem, potentially with evaluation settings"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=256, default="unnamed")
    evaluation_settings = models.ForeignKey(
        EvaluationSettings, on_delete=models.CASCADE, null=True, blank=True
    )
    metrics = models.CharField(max_length=512)  # Problem specific metrics to use
    category = models.ForeignKey(
        "ProblemCategory",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="specified_problems",
    )


class ProblemCategory(models.Model):
    """Category representing an optimization problem"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=256)  # For example TSP
    style = models.CharField(max_length=256, null=True)
    type = models.CharField(max_length=256, null=True)
    description = models.CharField(max_length=512)  # Description of problem
    simulator = models.ForeignKey(
        Simulator, on_delete=models.CASCADE, null=True, blank=True
    )
    validator = models.ForeignKey(
        Validator, on_delete=models.CASCADE, null=True, blank=True
    )

    class Meta:
        verbose_name = "problem category"
        verbose_name_plural = "problem categories"


class BenchmarkRelations(models.Model):
    """Relational table between specified problems and their benchmark instances"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    problem = models.ForeignKey(SpecifiedProblem, on_delete=models.CASCADE, null=True)
    instance = models.ForeignKey(BenchmarkInstance, on_delete=models.CASCADE, null=True)

    class Meta:
        verbose_name = "benchmark relations"
        verbose_name_plural = "benchmark relations"


class Submission(StorageLocation):
    """Database model for submissions"""

    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, null=True)
    problem_id = models.ForeignKey(SpecifiedProblem, on_delete=models.CASCADE)
    submission_name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)
    is_downloadable = models.BooleanField(default=False)


class Result(models.Model):
    """Table that stores result of a submission"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, null=True)
    metric = models.CharField(max_length=512)
    score = models.DecimalField(decimal_places=2, max_digits=6)
