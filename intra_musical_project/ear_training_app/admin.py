from django.contrib import admin
from .models import Note
from .models import Interval
from .models import IntervalType
from .models import Course
from .models import CourseType
from .models import Exercise
from .models import Student
from .models import StudentExercise


class ExerciseInline(admin.TabularInline):
    model = Exercise
    extra = 3


class CourseAdmin(admin.ModelAdmin):
    fields = [
        'course_type', 'num_exercises'
    ]
    inlines = [ExerciseInline]


# Register your models here.
admin.site.register(Note)
admin.site.register(Interval)
admin.site.register(IntervalType)
admin.site.register(Course, CourseAdmin)
admin.site.register(CourseType)
admin.site.register(Exercise)
admin.site.register(Student)
admin.site.register(StudentExercise)
