# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ear_training_app', '0006_auto_20150803_2246'),
    ]

    operations = [
        migrations.DeleteModel(
            name='CourseProgress',
        ),
        migrations.DeleteModel(
            name='CourseSelection',
        ),
        migrations.AddField(
            model_name='course',
            name='exercises',
            field=models.ForeignKey(blank=True, to='ear_training_app.Exercise', null=True),
        ),
        migrations.AlterField(
            model_name='course',
            name='subject',
            field=models.CharField(default=b'intervals', max_length=15, choices=[(b'intervals', b'Intervals'), (b'chords', b'Chords'), (b'scales', b'Scales')]),
        ),
    ]
