# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ear_training_app', '0007_auto_20150804_1909'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='course',
            name='exercises',
        ),
        migrations.AddField(
            model_name='exercise',
            name='course',
            field=models.ForeignKey(blank=True, to='ear_training_app.Course', null=True),
        ),
    ]
