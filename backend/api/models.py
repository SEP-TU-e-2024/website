from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models

# Create your models here.


class Problem(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class UserProfileManager(BaseUserManager):
    """Manager for user profiles"""

    def create_user(self, email, name, password=None):
        """Create a new user profile"""
        if not email:
            raise ValueError("User must have an email address")

        email = self.normalize_email(email)
        user = self.model(email=email, name=name)

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, name, password):
        """Create a new superuser profile"""
        user = self.create_user(email, name, password)
        user.is_superuser = True
        user.is_staff = True
        user.is_active = True

        user.save(using=self._db)

        return user


class UserProfile(AbstractBaseUser, PermissionsMixin):
    """Database model for users in the system"""
    
    id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=255, unique=True, null=False)
    name = models.CharField(max_length=255)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)

    objects = UserProfileManager()

    USERNAME_FIELD = "email"

    def __str__(self):
        """Return string representation of our user"""
        return self.email

class EvaluationSettings(models.Model):
    """Settings for a problem """

    id = models.AutoField(primary_key=True)
    cpu = models.IntegerField()
    time_limit = models.FloatField()

class StorageLocation(models.Model):
    """Storage path reference to locate file(s)"""

    id = models.AutoField(primary_key=True)
    filepath = models.CharField(max_length=256)

class Simulator(StorageLocation):
    """Program that will evaluate solvers"""
    pass

class Validator(StorageLocation):
    """Program that will evaluate solutions"""
    pass

class BenchmarkInstance(StorageLocation):
    """Single data instance for an optimization problem """
    pass

class ProblemCategory(models.Model):
    """Category of problem """

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=256) # For example TSP
    description = models.CharField(max_length=512) # Description of problem
    simulator_id = models.ForeignKey(Simulator, on_delete=models.CASCADE)
    validator_id = models.ForeignKey(Validator, on_delete=models.CASCADE)

class SpecifiedProblem(models.Model):
    """Occurence of problem, i.e. with certain settings """

    id = models.AutoField(primary_key=True)
    category_id = models.ForeignKey(ProblemCategory, on_delete=models.CASCADE)
    evualuation_settings = models.ForeignKey(EvaluationSettings, on_delete=models.CASCADE)
    metrics = models.CharField(max_length=512) # Problem specific metrics to use

class BenchmarkSet(models.Model):
    """Relational table between specified problems and their benchmark instances """

    problem_id = models.ForeignKey(SpecifiedProblem, on_delete=models.CASCADE)
    instance_id = models.ForeignKey(BenchmarkInstance, on_delete=models.CASCADE)

class Submission(models.Model):
    """Database model for submissions"""

    # TODO Link with blob storage for getting
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    problem_id = models.ForeignKey(SpecifiedProblem, on_delete=models.CASCADE)
    submission_name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

class Results(models.Model):
    """Table that stores result of a submission """

    id = models.AutoField(primary_key=True)
    submission_id = models.ForeignKey(Submission, on_delete=models.CASCADE)
    metric = models.CharField(max_length=512)
    score = models.DecimalField(decimal_places=2,max_digits=6)
    