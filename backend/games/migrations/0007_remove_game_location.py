# Generated by Django 3.1.7 on 2021-03-09 02:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('games', '0006_auto_20210305_0505'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='game',
            name='location',
        ),
    ]
