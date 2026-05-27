import hashlib

import requests


def hash_ip(ip):
    if not ip:
        return ""
    return hashlib.sha256(ip.encode("utf-8")).hexdigest()


def get_client_ip(request):
    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()

    return request.META.get("REMOTE_ADDR", "")


def get_country_code(ip):
    if not ip:
        print("No IP address provided.")
        return ""

    try:
        response = requests.get(f"https://ipinfo.io/lite/me/{ip}", timeout=2)
        data = response.json()
        return data.get("country") or ""
    except Exception as e:
        print(f"Error fetching country code for IP {ip}: {e}")
        return ""
