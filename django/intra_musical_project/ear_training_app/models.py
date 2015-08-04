from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Note(models.Model):
    name = models.CharField(max_length=3, blank=True)
    octave = models.PositiveSmallIntegerField(default=0)

    def __unicode__(self): #__str__ in python3
        return str(self.name) + str(self.octave)

    def __str__(self): #__str__ in python3
        return str(self.name) + str(self.octave)

class IntervalType(models.Model):
    '''A list of predefined interval types / qualities'''
    quality = models.CharField(max_length=20, null=True, blank=True)

    def __unicode__(self): #__str__ in python3
        return "quality: " + str(self.quality)

    def __str__(self): #__str__ in python3
        return "quality: " + str(self.quality)

class Interval(models.Model):
    '''Two notes a specific distance (interval) apart.'''
    #TODO:??? make function to generate name based on top_note and bottom_note values
    name = models.ForeignKey(IntervalType, null=True, blank=True)
    top_note = models.ForeignKey(Note, related_name="top_note", null=True, blank=True)
    bottom_note = models.ForeignKey(Note, related_name="bottom_note", null=True, blank=True)

    def __unicode__(self): #__str__ in python3
        return "interval: " + str(self.name) + ", top: " + str(self.top_note) + ", bottom: " + str(self.bottom_note)

    def __str__(self): #__str__ in python3
        return "interval: " + str(self.name) + ", top: " + str(self.top_note) + ", bottom: " + str(self.bottom_note)

class ScaleType(models.Model):
    '''A list of scale types / qualities'''
    quality = models.CharField(max_length=25, null=True, blank=True)

    def __unicode__(self): #__str__ in python3
        return "(quality: " + str(self.quality) + ")"

    def __str__(self): #__str__ in python3
        return "(quality: " + str(self.quality) + ")"

class Scale(models.Model):
    '''A collection of notes organized by frequency.'''
    name = models.CharField(max_length=50, blank=True)
    tonic = models.ForeignKey(Note, null=True)
    quality = models.ForeignKey(ScaleType, null=True)
    ascending = models.BooleanField(default=True)

    def __unicode__(self): #__str__ in python3
        return "scale: " + str(self.name) + ", " + "quality: " + str(self.quality) + ", " + "ascending: " + str(self.ascending)

    def __str__(self): #__str__ in python3
        return "scale: " + str(self.name) + ", " + "quality: " + str(self.quality) + ", " + "ascending: " + str(self.ascending)

class ChordType(models.Model):
    '''A list of chord types / qualities'''
    quality = models.CharField(max_length=20, null=True, blank=True)

    def __unicode__(self): #__str__ in python3
        return "(quality: " + str(self.quality) + ")"

    def __str__(self): #__str__ in python3
        return "(quality: " + str(self.quality) + ")"

class Chord(models.Model):
    '''A set of at least three notes.'''
    root = models.ForeignKey(Note, null=True)
    quality = models.ForeignKey(ChordType, null=True)

    def __unicode__(self): #__str__ in python3
        return "(root: " + str(self.root) + ", " + "quality: " + str(self.quality) + ")"

    def __str__(self): #__str__ in python3
        return "(root: " + str(self.root) + ", " + "quality: " + str(self.quality) + ")"

class CourseSelection(models.Model):
    ''' Page containing all courses '''
    pass

class CourseProgress(models.Model):
    ''' Page where users can see their progress, exercises they've completed, learning stats, etc. '''
    pass

class Course(models.Model):
    ''' Page showing a list of all exercises in a course. '''
    INTERVALS = "Intervals"
    CHORDS = "Chords"
    SCALES = "Scales"
    COURSE_SUBJECTS = (
        (INTERVALS, INTERVALS),
        (CHORDS, CHORDS),
        (SCALES, SCALES),
    )
    num_exercises = models.PositiveSmallIntegerField(default=0, null=True)
    subject = models.CharField(max_length=15, choices=COURSE_SUBJECTS, default=INTERVALS)

    def __unicode__(self): #__str__ in python3
        return "course on " + str(self.subject)

    def __str__(self): #__str__ in python3
        return "course on " + str(self.subject)


class Exercise(models.Model):
    name = models.CharField(max_length=30, null=True, blank=True)
    interval_answer = models.ForeignKey(Interval, null=True, blank=True)
    scale_answer = models.ForeignKey(Scale, null=True, blank=True)
    chord_answer = models.ForeignKey(Chord, null=True, blank=True)

    def __unicode__(self): #__str__ in python3
        return str(self.name)

    def __str__(self): #__str__ in python3
        return str(self.name)


class ExercisePage(models.Model):
    exercise = models.ForeignKey(Exercise, null=True, blank=True)

    def __unicode__(self): #__str__ in python3
        return str(self.exercise)

    def __str__(self): #__str__ in python3
        return str(self.exercise)

class Student(models.Model):
    stuser = models.OneToOneField(User, primary_key=True)
    #course_stats = models.ManyToManyField(CourseStats, blank=True)
    total_exercises_completed = models.PositiveIntegerField(default=0, null=True, blank=True)
    courses_completed = models.PositiveSmallIntegerField(default=0, null=True, blank=True)

    def __unicode__(self): #__str__ in python3
        return "student: " + str(self.student)

    def __str__(self): #__str__ in python3
        return "student: " + str(self.student)

class CourseStats(models.Model):
    student = models.ForeignKey(Student)
    course = models.ForeignKey(Course)
    num_correct = models.PositiveSmallIntegerField(default=0, null=True, blank=True)
    num_incorrect = models.PositiveSmallIntegerField(default=0, null=True, blank=True)
    #Boolean
    course_complete = models.PositiveSmallIntegerField(null=True, blank=True)

    def __unicode__(self): #__str__ in python3
        return "CourseStats for " + str(self.course)

    def __str__(self): #__str__ in python3
        return "CourseStats for " + str(self.course)

    # def percent_complete(self.course, self.exercises_complete)
