from django.contrib import admin
from schedules.models import TimeRange, Assignment, AssignmentItem, SpecialBlock


class TimeRangeAdmin(admin.ModelAdmin):
    list_display = ('pk', 'user', 'start', 'end', 'day_type')
    list_display_links = ('pk',)
    search_fields = ('pk', 'user', 'day_type')
    list_per_page = 25


class SpecialBlockAdmin(admin.ModelAdmin):
    list_display = ('pk', 'user', 'start', 'end')
    list_display_links = ('pk', )
    search_fields = ('pk', 'user')
    list_per_page = 25


class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('pk', 'league', )
    list_display_links = ('pk',)
    search_fields = ('pk', 'league',)
    list_per_page = 25


class AssignmentItemAdmin(admin.ModelAdmin):
    list_display = ('pk', 'user', 'post')
    list_display_links = ('pk',)
    search_fields = ('pk',)
    list_per_page = 25


admin.site.register(Assignment, AssignmentAdmin)
admin.site.register(AssignmentItem, AssignmentItemAdmin)
admin.site.register(TimeRange, TimeRangeAdmin)
admin.site.register(SpecialBlock, SpecialBlockAdmin)
