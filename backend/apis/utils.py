import random
import string

from shortener.models import ShortLink

CHARSET = string.ascii_letters + string.digits


def generate_slug(length: int = 7) -> str:
    return "".join(random.choices(CHARSET, k=length))


def unique_slug(length: int = 7) -> str:
    for _ in range(10):
        slug = generate_slug(length)

        if not ShortLink.objects.filter(slug=slug).exists():
            return slug

    raise ValueError("Could not generate a unique slug after 10 attempts")
