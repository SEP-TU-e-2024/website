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

#Make inline Result class, such that we can render them alongside Submissions
class AdminResult(admin.TabularInline):
    #Specify the model
    model = Result
    #No extra entries
    extra = 0

admin.site.register(Result) # Result table

#Defines interface for managing submissions
class AdminSubmission(admin.ModelAdmin):
    #Add the results inline
    inlines = [AdminResult]
    #Specify the model
    model = Submission

    #Method for getting the name of the problem for which the submission is for
    @admin.display(description='Problem Name')
    def get_problem_name(self,obj):
        return obj.problem.name

    #Allow searching by username
    search_fields = ['user__name']
    #Help text for searching
    search_help_text = 'Search for user'
    #Specify what attributes to display for the search page
    list_display = ('name', 'user', 'get_problem_name', 'created_at')

admin.site.register(Submission, AdminSubmission) # Submission table
admin.site.register(EvaluationSettings) # Evaluation table
admin.site.register(Simulator) # Simulator table
admin.site.register(Validator) # Validator table
admin.site.register(BenchmarkInstance) # Instance table

admin.site.register(Metric) # Metric table

class AdminSpecifiedProblem(admin.TabularInline):
    model = SpecifiedProblem
    extra = 1

class AdminProblemCategory(admin.ModelAdmin):
    inlines = [AdminSpecifiedProblem]
    list_display = ('id', 'name', 'description', 'simulator', 'validator', 'style', 'type')
admin.site.register(ProblemCategory, AdminProblemCategory)
admin.site.register(SpecifiedProblem)