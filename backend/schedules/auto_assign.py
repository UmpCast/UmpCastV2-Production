from schedules.models import Assignment, AssignmentItem, TimeRange
from leagues.models import Role
from games.models import Game, Post, Location, Application
from users.models import UserLeagueStatus
from collections import deque
from datetime import timedelta


class AutoAssign(object):
    def __init__(self, league, start_date, end_date, assignment):
        self.league = league
        self.start_date = start_date
        self.end_date = end_date
        self.assignment = assignment

    def get_sorted_roles(self):
        return Role.objects.filter(
            division__league=self.league
        ).order_by('division__order', 'order')

    def get_games(self):
        return Game.objects.filter(
            division__league=self.league,
            date_time__gt=self.start_date,
            date_time__lt=self.end_date
        )

    def index_in_qs(self, search, qs):
        for index, item in enumerate(qs):
            if search == item:
                return index
        return 0

    def get_sorted_uls(self, role):
        uls = UserLeagueStatus.objects.filter(
            league=self.league,
            request_status='accepted',
            visibilities__in=[role]
        ).order_by('pk')
        roles = self.get_sorted_roles()
        role_index = self.index_in_qs(role, roles)

        def uls_key(uls):
            uls_roles = uls.visibilities.all().order_by('division__order', 'order')
            uls_index = self.index_in_qs(uls_roles.first(), roles)
            return abs(uls_index - role_index)
        return sorted(uls, key=uls_key)

    def get_posts(self, role, games):
        return Post.objects.filter(
            role=role,
            game__in=games
        )

    def create_assignment_item(self, uls, post):
        AssignmentItem.objects.create(
            assignment=self.assignment,
            user=uls.user,
            post=post
        )

    def check_assignment_availability(self, uls, post):
        return AssignmentItem.objects.filter(
            assignment=self.assignment,
            post__game__date_time__gt=post.game.date_time - timedelta(hours=2),
            post__game__date_time__lt=post.game.date_time + timedelta(hours=2)
        ).count() == 0

    def is_valid_uls_post_match(self, uls, post):
        game = post.game

        is_time_available = TimeRange.objects.filter(
            start__lte=game.date_time.time(),
            end__gte=game.date_time.time(),
            user=uls.user
        ).count() != 0

        if not is_time_available:  # check if time available
            return False

        if game.location and game.location not in uls.user.locations.all():
            return False

        is_game_conflicts = Application.objects.filter(
            user=uls.user,
            post__game__date_time__gt=game.date_time - timedelta(hours=2),
            post__game__date_time__lt=game.date_time + timedelta(hours=2)
        ).count() != 0

        if is_game_conflicts:  # check if conflicting application
            return False

        assignment_availability = self.check_assignment_availability(uls, post)

        if not assignment_availability:
            return False

        return True

    def match_role(self, role, games):
        uls_qs = self.get_sorted_uls(role)
        deck = deque(uls_qs)
        posts = self.get_posts(role, games)

        for post in posts:
            if post.application_set.all().count() != 0:
                pass
            else:
                for uls in deck:
                    if self.is_valid_uls_post_match(uls, post):
                        self.create_assignment_item(uls, post)
                        deck.rotate(-1)
                        break

    def match_all(self):
        roles = self.get_sorted_roles()
        games = self.get_games()
        for role in roles:
            self.match_role(role, games)
        self.assignment.is_completed = True
        self.assignment.save()
