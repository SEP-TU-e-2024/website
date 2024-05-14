from django.contrib import admin

# Register your models here.
from .models import Submission, UserProfile

admin.site.register(UserProfile)
admin.site.register(Submission)
