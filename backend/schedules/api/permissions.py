from rest_framework import permissions
from schedules.models import TimeRange
from users.models import User


class TimeRangeDestroyPermissions(permissions.BasePermission):
    def has_permission(self, request, view):
        timerange = TimeRange.objects.get(pk=view.kwargs['pk'])
        return timerange.user.pk == request.user.pk


class TimeRangeFilterPermissions(permissions.BasePermission):
    def has_permission(self, request, view):
        user_pk = request.query_params.get('user', None)
        if user_pk is None:
            return False
        user = User.objects.get(pk=user_pk)
        if user == request.user:  # if correct user
            return True
        if request.user.is_manager():
            for league in user.leagues.all():
                if league in request.user.leagues.accepted():  # if manager of correct league
                    return True
        return False
