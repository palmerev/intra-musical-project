from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Composer(models.Model):
    user = models.OneToOneField(User)

    def __unicode__(self): #__str__ in python3
        return "Composer " + str(self.user)

    def __str__(self): #__str__ in python3
        return "Composer " + str(self.user)


class Piece(models.Model):
    composer = models.ForeignKey(Composer, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    description = models.CharField(max_length=500, blank=True, null=True)

    def __unicode__(self): #__str__ in python3
        return str(self.name)

    def __str__(self): #__str__ in python3
        return str(self.name)


class MeterGroup(models.Model):
    piece = models.ForeignKey(Piece)
    name = models.CharField(max_length=255, blank=True, null=True)
    num_measures = models.PositiveSmallIntegerField(blank=True)
    meter_top = models.PositiveSmallIntegerField(blank=True)
    meter_bottom = models.PositiveSmallIntegerField(blank=True)
    unit_rythmic_value = models.PositiveSmallIntegerField(blank=True)
    beats_per_minute = models.PositiveSmallIntegerField(blank=True)

    def __unicode__(self): #__str__ in python3
        return str(self.name)

    def __str__(self): #__str__ in python3
        return str(self.name)
