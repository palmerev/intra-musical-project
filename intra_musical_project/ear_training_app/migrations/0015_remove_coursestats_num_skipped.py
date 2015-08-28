# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ear_training_app', '0014_coursestats_num_skipped'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='coursestats',
            name='num_skipped',
        ),
    ]
