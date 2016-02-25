from django.contrib import admin
from .models import Note
from .models import Interval
from .models import Student
from .models import StudentExercise


# Register your models here.
admin.site.register(Note)
admin.site.register(Interval)
admin.site.register(Student)
admin.site.register(StudentExercise)
