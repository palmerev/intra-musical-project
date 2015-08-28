# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ear_training_app', '0013_coursestats_exercises_complete'),
    ]

    operations = [
        migrations.AddField(
            model_name='coursestats',
            name='num_skipped',
            field=models.PositiveSmallIntegerField(default=0, null=True, blank=True),
        ),
    ]
