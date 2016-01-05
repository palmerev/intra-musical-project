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
            name='Course',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, primary_key=True, verbose_name='ID')),
                ('num_exercises', models.PositiveSmallIntegerField(default=10)),
            ],
        ),
        migrations.CreateModel(
            name='CourseStats',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, primary_key=True, verbose_name='ID')),
                ('course_complete', models.BooleanField(default=False)),
                ('course', models.ForeignKey(to='ear_training_app.Course')),
            ],
            options={
                'verbose_name_plural': 'course stats',
            },
        ),
        migrations.CreateModel(
            name='CourseType',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, primary_key=True, verbose_name='ID')),
                ('title', models.CharField(default='untitled', max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Exercise',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, primary_key=True, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=30, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='ExerciseStatus',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, primary_key=True, verbose_name='ID')),
                ('status', models.CharField(choices=[('skipped', 'skipped'), ('correct', 'correct'), ('incorrect', 'incorrect')], default='', max_length=25)),
            ],
            options={
                'verbose_name_plural': 'exercise statuses',
            },
        ),
        migrations.CreateModel(
            name='Interval',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, primary_key=True, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='IntervalType',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, primary_key=True, verbose_name='ID')),
                ('quality', models.CharField(choices=[('unison', 'unison'), ('minor second', 'minor second'), ('major second', 'major second'), ('minor third', 'minor third'), ('major third', 'major third'), ('perfect fourth', 'perfect fourth'), ('tritone', 'tritone'), ('perfect fifth', 'perfect fifth'), ('minor sixth', 'minor sixth'), ('major sixth', 'major sixth'), ('minor seventh', 'minor seventh'), ('major seventh', 'major seventh'), ('octave', 'octave')], default='unison', max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='Note',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, primary_key=True, verbose_name='ID')),
                ('name', models.CharField(default='C', max_length=3)),
                ('octave', models.PositiveSmallIntegerField(choices=[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5), (6, 6), (7, 7), (8, 8), (9, 9)], default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('student_user', models.OneToOneField(primary_key=True, to=settings.AUTH_USER_MODEL, serialize=False)),
                ('total_exercises_completed', models.PositiveIntegerField(blank=True, default=0, null=True)),
                ('courses_completed', models.PositiveSmallIntegerField(blank=True, default=0, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='StudentExercise',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, primary_key=True, verbose_name='ID')),
                ('exercise', models.ForeignKey(to='ear_training_app.Exercise')),
                ('result', models.ForeignKey(blank=True, null=True, to='ear_training_app.ExerciseStatus')),
                ('student', models.ForeignKey(to='ear_training_app.Student')),
            ],
        ),
        migrations.AddField(
            model_name='interval',
            name='bottom_note',
            field=models.ForeignKey(related_name='bottom_note', to='ear_training_app.Note', null=True),
        ),
        migrations.AddField(
            model_name='interval',
            name='name',
            field=models.ForeignKey(default='unison', null=True, to='ear_training_app.IntervalType'),
        ),
        migrations.AddField(
            model_name='interval',
            name='top_note',
            field=models.ForeignKey(related_name='top_note', to='ear_training_app.Note', null=True),
        ),
        migrations.AddField(
            model_name='exercise',
            name='answer',
            field=models.ForeignKey(blank=True, null=True, to='ear_training_app.Interval'),
        ),
        migrations.AddField(
            model_name='exercise',
            name='course',
            field=models.ForeignKey(blank=True, null=True, to='ear_training_app.Course'),
        ),
        migrations.AddField(
            model_name='coursestats',
            name='student',
            field=models.ForeignKey(to='ear_training_app.Student'),
        ),
        migrations.AddField(
            model_name='course',
            name='course_type',
            field=models.ForeignKey(to='ear_training_app.CourseType', null=True),
        ),
    ]
