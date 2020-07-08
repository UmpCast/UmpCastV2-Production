from users.api.viewsets import UserViewSet, UserLeagueStatusViewSet
from leagues.api.viewsets import LeagueViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register('users', UserViewSet, basename='user')
router.register('user-league-status', UserLeagueStatusViewSet, basename='user-league-status')
router.register('leagues', LeagueViewSet, basename='league')


for url in router.urls:
    print(url)
