from schedules.models import TimeRange
from rest_framework import serializers
from rest_framework.serializers import ValidationError


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
