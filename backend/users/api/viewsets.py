from ..models import User, UserLeagueStatus

from .serializers.user import (
    UserProfilePublicSerializer, UserProfilePrivateCreateSerializer,
    UserProfilePrivateRetrieveSerializer, UserProfilePrivateUpdateSerializer
)

from .serializers.userleaguestatus import (
    UserLeagueStatusCreateSerializer, UserLeagueStatusRetrieveSerializer, UserLeagueStatusUpdateSerializer
)

from .permissions import (
    IsLeagueMember, IsUserOwner,
    IsUserLeagueStatusManager, IsUserLeagueStatusOwner, UserLeagueStatusFilterPermission
)

from .filters import (
    UserLeagueStatusFilter
)

from rest_framework import viewsets, mixins, permissions, status
from drf_multiple_serializer import ActionBaseSerializerMixin
from backend.permissions import (
    ActionBasedPermission,
    IsSuperUser
)
from rest_framework.decorators import action
from leagues.models import Level
from rest_framework.response import Response
from games.api.serializers.location import LocationSerializer
from games.models import Location
from leagues.api.serializers.league import LeaguePublicSerializer
from users.tasks import reset_password_sms_task, reset_password_email_task


class UserViewSet(ActionBaseSerializerMixin, mixins.CreateModelMixin, mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    Provide Create, Retrieve, Update, List, List-Filter functionality for User

    create: Create User \n
    * Permissions: AllowAny
    * Extra Validation:
        * Valid Email
        * Valid Password
        * Matching passwords
        * Phone Number Length/Numeric Only

    retrieve: Retrieve User \n
    * Permissions: IsUserOwner
    * Extra Notes:
        * Get current user using pk='me'

    update: Full Update User \n
    * Permissions: IsUserOwner

    partial_update: Partial Update User \n
    * Permissions: IsUserOwner

    list: List User \n
    * Permissions: IsUserOwner (if using user query param)
    * Query Params: Leagues, Account_type
    """

    queryset = User.objects.all()
    filter_fields = ('leagues', 'account_type')

    serializer_classes = {
        'default': UserProfilePrivateRetrieveSerializer,
        'create': UserProfilePrivateCreateSerializer,
        'update': UserProfilePrivateUpdateSerializer,
        'partial_update': UserProfilePrivateUpdateSerializer,
        'list': UserProfilePublicSerializer
    }

    permission_classes = (IsSuperUser | ActionBasedPermission,)
    action_permissions = {
        permissions.AllowAny: ['create', 'reset_password'],
        permissions.IsAuthenticated & IsLeagueMember: ['list'],
        permissions.IsAuthenticated & IsUserOwner: ['update', 'partial_update', 'retrieve', 'locations', 'toggle_location'],
    }

    def get_object(self):  # custom get object for /me endpoint
        pk = self.kwargs.get('pk', None)
        if pk == 'me':
            return self.request.user
        return super().get_object()

    @action(detail=False, methods=['post'])
    def reset_password(self, request):
        email = request.data.get('email', None)
        reset_type = request.data.get('reset_type', None)
        if (email is None) or (reset_type is None):
            return Response({"error": "missing parameters"}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=email).count() == 0:
            return Response({"email": "invalid email"}, status=status.HTTP_400_BAD_REQUEST)
        if reset_type != 'sms' and reset_type != 'email':
            return Response({"reset_type": "invalid reset_type"}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.get(email=email)
        if reset_type == 'sms':
            if len(user.phone_number) != 10:
                return Response({"reset_type": "no phone number on file"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                password = User.objects.make_random_password()
                user.set_password(password)
                user.save()
                reset_password_sms_task.delay(
                    user.email, user.phone_number, password)
                return Response({"success": user.phone_number}, status=status.HTTP_200_OK)
        elif reset_type == 'email':
            password = User.objects.make_random_password()
            user.set_password(password)
            user.save()
            reset_password_email_task.delay(user.email, password)
            return Response({"success": user.email}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def verify_password(self, request):
        """Verify user's current password without OAuth2"""
        email = request.data.get('email', None)
        password = request.data.get('password', None)
        
        if not email or not password:
            return Response({"error": "email and password required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
            if user.check_password(password):
                return Response({"valid": True}, status=status.HTTP_200_OK)
            else:
                return Response({"valid": False, "error": "incorrect password"}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"valid": False, "error": "user not found"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'])
    def toggle_location(self, request, pk):
        user = self.get_object()
        location_pk = request.data.get('location', None)
        available = request.data.get('available', None)

        if location_pk is None or available is None:
            return Response({"error": "missing parameters"}, status=status.HTTP_400_BAD_REQUEST)

        if type(available) != bool:
            return Response({"available": "invalid available type, expected bool"}, status=status.HTTP_400_BAD_REQUEST)

        if type(location_pk) != int:
            return Respnose({"location": "invalid location type, expected int"}, status=status.HTTP_400_BAD_REQUEST)

        location_obj = Location.objects.get(pk=location_pk)

        if available:
            if location_obj.league not in user.leagues.accepted():
                return Response({"location": "location in invalid league"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                user.locations.add(location_obj)
        else:
            user.locations.remove(location_obj)

        return Response(status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def locations(self, request, pk):
        user = self.get_object()
        locations = user.locations.all()
        response_list = []
        for league in user.leagues.accepted():
            league_serializer = LeaguePublicSerializer(league)

            in_location_qs = locations.filter(league=league)
            in_location_serializer = LocationSerializer(
                in_location_qs, many=True)

            all_location_qs = Location.objects.filter(league=league)
            out_location_qs = all_location_qs.difference(in_location_qs)
            out_location_serializer = LocationSerializer(
                out_location_qs, many=True)

            league_dict = {
                "league": league_serializer.data,
                "available_locations": in_location_serializer.data,
                "not_available_locations": out_location_serializer.data
            }
            response_list.append(league_dict)
        response_dict = {
            'results': response_list
        }
        return Response(response_dict)


class UserLeagueStatusViewSet(ActionBaseSerializerMixin, viewsets.ModelViewSet):
    """
    Provide CRUD, List, List-Filter functionality for UserLeagueStatus

    create: Create UserLeagueStatus \n
    * Permissions: IsAuthenticated
    * Extra Validations:
        * Can only create UserLeagueStatus using current user
        * There can only exist one User/League pair
        * Only user/league can be specified (other update operations restricted to manager)

    retrieve: Retrieve UserLeagueStatus \n
    * Permissions: IsUserLeagueStatusOwner or IsUserLeagueStatusManager

    update: Full Update UserLeagueStatus \n
    * Permissions: IsUserLeagueStatusManager

    partial_update: Partial Update UserLeagueStatus \n
    * Permissions: IsUserLeagueStatusManager

    destroy: Destroy UserLeagueStatus \n
    * Permissions: IsUserLeagueStatusOwner or IsUserLeagueStatusManager

    list: List UserLeagueStatus \n
    * Permissions: UserLeagueStatusFilterPermission
        * Umpires must filter by current user. League or no league is optional.
        * Managers can both apply to leagues and manage leagues. Permissions filtered accordingly
    * Query Params: User, League, Request_status, Account_Type
    * Extra Notes:
        * Account_type is filtered using the user__account_type lookup expression

    apply_level: Apply a Level to UserLeagueStatus \n
    * Permissions: Owner of Applied Level
    * Extra Notes:
        * Ignore below. The only required post field is "level", the pk of the level object
    """
    queryset = UserLeagueStatus.objects.all()
    filterset_class = UserLeagueStatusFilter

    serializer_classes = {
        'default': UserLeagueStatusRetrieveSerializer,
        'create': UserLeagueStatusCreateSerializer,
        'update': UserLeagueStatusUpdateSerializer,
        'partial_update': UserLeagueStatusUpdateSerializer
    }

    permission_classes = (IsSuperUser | (
        permissions.IsAuthenticated & ActionBasedPermission),)
    action_permissions = {
        # user restriction enforced on serializer level
        permissions.IsAuthenticated: ['create'],
        UserLeagueStatusFilterPermission: ['list'],
        IsUserLeagueStatusOwner | IsUserLeagueStatusManager: ['retrieve', 'destroy'],
        IsUserLeagueStatusManager: ['apply_level', 'update', 'partial_update'],
    }

    @action(detail=True, methods=['post'])
    def apply_level(self, request, pk):
        uls = self.get_object()
        uls.visibilities.clear()
        level_pk = request.data.get('level', None)
        if level_pk is None:
            return Response({"error": "missing parameters"}, status=status.HTTP_400_BAD_REQUEST)
        if not Level.objects.filter(pk=level_pk).exists():
            return Response({"level": ["invalid level pk"]}, status=status.HTTP_400_BAD_REQUEST)
        level_obj = Level.objects.get(pk=level_pk)
        if level_obj.league != uls.league:  # permissions inherently checks if manager owns level
            return Response({"level": ["level from one league cannot be applied to uls of another league"]}, status=status.HTTP_400_BAD_REQUEST)
        for role in level_obj.visibilities.all():
            uls.visibilities.add(role)
        return Response(status=status.HTTP_200_OK)
