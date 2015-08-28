# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('metricalc_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='piece',
            name='description',
            field=models.CharField(max_length=500, null=True, blank=True),
        ),
    ]
