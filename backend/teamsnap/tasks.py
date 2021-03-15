from teamsnap.teamsnap import TeamSnapSyncer
from leagues.models import League
from teamsnap.models import TeamSnapNote, TeamSnapNoteItem
from celery.decorators import task
from celery.utils.log import get_task_logger

from django.core.mail import send_mail
from sms import send_sms

from django.conf import settings
logger = get_task_logger(__name__)


@task(name='sync_teamsnap')
def sync_teamsnap():
    for league in League.objects.all():
        ts = TeamSnapSyncer(league.api_key, league)
        if ts.valid_key():
            ts.sync()
            tsn = TeamSnapNote.objects.create(
                league=league,
                note_type='sync'
            )
            for exception_note in ts.exception_notes:
                TeamSnapNoteItem.objects.create(
                    teamsnap_note=tsn,
                    note=exception_note[:128]
                )
