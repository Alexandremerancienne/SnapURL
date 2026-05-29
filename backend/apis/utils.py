import secrets
import string

import tldextract
from rest_framework.exceptions import ValidationError
from shortener.models import ShortLink

CHARSET = string.ascii_letters + string.digits


def generate_slug(length: int = 7) -> str:
    return "".join(secrets.choice(CHARSET) for _ in range(length))


def unique_slug(length: int = 7) -> str:
    for _ in range(10):
        slug = generate_slug(length)

        if not ShortLink.objects.filter(slug=slug).exists():
            return slug

    raise ValueError("Could not generate a unique slug after 10 attempts")


def unique_short_url(
    original_url: str, slug: str, exclude_pk: int | None = None
) -> str:
    domain = tldextract.extract(original_url).registered_domain or "lnk.sh"
    short_url = f"{domain}/{slug}"
    queryset = ShortLink.objects.filter(short_url=short_url)

    if exclude_pk is not None:
        queryset = queryset.exclude(pk=exclude_pk)

    if queryset.exists():
        raise ValidationError("Short URL already exists")

    return short_url
