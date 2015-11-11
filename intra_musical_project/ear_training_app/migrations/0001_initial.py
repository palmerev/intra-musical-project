# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0006_require_contenttypes_0002'),
    ]

    operations = [
        migrations.CreateModel(
            name='Chord',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
            ],
        ),
        migrations.CreateModel(
            name='ChordType',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('quality', models.CharField(blank=True, max_length=20, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('num_exercises', models.PositiveSmallIntegerField(default=10, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='CourseStats',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('course_complete', models.BooleanField(default=False)),
                ('exercises_complete', models.BooleanField(default=False)),
                ('course', models.ForeignKey(to='ear_training_app.Course')),
            ],
            options={
                'verbose_name_plural': 'course stats',
            },
        ),
        migrations.CreateModel(
            name='CourseType',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('title', models.CharField(blank=True, max_length=50, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Exercise',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('name', models.CharField(blank=True, max_length=30, null=True)),
                ('chord_answer', models.ForeignKey(blank=True, null=True, to='ear_training_app.Chord')),
                ('course', models.ForeignKey(blank=True, null=True, to='ear_training_app.Course')),
            ],
        ),
        migrations.CreateModel(
            name='ExerciseStatus',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('status', models.CharField(default='', max_length=25)),
            ],
            options={
                'verbose_name_plural': 'exercise statuses',
            },
        ),
        migrations.CreateModel(
            name='Interval',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
            ],
        ),
        migrations.CreateModel(
            name='IntervalType',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('quality', models.CharField(blank=True, max_length=20, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Note',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('name', models.CharField(blank=True, max_length=3)),
                ('octave', models.PositiveSmallIntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Scale',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('name', models.CharField(blank=True, max_length=50)),
                ('ascending', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='ScaleType',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('quality', models.CharField(blank=True, max_length=25, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('stuser', models.OneToOneField(primary_key=True, to=settings.AUTH_USER_MODEL, serialize=False)),
                ('total_exercises_completed', models.PositiveIntegerField(default=0, blank=True, null=True)),
                ('courses_completed', models.PositiveSmallIntegerField(default=0, blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='StudentExercise',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('exercise', models.ForeignKey(to='ear_training_app.Exercise')),
                ('result', models.ForeignKey(blank=True, null=True, to='ear_training_app.ExerciseStatus')),
                ('student', models.ForeignKey(to='ear_training_app.Student')),
            ],
        ),
        migrations.AddField(
            model_name='scale',
            name='quality',
            field=models.ForeignKey(to='ear_training_app.ScaleType', null=True),
        ),
        migrations.AddField(
            model_name='scale',
            name='tonic',
            field=models.ForeignKey(to='ear_training_app.Note', null=True),
        ),
        migrations.AddField(
            model_name='interval',
            name='bottom_note',
            field=models.ForeignKey(blank=True, null=True, related_name='bottom_note', to='ear_training_app.Note'),
        ),
        migrations.AddField(
            model_name='interval',
            name='name',
            field=models.ForeignKey(blank=True, null=True, to='ear_training_app.IntervalType'),
        ),
        migrations.AddField(
            model_name='interval',
            name='top_note',
            field=models.ForeignKey(blank=True, null=True, related_name='top_note', to='ear_training_app.Note'),
        ),
        migrations.AddField(
            model_name='exercise',
            name='interval_answer',
            field=models.ForeignKey(blank=True, null=True, to='ear_training_app.Interval'),
        ),
        migrations.AddField(
            model_name='exercise',
            name='scale_answer',
            field=models.ForeignKey(blank=True, null=True, to='ear_training_app.Scale'),
        ),
        migrations.AddField(
            model_name='coursestats',
            name='student',
            field=models.ForeignKey(to='ear_training_app.Student'),
        ),
        migrations.AddField(
            model_name='course',
            name='course_type',
            field=models.ForeignKey(blank=True, null=True, to='ear_training_app.CourseType'),
        ),
        migrations.AddField(
            model_name='chord',
            name='quality',
            field=models.ForeignKey(to='ear_training_app.ChordType', null=True),
        ),
        migrations.AddField(
            model_name='chord',
            name='root',
            field=models.ForeignKey(to='ear_training_app.Note', null=True),
        ),
    ]
