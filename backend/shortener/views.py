from django.shortcuts import redirect, render

from .models import Hit, ShortLink
from .utils import get_client_ip, get_country_code, hash_ip


def redirect_short_link(request, slug):
    try:
        link = ShortLink.objects.get(slug=slug)
    except ShortLink.DoesNotExist:
        return render(request, "shortener/404.html", {"slug": slug}, status=404)

    ip = get_client_ip(request)

    Hit.objects.create(
        link=link,
        country=get_country_code(ip),
        referrer=request.META.get("HTTP_REFERER", "")[:512],
        ip_hash=hash_ip(ip),
    )
    return redirect(link.original_url)
