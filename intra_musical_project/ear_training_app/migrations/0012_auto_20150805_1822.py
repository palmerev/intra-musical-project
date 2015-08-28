# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ear_training_app', '0011_remove_course_subject'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='exercisepage',
            name='exercise',
        ),
        migrations.DeleteModel(
            name='ExercisePage',
        ),
    ]
