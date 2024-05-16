from django.contrib import admin

# Register your models here.
from .models import BenchmarkInstance, BenchmarkSet, EvaluationSettings, ProblemCategory, Results, Simulator, SpecifiedProblem, StorageLocation, Submission, UserProfile, Validator

admin.site.register(UserProfile)
admin.site.register(Submission)
admin.site.register(EvaluationSettings)
admin.site.register(StorageLocation)
admin.site.register(Simulator)
admin.site.register(Validator)
admin.site.register(BenchmarkInstance)
admin.site.register(ProblemCategory)
admin.site.register(SpecifiedProblem)
admin.site.register(BenchmarkSet)
admin.site.register(Results)
