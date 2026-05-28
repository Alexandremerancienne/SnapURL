from django.shortcuts import redirect, render

from .models import ShortLink
from .utils import get_client_ip
from .tasks import create_hit

def redirect_short_link(request, slug):
    try:
        link = ShortLink.objects.get(slug=slug)
    except ShortLink.DoesNotExist:
        return render(request, "shortener/404.html", {"slug": slug}, status=404)

    ip = get_client_ip(request)

    create_hit.delay(link.id, ip, request.META.get("HTTP_REFERER", "")[:512])

    return redirect(link.original_url)
