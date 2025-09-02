from celery import shared_task
from celery.utils.log import get_task_logger

from django.core.mail import send_mail
from sms import send_sms

from django.conf import settings
logger = get_task_logger(__name__)


@shared_task(name='reset_password_sms_task')
def reset_password_sms_task(email, sms, password):
    try:
        send_sms(
            f'Temporary Password, please reset immediately: {password}',
            settings.TWILIO_PHONE_NUMBER,
            [sms],
            fail_silently=False
        )
        return f"SMS Success Password Reset: {email}"
    except:
        return f"SMS Fail Password Reset: {email}"


@shared_task(name='reset_password_email_task')
def reset_password_email_task(email, password):
    try:
        send_mail(
            '[UmpCast] Reset Password',
            f'Temporary Password, please reset immediately: {password}',
            settings.SERVER_EMAIL,
            [email],
            fail_silently=False)
        return f"Email Success Password Reset: {email}"
    except:
        return f"Email Fail Password Reset: {email}"
