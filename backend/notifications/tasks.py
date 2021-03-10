from celery.decorators import task
from celery.utils.log import get_task_logger

from django.core.mail import send_mail
from sms import send_sms

from django.conf import settings
logger = get_task_logger(__name__)


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
