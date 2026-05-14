import requests
import hashlib

from django.shortcuts import redirect, render

from .models import ShortLink, Hit


def get_country_code(ip):
    if not ip:
        return ""

    try:
        response = requests.get(f"https://ipinfo.io/{ip}/json", timeout=2)
        data = response.json()
        return data.get("country") or ""
    except Exception:
        return ""


def hash_ip(ip):
    if not ip:
        return ""

    return hashlib.sha256(ip.encode("utf-8")).hexdigest()


def get_client_ip(request):
    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")

    if forwarded_for:
        return forwarded_for.split(",")[0].strip()

    return request.META.get("REMOTE_ADDR", "")


def redirect_short_link(request, slug):
    try:
        link = ShortLink.objects.get(slug=slug)
    except ShortLink.DoesNotExist:
        return render(request, "shortener/404.html", {"slug": slug}, status=404)

    ip = get_client_ip(request)
    country_code = get_country_code(ip) if ip else ""

    referrer = request.META.get("HTTP_REFERER", "")[:512]
    Hit.objects.create(
        link=link, country=country_code, referrer=referrer, ip_hash=hash_ip(ip)
    )
    return redirect(link.original_url)
