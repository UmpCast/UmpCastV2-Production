from celery.decorators import task
from celery.utils.log import get_task_logger

from schedules.auto_assign import AutoAssign, Assignment

from django.conf import settings
logger = get_task_logger(__name__)


@task(name='run_auto_assign_task')
def run_auto_assign_task(assignment_pk):
    assignment = Assignment.objects.get(pk=assignment_pk)
    asl = AutoAssign(
        assignment.league,
        assignment.start_date,
        assignment.end_date,
        assignment
    )
    asl.match_all()
