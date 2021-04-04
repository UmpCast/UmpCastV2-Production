from django.db import models
from users.models import User
from leagues.models import League
from games.models import Post


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


class Assignment(models.Model):
    league = models.ForeignKey(League, on_delete=models.CASCADE)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_completed = models.BooleanField(default=False)


class AssignmentItem(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)

    class Meta:
        ordering = ['post__game__date_time', 'post__game__pk']
