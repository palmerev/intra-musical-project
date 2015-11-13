from django.db import models
from django.contrib.auth.models import User


class Note(models.Model):
    OCTAVE_CHOICES = [(i, i) for i in range(1, 10)]

    name = models.CharField(max_length=3, blank=True)
    octave = models.PositiveSmallIntegerField(choices=OCTAVE_CHOICES, default=0)

    def __str__(self):  # __str__ in python3
        return str(self.name) + str(self.octave)


class IntervalType(models.Model):
    '''A list of predefined interval types / qualities'''
    INTERVAL_TYPES = (
        ('unison', 'unison'),
        ('minor second', 'minor second'),
        ('major second', 'major second'),
        ('minor third', 'minor third'),
        ('major third', 'major third'),
        ('perfect fourth', 'perfect fourth'),
        ('tritone', 'tritone'),
        ('perfect fifth', 'perfect fifth'),
        ('minor sixth', 'minor sixth'),
        ('major sixth', 'major sixth'),
        ('minor seventh', 'minor seventh'),
        ('major seventh', 'major seventh'),
        ('octave', 'octave')
    )
    quality = models.CharField(max_length=20, choices=INTERVAL_TYPES, null=True, blank=True)

    def __str__(self):  # __str__ in python3
        return str(self.quality)


class Interval(models.Model):
    '''Two notes a specific distance (interval) apart.'''
    # TODO:??? make function to generate name based on top_note and bottom_note values
    name = models.ForeignKey(IntervalType, null=True, blank=True)
    top_note = models.ForeignKey(Note, related_name="top_note", null=True, blank=True)
    bottom_note = models.ForeignKey(Note, related_name="bottom_note", null=True, blank=True)

    def __str__(self):  # __str__ in python3
        return str(self.name) + ", top: " + str(self.top_note) + ", bottom: " + str(self.bottom_note)


class CourseType(models.Model):
    title = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):  # __str__ in python3
        return str(self.title)


class Course(models.Model):
    ''' Page showing a list of all exercises in a course. '''
    course_type = models.ForeignKey(CourseType, blank=True, null=True)
    num_exercises = models.PositiveSmallIntegerField(default=10, null=True)

    def __str__(self):  # __str__ in python3
        return "course on " + str(self.course_type)


class Exercise(models.Model):
    name = models.CharField(max_length=30, null=True, blank=True)
    answer = models.ForeignKey(Interval, null=True, blank=True)
    course = models.ForeignKey(Course, null=True, blank=True)

    def __str__(self):  # __str__ in python3
        return str(self.name)


class Student(models.Model):
    student_user = models.OneToOneField(User, primary_key=True)
    total_exercises_completed = models.PositiveIntegerField(default=0, null=True, blank=True)
    courses_completed = models.PositiveSmallIntegerField(default=0, null=True, blank=True)

    def __str__(self):  # __str__ in python3
        return str(self.student_user)


class ExerciseStatus(models.Model):
    STATUSES = (
        ('skipped', 'skipped'),
        ('correct', 'correct'),
        ('incorrect', 'incorrect')
    )

    status = models.CharField(max_length=25, default="", choices=STATUSES)

    def __str__(self):  # __str__ in python3
        return str(self.status)

    class Meta:
        verbose_name_plural = "exercise statuses"


class StudentExercise(models.Model):
    student = models.ForeignKey(Student)
    exercise = models.ForeignKey(Exercise)
    result = models.ForeignKey(ExerciseStatus, null=True, blank=True)

    def __str__(self):  # __str__ in python3
        return str(self.student) + ", " + str(self.exercise)


class CourseStats(models.Model):
    student = models.ForeignKey(Student)
    course = models.ForeignKey(Course)
    course_complete = models.BooleanField(default=False)

    def __str__(self):  # __str__ in python3
        return "CourseStats for " + str(self.course)

    class Meta:
        verbose_name_plural = "course stats"
