from django.db import models
from django.contrib.auth.models import User


class Note(models.Model):
    OCTAVE_CHOICES = [(i, i) for i in range(1, 10)]
    name = models.CharField(max_length=3, default='C')
    octave = models.PositiveSmallIntegerField(choices=OCTAVE_CHOICES, default=0)

    def __str__(self):
        return str(self.name) + str(self.octave)


class Interval(models.Model):
    '''Two notes a specific distance (interval) apart.'''
    INTERVAL_TYPES = (
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
    name = models.CharField(choices=INTERVAL_TYPES, blank=True, max_length=20)
    top_note = models.ForeignKey(Note, related_name="top_note", null=True)
    bottom_note = models.ForeignKey(Note, related_name="bottom_note", null=True)

    def __str__(self):
        return str(self.name) + ", bottom: " + str(self.bottom_note) + ", top: " + str(self.top_note)

    class Meta:
        ordering = ['id']


class Student(models.Model):
    student_user = models.OneToOneField(User, primary_key=True)
    total_exercises_completed = models.PositiveIntegerField(default=0)
    results_private = models.BooleanField(default=True)

    def __str__(self):
        return str(self.student_user)


class StudentExercise(models.Model):
    STATUSES = (
        ('skipped', 'skipped'),
        ('correct', 'correct'),
        ('incorrect', 'incorrect')
    )
    student = models.ForeignKey(Student)
    exercise = models.ForeignKey(Interval)
    # the student's most recent result
    status = models.CharField(choices=STATUSES, default='skipped', max_length=10)
    times_skipped = models.PositiveIntegerField(default=0)
    times_correct = models.PositiveIntegerField(default=0)
    times_incorrect = models.PositiveIntegerField(default=0)

    def __str__(self):
        return "".join([str(self.student), ", ", str(self.exercise), ", ", str(self.status)])

    def total_times_given(self):
        '''
        Return the total number of times the exercise has been given to the
        student. Same as times_skipped + times_correct + times_incorrect.
        '''
        return self.times_skipped + self.times_correct + self.times_incorrect

    def total_times_answered(self):
        '''
        Return the total number of times the exercise was actually answered.
        Same as times_correct + times_incorrect.
        '''
        return self.times_correct + self.times_incorrect

    def percent_correct(self):
        '''
        Return the percentage of total correct answers relative to the total
        times given (including skips), rounded to one decimal place.
        '''
        return round((self.total_times_answered() / self.total_times_given()) * 100, 1)

    def percent_skipped(self):
        '''
        Return the percentage of times the exercise was given but not answered,
        rounded to one decimal place.
        '''
        return round((self.times_skipped / self.total_times_given()) * 100, 1)

    class Meta:
        ordering = ['-student', 'exercise']
