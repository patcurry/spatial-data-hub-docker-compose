# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-07-06 11:18
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('keywords', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='keyword',
            name='datasets',
        ),
    ]
