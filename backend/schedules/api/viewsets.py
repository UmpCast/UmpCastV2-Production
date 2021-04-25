from rest_framework.decorators import action
from games.models import Application
from rest_framework.response import Response
from rest_framework import permissions, status
from backend.permissions import IsSuperUser, ActionBasedPermission, IsManager
from rest_framework import viewsets, mixins
from schedules.models import TimeRange, Assignment, AssignmentItem, SpecialBlock
from schedules.api.serializers import TimeRangeSerializer, AssignmentSerializer, AssignmentItemSerializer, SpecialBlockSerializer
from schedules.api.permissions import TimeRangeFilterPermissions, TimeRangeDestroyPermissions, AssignmentPermissions, AssignmentItemFilterPermissions, AssignmentFilterPermissions, SpecialBlockDestroyPermissions, SpecialBlockFilterPermissions


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


class SpecialBlockViewSet(mixins.CreateModelMixin, mixins.DestroyModelMixin,
                          mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = SpecialBlock.objects.all()
    filter_fields = ('user', )
    serializer_class = SpecialBlockSerializer
    permission_classes = (IsSuperUser | (
        permissions.IsAuthenticated & ActionBasedPermission), )
    action_permissions = {
        # user restriction enforced on serializer level
        permissions.IsAuthenticated: ['create'],

        SpecialBlockDestroyPermissions: ['destroy'],
        SpecialBlockFilterPermissions: ['list']
    }


class AssignmentViewSet(mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Assignment.objects.all()
    filter_fields = ('league', )
    serializer_class = AssignmentSerializer
    permission_classes = (IsSuperUser | (
        permissions.IsAuthenticated & ActionBasedPermission
    ),)
    action_permissions = {
        IsManager & AssignmentPermissions: ['retrieve', 'submit'],
        IsManager & AssignmentFilterPermissions: ['list']
    }

    @action(detail=True, methods=['post'])
    def submit(self, request, pk):
        assignment = self.get_object()
        accepted_assignments = request.data.get(
            'accepted_assignment_items', None)
        if accepted_assignments is None:
            return Response({"error": "missing parameters"})
        for accepted in accepted_assignments:
            if AssignmentItem.objects.filter(
                assignment=assignment,
                pk=accepted
            ).exists():
                assignment_item = AssignmentItem.objects.get(pk=accepted)
                if not Application.objects.filter(
                    post=assignment_item.post
                ).exists():
                    Application.objects.create(
                        post=assignment_item.post,
                        user=assignment_item.user
                    )
        return Response(status=status.HTTP_200_OK)


class AssignmentItemViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = AssignmentItem.objects.all()
    serializer_class = AssignmentItemSerializer
    filter_fields = ('assignment', )
    permission_classes = (IsSuperUser | (
        permissions.IsAuthenticated & ActionBasedPermission
    ),)
    action_permissions = {
        IsManager & AssignmentItemFilterPermissions: ['list']
    }
