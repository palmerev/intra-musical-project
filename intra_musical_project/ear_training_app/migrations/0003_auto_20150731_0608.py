# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0006_require_contenttypes_0002'),
        ('ear_training_app', '0002_auto_20150724_1835'),
    ]

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('num_exercises', models.PositiveSmallIntegerField(default=0, null=True)),
                ('subject', models.CharField(default=b'Intervals', max_length=15, choices=[(b'Intervals', b'Intervals'), (b'Chords', b'Chords'), (b'Scales', b'Scales')])),
            ],
        ),
        migrations.CreateModel(
            name='CourseStats',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('exercises_complete', models.PositiveSmallIntegerField(default=0, null=True, blank=True)),
                ('course_complete', models.PositiveSmallIntegerField(null=True, blank=True)),
                ('course', models.ForeignKey(to='ear_training_app.Course')),
            ],
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('student', models.OneToOneField(primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('total_exercises_completed', models.PositiveIntegerField(default=0, null=True, blank=True)),
                ('courses_completed', models.PositiveSmallIntegerField(default=0, null=True, blank=True)),
                ('course_stats', models.ManyToManyField(to='ear_training_app.CourseStats', blank=True)),
            ],
        ),
        migrations.DeleteModel(
            name='CourseContents',
        ),
    ]
