from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from leagues.models import League, Role
from games.models import Application


class UserModelManager(BaseUserManager):
    """Required Object Manager for UserAccount"""

    def create_user(self, email, first_name, last_name, password=None):
        user = self.model(email=email, first_name=first_name,
                          last_name=last_name)
        if password is not None:
            user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, first_name, last_name, password):
        user = self.create_user(email, first_name, last_name, password)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        return user


class User(AbstractBaseUser, PermissionsMixin):
    """Custom User Model"""
    leagues = models.ManyToManyField(
        League, blank=True, through='UserLeagueStatus')
    locations = models.ManyToManyField('games.Location', blank=True)
    email = models.EmailField(max_length=64, unique=True)

    first_name = models.CharField(max_length=32)
    last_name = models.CharField(max_length=32)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=10, blank=True)

    profile_picture = models.ImageField(
        upload_to='profile_pics/%Y/%m/', null=True, blank=True)
    date_joined = models.DateTimeField(default=timezone.now)

    # notification settings
    phone_notifications = models.BooleanField(default=True)
    email_notifications = models.BooleanField(default=True)
    league_notifications = models.BooleanField(default=True)
    game_notifications = models.BooleanField(default=True)
    application_notifications = models.BooleanField(default=True)

    ACCOUNT_TYPE_CHOICES = (
        ('umpire', 'umpire'),
        ('manager', 'manager'),
        ('inactive', 'inactive'),
    )

    account_type = models.CharField(
        max_length=10, choices=ACCOUNT_TYPE_CHOICES, default='inactive')

    objects = UserModelManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        ordering = ['-pk']

    def get_full_name(self):
        return ' '.join([self.first_name, self.last_name])

    def get_short_name(self):
        return self.first_name

    def __str__(self):
        return self.email

    def is_manager(self):
        return True if self.account_type == 'manager' else False

    def is_umpire(self):
        return True if self.account_type == 'umpire' else False


class UserLeagueStatus(models.Model):
    """Information relevant to a user for a specific league"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    league = models.ForeignKey(League, on_delete=models.CASCADE)
    date_pending = models.DateTimeField(default=timezone.now)
    date_joined = models.DateTimeField(default=timezone.now)

    REQUEST_STATUS_CHOICES = (
        ('accepted', 'accepted'),
        ('pending', 'pending'),
        ('rejected', 'rejected'),
    )

    request_status = models.CharField(
        max_length=10, choices=REQUEST_STATUS_CHOICES, default='pending')

    # Umpire Relevant Fields
    max_casts = models.IntegerField(default=0)
    max_backups = models.IntegerField(default=0)
    visibilities = models.ManyToManyField(Role, blank=True)

    class Meta:
        ordering = ['user__first_name']

    def get_num_casts_backups(self):
        apps = Application.objects.filter(
            user=self.user,
            post__game__division__league=self.league,
            post__game__date_time__gt=timezone.now()
        )
        casts = 0
        backups = 0
        for app in apps:
            if app.is_casted():
                casts += 1
            else:
                backups += 1
        return casts, backups
