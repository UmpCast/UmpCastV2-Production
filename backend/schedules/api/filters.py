from django_filters import rest_framework as filters
from schedules.models import SpecialBlock


class SpecialBlockFilter(filters.FilterSet):
    start = filters.IsoDateTimeFromToRangeFilter()
    end = filters.IsoDateTimeFromToRangeFilter()

    class Meta:
        model = SpecialBlock
        fields = ['user', 'start', 'end']
