from celery import shared_task

from .models import Hit, ShortLink
from .utils import get_country_code, hash_ip


@shared_task
def create_hit(link_id, ip, referrer):
    try:
        link = ShortLink.objects.get(id=link_id)
    except ShortLink.DoesNotExist:
        return

    Hit.objects.create(
        link=link,
        country=get_country_code(ip),
        referrer=referrer[:512],
        ip_hash=hash_ip(ip),
    )
