# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ear_training_app', '0017_auto_20150814_1719'),
    ]

    operations = [
        migrations.AlterField(
            model_name='studentexercise',
            name='result',
            field=models.ForeignKey(blank=True, to='ear_training_app.ExerciseStatus', null=True),
        ),
    ]
