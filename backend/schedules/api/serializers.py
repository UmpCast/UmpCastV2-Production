from schedules.models import TimeRange, AssignmentItem, Assignment, SpecialBlock
from rest_framework import serializers
from rest_framework.serializers import ValidationError
from games.api.serializers.game import GameSerializer
from users.api.serializers.user import UserProfilePublicSerializer
from games.api.serializers.post import PostSerializer


class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ('pk', 'league', 'start_date', 'end_date', 'is_completed')


class AssignmentItemSerializer(serializers.ModelSerializer):

    name = serializers.SerializerMethodField()
    game_title = serializers.SerializerMethodField()
    game_division_title = serializers.SerializerMethodField()
    game_location_title = serializers.SerializerMethodField()
    game_date_time = serializers.SerializerMethodField()
    role_title = serializers.SerializerMethodField()

    class Meta:
        model = AssignmentItem
        fields = ('pk', 'name', 'game_title', 'game_division_title',
                  'game_location_title', 'game_date_time', 'role_title')

    def get_name(self, instance):
        return instance.user.get_full_name()

    def get_game_title(self, instance):
        return instance.post.game.title

    def get_game_division_title(self, instance):
        return instance.post.role.division.title

    def get_game_location_title(self, instance):
        return instance.post.game.location.title

    def get_game_date_time(self, instance):
        return instance.post.game.date_time

    def get_role_title(self, instance):
        return instance.post.role.title


class SpecialBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpecialBlock
        fields = ('pk', 'user', 'start', 'end')

    def create(self, validated_data):
        user = validated_data.get('user', None)
        if not user:
            raise ValidationError('missing parameters')
        if user != self.context['request'].user:
            raise ValidationError('SpecialBlock can only be created by user')
        return super().create(validated_data)


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
