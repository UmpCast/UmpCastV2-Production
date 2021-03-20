from rest_framework import viewsets, mixins
from schedules.models import TimeRange, Assignment, AssignmentItem
from schedules.api.serializers import TimeRangeSerializer, AssignmentSerializer, AssignmentItemSerializer
from schedules.api.permissions import TimeRangeFilterPermissions, TimeRangeDestroyPermissions
from backend.permissions import IsSuperUser, ActionBasedPermission, IsManager
from rest_framework import permissions


class TimeRangeViewSet(mixins.CreateModelMixin, mixins.DestroyModelMixin,
                       mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = TimeRange.objects.all()
    filter_fields = ('user', 'day_type')
    serializer_class = TimeRangeSerializer
    permission_classes = (IsSuperUser | (
        permissions.IsAuthenticated & ActionBasedPermission), )
    action_permissions = {
        # user restriction enforced on serializer level
        permissions.IsAuthenticated: ['create'],

        TimeRangeDestroyPermissions: ['destroy'],
        TimeRangeFilterPermissions: ['list']
    }


class AssignmentItemViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = AssignmentItem.objects.all()
    serializer_class = AssignmentItemSerializer
    filter_fields = ('assignment', )
    permission_classes = (IsSuperUser | (
        permissions.IsAuthenticated & ActionBasedPermission
    ),)
    action_permissions = {
        IsManager: ['list']
    }
