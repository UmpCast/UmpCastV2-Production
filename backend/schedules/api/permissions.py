from rest_framework import permissions
from schedules.models import TimeRange, Assignment
from users.models import User
from leagues.models import League


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


class AssignmentPermissions(permissions.BasePermission):
    def has_permission(self, request, view):
        assignment = Assignment.objects.get(pk=view.kwargs['pk'])
        return assignment.league in request.user.leagues.accepted()


class AssignmentFilterPermissions(permissions.BasePermission):
    def has_permission(self, request, view):
        league_pk = request.query_params.get('league', None)
        if league_pk is None:
            return False
        league = League.objects.get(pk=league_pk)
        return league in request.user.leagues.accepted()


class AssignmentItemFilterPermissions(permissions.BasePermission):
    def has_permission(self, request, view):
        assignment_pk = request.query_params.get('assignment', None)
        if assignment_pk is None:
            return False
        assignment = Assignment.objects.get(pk=assignment_pk)
        return assignment.league in request.user.leagues.accepted()
