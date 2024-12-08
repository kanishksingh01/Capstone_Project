from django.core.management.base import BaseCommand
from django.utils.timezone import get_current_timezone, now

class Command(BaseCommand):
    help = 'Check current timezone and time'

    def handle(self, *args, **kwargs):
        print("Current Timezone:", get_current_timezone())
        print("Current Time:", now())