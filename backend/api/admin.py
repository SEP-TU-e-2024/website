from django.contrib import admin

from .models import (
    BenchmarkInstance,
    EvaluationSettings,
    Metric,
    ProblemCategory,
    Result,
    Simulator,
    SpecifiedProblem,
    Submission,
    UserProfile,
    Validator,
)

# If a model should be administrated through an admin panel register them here.
admin.site.register(UserProfile) # User table
admin.site.register(Submission) # Submission table
admin.site.register(EvaluationSettings) # Evaluation table
admin.site.register(Simulator) # Simulator table
admin.site.register(Validator) # Validator table
admin.site.register(BenchmarkInstance) # Instance table
admin.site.register(Result) # Result table
admin.site.register(Metric) # Metric table

class AdminSpecifiedProblem(admin.TabularInline):
    model = SpecifiedProblem
    extra = 1

class AdminProblemCategory(admin.ModelAdmin):
    inlines = [AdminSpecifiedProblem]
    list_display = ('id', 'name', 'description', 'simulator', 'validator', 'style', 'type')

admin.site.register(ProblemCategory, AdminProblemCategory)
admin.site.register(SpecifiedProblem)