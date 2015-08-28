# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('metricalc_app', '0002_piece_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='metergroup',
            name='name',
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
    ]
