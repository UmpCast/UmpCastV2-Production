from datetime import timedelta

from django.db import models
from django.db.models.signals import post_save
from django.utils import timezone

from games.models import Application, Game
from notifications.tasks import send_notification_email_task, send_notification_sms_task
from users.models import User, UserLeagueStatus

import itertools


class BaseNotification(models.Model):
    """
    Used to ensure that all notification types have the same structure
    """
    notification_date_time = models.DateTimeField(default=timezone.now)
    subject = models.CharField(max_length=64, null=True, blank=True)
    message = models.CharField(max_length=256)

    def save(self, *args, **kwargs):
        if self.subject:
            self.subject = self.subject[:64]
        self.message = self.message[:256]
        return super().save(*args, **kwargs)

    class Meta:
        ordering = ['-notification_date_time']


class UmpCastNotification(BaseNotification):
    """
    UmpCast Level Notification
    """


class LeagueNotification(BaseNotification):
    """
    League Level Notifications. External Notifications sent immediately
    """
    league = models.ForeignKey('leagues.League', on_delete=models.CASCADE)


class GameNotification(BaseNotification):
    """
    Game Level Notifications. Reminder notifications sent using Chronschedule. Changes sent immediately
    """
    game = models.ForeignKey('games.Game', on_delete=models.CASCADE)
    was_reminded = models.BooleanField(default=False)


class ApplicationNotification(BaseNotification):
    """
    Application Level Notifications. External Notifications sent immediately
    """
    application = models.ForeignKey(
        'games.Application', on_delete=models.CASCADE)


ADVANCED_NOTIFICATION_DAYS = 1


def game_handle_creation(instance):
    pass


def game_handle_update(instance, **kwargs):
    location = "N/A"
    if instance.location:
        location = instance.location.title

    gn = GameNotification.objects.create(
        notification_date_time=timezone.now(),
        was_reminded=True,  # no need to delay
        game=instance,
        subject=f"Game: {instance.title} has updated information",
        message=f"""Title: {instance.title} \nDate & Time (in UTC): {instance.date_time.strftime("%m/%d/%Y, %H:%M:%S")} \nLocation: {location} \nIs Active: {instance.is_active}
                """
    )
    return gn

# API Create Endpoint, Admin Create/Update, TS Create/Update


def game_notification_receiver(sender, instance, *args, **kwargs):
    if kwargs['created']:
        game_handle_creation(instance)
    else:
        gn = game_handle_update(instance, **kwargs)
        user_ids = Application.objects.filter(
            post__game__pk=instance.pk).values_list('user__pk', flat=True)
        manager_ids = UserLeagueStatus.objects.filter(
            user__account_type='manager', league=instance.division.league).values_list('user__pk', flat=True)
        for user_id in itertools.chain(user_ids, manager_ids):
            user = User.objects.get(pk=user_id)
            if user.game_notifications and user.phone_notifications:
                if len(user.phone_number) == 10:
                    send_notification_sms_task.delay(
                        user.phone_number,
                        gn.subject,
                        gn.pk
                    )
            if user.game_notifications and user.email_notifications:
                send_notification_email_task.delay(
                    user.email,
                    gn.subject,
                    gn.message,
                    gn.pk
                )


post_save.connect(game_notification_receiver, sender=Game)


def is_casted(application):
    return application.post.application_set.get_min_order() == application.order


def notify_application(application):
    app_dict = {
        'application': application,
        'notification_date_time': timezone.now(),
    }
    if is_casted(application):
        ApplicationNotification.objects.create(**dict(app_dict,
                                                      subject=f"Casted for {application.post.game.title}",
                                                      message=f"You are currently now casted for {application.post.game.title}"))
    else:
        ApplicationNotification.objects.create(**dict(app_dict,
                                                      subject=f"Backup for {application.post.game.title}",
                                                      message=f"You are currently now a backup for {application.post.game.title}"))


def application_receiver(sender, instance, *args, **kwargs):
    # check the application set for applications which require updates
    if kwargs['created']:
        notify_application(instance)
    if not kwargs['update_fields'] is None and 'order' in kwargs['update_fields']:
        if is_casted(instance):
            notify_application(instance)
            if instance.next():
                notify_application(instance.next())
        else:
            notify_application(instance)
            casted = instance.get_ordering_queryset().below_instance(instance).first()
            notify_application(casted)


post_save.connect(application_receiver, sender=Application)


def application_notification_receiver(sender, instance, *args, **kwargs):
    if instance.application.user.application_notifications and instance.application.user.phone_notifications:
        if len(instance.application.user.phone_number) == 10:
            send_notification_sms_task.delay(
                instance.application.user.phone_number,
                instance.subject,
                instance.pk
            )
    if instance.application.user.application_notifications and instance.application.user.email_notifications:
        send_notification_email_task.delay(
            instance.application.user.email,
            instance.subject,
            instance.message,
            instance.pk
        )


post_save.connect(application_notification_receiver,
                  sender=ApplicationNotification)
