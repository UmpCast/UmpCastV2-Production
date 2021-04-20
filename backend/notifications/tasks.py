from datetime import timedelta
from games.models import Game, Application
from django.utils import timezone
from celery.decorators import task
from celery.utils.log import get_task_logger

from django.core.mail import send_mail
from sms import send_sms

from django.conf import settings
logger = get_task_logger(__name__)

ADVANCED_NOTIFICATION_DAYS = 1


@task(name='send_notification_sms_task')
def send_notification_sms_task(sms, subject, notification_pk):
    try:
        send_sms(
            f'[UmpCast] {subject} (logon to view)',
            settings.TWILIO_PHONE_NUMBER,
            [sms],
            fail_silently=False
        )
        return f"SMS Success Notification: {sms}, {notification_pk}"
    except:
        return f"SMS Failed Notification: {sms}, {notification_pk}"


@task(name='send_notification_email_task')
def send_notification_email_task(email, subject, message, notification_pk):
    try:
        send_mail(
            f'[UmpCast] {subject}',
            message,
            settings.SERVER_EMAIL,
            [email],
            fail_silently=False
        )
        return f"Email Success Notification: {email}, {notification_pk}"
    except:
        return f"Email Failed Notification: {email}, {notification_pk}"


@task(name='game_reminders_task')
def game_reminders_task():
    time = timezone.now()
    applications = Application.objects.filter(
        post__game__date_time__gt=time,
        post__game__date_time__lt=time +
        timedelta(days=ADVANCED_NOTIFICATION_DAYS)
    )
    for application in applications:
        if application.is_casted():
            if application.user.phone_notifications and len(application.user.phone_number) == 10:
                send_notification_sms_task.delay(
                    application.user.phone_number,
                    f"Reminder for game {application.post.game.title} within 24 hours",
                    0
                )
            if application.user.email_notifications:
                send_notification_email_task.delay(
                    application.user.email,
                    f"Reminder for game {application.post.game.title} within 24 hours",
                    "Log on to your UmpireCast account for more details",
                    0
                )
