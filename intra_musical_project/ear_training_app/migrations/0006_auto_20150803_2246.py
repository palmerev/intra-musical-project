# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ear_training_app', '0005_auto_20150731_2045'),
    ]

    operations = [
        migrations.RenameField(
            model_name='coursestats',
            old_name='exercises_complete',
            new_name='num_correct',
        ),
        migrations.AddField(
            model_name='coursestats',
            name='num_incorrect',
            field=models.PositiveSmallIntegerField(default=0, null=True, blank=True),
        ),
    ]
