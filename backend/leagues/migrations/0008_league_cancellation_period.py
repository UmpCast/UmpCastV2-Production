# Generated by Django 3.0.7 on 2020-08-07 02:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leagues', '0007_auto_20200731_0702'),
    ]

    operations = [
        migrations.AddField(
            model_name='league',
            name='cancellation_period',
            field=models.IntegerField(default=2),
        ),
    ]