# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ear_training_app', '0009_auto_20150804_2037'),
    ]

    operations = [
        migrations.RenameField(
            model_name='coursetype',
            old_name='subject',
            new_name='title',
        ),
    ]
