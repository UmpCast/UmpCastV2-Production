from django_filters import rest_framework as filters
from ..models import UserLeagueStatus
from django.contrib.postgres.search import TrigramSimilarity
from django.db.models.functions import Greatest


class UserLeagueStatusFilter(filters.FilterSet):
    account_type = filters.CharFilter(
        field_name='user', lookup_expr='account_type')
    name = filters.CharFilter(method='name_trigram_search')

    class Meta:
        model = UserLeagueStatus
        fields = ['user', 'league', 'request_status',
                  'account_type', 'visibilities']

    def name_trigram_search(self, queryset, name, value):
        return queryset.annotate(
            similarity=Greatest(
                TrigramSimilarity('user__first_name', value),
                TrigramSimilarity('user__last_name', value)
            )
        ).filter(similarity__gt=0.15)  # first, last, or both
