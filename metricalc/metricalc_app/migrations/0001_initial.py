# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Composer',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('user', models.OneToOneField(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='MeterGroup',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('num_measures', models.PositiveSmallIntegerField(blank=True)),
                ('meter_top', models.PositiveSmallIntegerField(blank=True)),
                ('meter_bottom', models.PositiveSmallIntegerField(blank=True)),
                ('unit_rythmic_value', models.PositiveSmallIntegerField(blank=True)),
                ('beats_per_minute', models.PositiveSmallIntegerField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Piece',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255, null=True, blank=True)),
                ('composer', models.ForeignKey(to='metricalc_app.Composer', null=True)),
            ],
        ),
        migrations.AddField(
            model_name='metergroup',
            name='piece',
            field=models.ForeignKey(to='metricalc_app.Piece'),
        ),
    ]
