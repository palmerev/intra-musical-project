# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ear_training_app', '0016_auto_20150811_2338'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExerciseStatus',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('status', models.CharField(default=b'', max_length=25)),
            ],
        ),
        migrations.RemoveField(
            model_name='studentexercise',
            name='exercise_result',
        ),
        migrations.AlterField(
            model_name='course',
            name='num_exercises',
            field=models.PositiveSmallIntegerField(default=10, null=True),
        ),
        migrations.AddField(
            model_name='studentexercise',
            name='result',
            field=models.ForeignKey(to='ear_training_app.ExerciseStatus', null=True),
        ),
    ]
