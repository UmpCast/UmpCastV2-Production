# Generated by Django 3.0.7 on 2020-08-21 18:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0002_auto_20200812_1840'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='basenotification',
            options={'ordering': ['-notification_date_time']},
        ),
    ]
