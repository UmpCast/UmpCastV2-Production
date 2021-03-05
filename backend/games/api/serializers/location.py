from rest_framework import serializers
from games.models import Location
from rest_framework.serializers import ValidationError


class LocationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Location
        fields = ('pk', 'title', 'league')

    def validate_league(self, league):
        if league not in self.context['request'].user.leagues.accepted():
            raise ValidationError(
                "can only create location for league you are a manager")
        return league
