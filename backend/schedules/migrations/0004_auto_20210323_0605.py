# Generated by Django 3.1.7 on 2021-03-23 06:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('schedules', '0003_assignment_is_completed'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='assignmentitem',
            options={'ordering': ['post__role__pk']},
        ),
    ]
