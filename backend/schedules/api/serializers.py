from schedules.models import TimeRange, AssignmentItem, Assignment
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

    game = serializers.SerializerMethodField()
    post = PostSerializer(many=False)
    user = UserProfilePublicSerializer(many=False)
    is_completed = serializers.SerializerMethodField()

    class Meta:
        model = AssignmentItem
        fields = ('pk', 'user', 'post', 'game', 'is_completed')

    def get_is_completed(self, instance):
        return instance.assignment.is_completed

    def get_game(self, instance):
        return GameSerializer(instance.post.game).data


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
