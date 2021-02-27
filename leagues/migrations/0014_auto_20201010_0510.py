# Generated by Django 3.0.7 on 2020-10-10 05:10

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leagues', '0013_auto_20201010_0504'),
    ]

    operations = [
        migrations.AlterField(
            model_name='league',
            name='adv_scheduling_limit',
            field=models.IntegerField(default=30, validators=[django.core.validators.MinValueValidator(0)]),
        ),
        migrations.AlterField(
            model_name='league',
            name='cancellation_period',
            field=models.IntegerField(default=2, validators=[django.core.validators.MinValueValidator(0)]),
        ),
        migrations.AlterField(
            model_name='league',
            name='default_max_backups',
            field=models.IntegerField(default=0, validators=[django.core.validators.MinValueValidator(0)]),
        ),
        migrations.AlterField(
            model_name='league',
            name='default_max_casts',
            field=models.IntegerField(default=0, validators=[django.core.validators.MinValueValidator(0)]),
        ),
    ]
