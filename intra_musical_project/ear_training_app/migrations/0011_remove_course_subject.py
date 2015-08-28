# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ear_training_app', '0010_auto_20150804_2040'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='course',
            name='subject',
        ),
    ]
