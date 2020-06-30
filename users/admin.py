from django.contrib import admin
from .models import User, UserLeagueStatus


class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'first_name', 'last_name', 'is_configured', 'date_joined')
    list_display_links = ('id', 'email')
    search_fields = ('email', 'first_name', 'last_name')
    list_per_page = 25


admin.site.register(User, UserAdmin)
admin.site.register(UserLeagueStatus)
