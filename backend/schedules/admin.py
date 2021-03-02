from django.contrib import admin
from schedules.models import TimeRange


class TimeRangeAdmin(admin.ModelAdmin):
    list_display = ('pk', 'user', 'start', 'end', 'day_type')
    list_display_links = ('pk',)
    search_fields = ('pk', 'user', 'day_type')
    list_per_page = 25


admin.site.register(TimeRange, TimeRangeAdmin)
