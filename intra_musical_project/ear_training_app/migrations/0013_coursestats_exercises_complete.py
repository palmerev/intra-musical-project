# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ear_training_app', '0012_auto_20150805_1822'),
    ]

    operations = [
        migrations.AddField(
            model_name='coursestats',
            name='exercises_complete',
            field=models.PositiveSmallIntegerField(default=0, null=True, blank=True),
        ),
    ]
