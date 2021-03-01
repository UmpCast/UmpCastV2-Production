from django.db import models
from users.models import User


class TimeRange(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    start = models.TimeField(blank=False, null=False)
    end = models.TimeField(blank=False, null=False)

    DAY_CHOICES = (
        ('monday', 'monday'),
        ('tuesday', 'tuesday'),
        ('wednesday', 'wednesday'),
        ('thursday', 'thursday'),
        ('friday', 'friday'),
        ('saturday', 'saturday'),
        ('sunday', 'sunday')
    )

    day_type = models.CharField(
        max_length=9, choices=DAY_CHOICES, blank=False, null=False)
