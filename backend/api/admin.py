from django.contrib import admin

from .models import (
    BenchmarkInstance,
    BenchmarkRelations,
    EvaluationSettings,
    ProblemCategory,
    Result,
    Simulator,
    SpecifiedProblem,
    StorageLocation,
    Submission,
    UserProfile,
    Validator,
)

# If a model should be administrated through an admin panel register them here.
admin.site.register(UserProfile) # User table
admin.site.register(Submission) # Submission table
admin.site.register(EvaluationSettings) # Evaluation table
admin.site.register(StorageLocation) # Storage table
admin.site.register(Simulator) # Simulator table
admin.site.register(Validator) # Validator table
admin.site.register(BenchmarkInstance) # Instance table
admin.site.register(ProblemCategory) # Category table
admin.site.register(SpecifiedProblem) # Problem table
admin.site.register(BenchmarkRelations) # Relation table
admin.site.register(Result) # Result table
