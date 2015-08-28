# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ear_training_app', '0003_auto_20150731_0608'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='student',
            name='course_stats',
        ),
        migrations.AddField(
            model_name='coursestats',
            name='student',
            field=models.ForeignKey(default=1, to='ear_training_app.Student'),
            preserve_default=False,
        ),
    ]
