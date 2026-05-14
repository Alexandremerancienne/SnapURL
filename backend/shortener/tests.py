import hashlib
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from .models import Hit, ShortLink

User = get_user_model()


class ShortLinkTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        
        cls.user = User.objects.create_user(username="testuser", password="testpass")

        cls.shortlink = ShortLink.objects.create(
            owner=cls.user,
            original_url="https://www.dnevnik.bg/",
            slug="dnevnik-bg",
        )

    def test_shortlink_content(self):
        self.assertEqual(self.shortlink.owner, self.user)
        self.assertEqual(self.shortlink.original_url, "https://www.dnevnik.bg/")
        self.assertEqual(self.shortlink.slug, "dnevnik-bg")

    def test_redirect_short_link_view_with_not_found_link(self):
        response = self.client.get(
            reverse("redirect_short_link", kwargs={"slug": "unknown-slug"})
        )

        self.assertEqual(response.status_code, 404)
        self.assertTemplateUsed(response, "shortener/404.html")
        self.assertEqual(Hit.objects.count(), 0)

    @patch("shortener.views.get_country_code", return_value="BG")
    def test_redirect_short_link_view_with_found_link(self, mock_get_country_code):
        ip = "203.0.113.10"
        referrer = "https://example.com/source"

        response = self.client.get(
            reverse("redirect_short_link", kwargs={"slug": "dnevnik-bg"}),
            REMOTE_ADDR=ip,
            HTTP_REFERER=referrer,
        )

        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.url, "https://www.dnevnik.bg/")
        mock_get_country_code.assert_called_once_with(ip)

        hit = Hit.objects.get()
        self.assertEqual(hit.link, self.shortlink)
        self.assertEqual(hit.country, "BG")
        self.assertEqual(hit.referrer, referrer)
        self.assertEqual(hit.ip_hash, hashlib.sha256(ip.encode("utf-8")).hexdigest())
