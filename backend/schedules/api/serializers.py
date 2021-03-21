from schedules.models import TimeRange, AssignmentItem, Assignment
from rest_framework import serializers
from rest_framework.serializers import ValidationError
from games.api.serializers.game import GameSerializer
from users.api.serializers.user import UserProfilePublicSerializer
from games.api.serializers.post import PostSerializer
import serpy


class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ('pk', 'league', 'start_date', 'end_date', 'is_completed')


class LightAssignmentItemSerializer(serpy.Serializer):
    pk = serpy.Field()
    name = serpy.MethodField()
    game_title = serpy.MethodField()
    game_division_title = serpy.MethodField()
    game_location_title = serpy.MethodField()
    game_date_time = serpy.MethodField()
    role_title = serpy.MethodField()

    def get_name(self, obj):
        return obj.user.get_full_name()

    def get_game_title(self, obj):
        return obj.post.game.title

    def get_game_division_title(self, obj):
        return obj.post.role.division.title

    def get_game_location_title(self, obj):
        return obj.post.game.location.title

    def get_game_date_time(self, obj):
        return obj.post.game.date_time

    def get_role_title(self, obj):
        return obj.post.role.title


class TimeRangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeRange
        fields = ('pk', 'user', 'start', 'end', 'day_type')

    def create(self, validated_data):
        user = validated_data.get('user', None)
        if not user:
            raise ValidationError('missing parameters')
        if user != self.context['request'].user:
            raise ValidationError('TimeRange can only be created by user')
        return super().create(validated_data)
