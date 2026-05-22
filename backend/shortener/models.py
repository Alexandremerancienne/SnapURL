from django.conf import settings
from django.db import models


class ShortLink(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="links",
        null=True,
        blank=True,
    )
    original_url = models.URLField(max_length=2048)
    slug = models.CharField(max_length=30, unique=True, db_index=True, blank=True)
    short_url = models.CharField(unique=True, db_index=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.slug} -> {self.original_url[:60]}"


class Hit(models.Model):
    link = models.ForeignKey(ShortLink, on_delete=models.CASCADE, related_name="hits")
    clicked_at = models.DateTimeField(auto_now_add=True, db_index=True)
    country = models.CharField(
        max_length=2, default="", blank=True
    )  # ISO 3166-1 alpha-2
    referrer = models.CharField(max_length=512, blank=True)
    ip_hash = models.CharField(
        max_length=64, blank=True
    )  # SHA-256 of IP, for deduplication

    def __str__(self):
        return f"{self.link.original_url} -> {self.clicked_at.strftime('%Y-%m-%d %H:%M:%S')}"
