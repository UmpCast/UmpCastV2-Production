# Generated by Django 3.1.7 on 2021-03-05 05:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('games', '0006_auto_20210305_0505'),
        ('users', '0006_auto_20200822_0017'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='locations',
            field=models.ManyToManyField(blank=True, to='games.Location'),
        ),
    ]