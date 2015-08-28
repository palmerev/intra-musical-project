# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ear_training_app', '0015_remove_coursestats_num_skipped'),
    ]

    operations = [
        migrations.CreateModel(
            name='StudentExercise',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('exercise_result', models.CharField(default=b'skipped', max_length=9, choices=[(b'correct', b'correct'), (b'incorrect', b'incorrect'), (b'skipped', b'skipped')])),
                ('exercise', models.ForeignKey(to='ear_training_app.Exercise')),
                ('student', models.ForeignKey(to='ear_training_app.Student')),
            ],
        ),
        migrations.RemoveField(
            model_name='coursestats',
            name='num_correct',
        ),
        migrations.RemoveField(
            model_name='coursestats',
            name='num_incorrect',
        ),
    ]
