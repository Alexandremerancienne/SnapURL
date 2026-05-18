from datetime import datetime

from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken

from shortener.models import Hit, ShortLink

User = get_user_model()


class LinkAPITests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(username="testuser", password="testpass")

        cls.link = ShortLink.objects.create(
            owner=cls.user,
            original_url="https://www.dnevnik.bg/",
            slug="dnevnik-bg",
        )

    def test_api_links_list_view(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get(reverse("links-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        result = response.data["results"][0]
        self.assertEqual(result["original_url"], self.link.original_url)
        self.assertEqual(result["slug"], self.link.slug)

    def test_api_links_detail_view(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get(reverse("links-detail", kwargs={"pk": self.link.pk}))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["original_url"], self.link.original_url)
        self.assertEqual(response.data["slug"], self.link.slug)

    def test_api_links_stats_view(self):
        self.client.force_authenticate(user=self.user)
        hits = Hit.objects.bulk_create(
            [
                Hit(
                    link=self.link,
                    ip_hash="visitor-1",
                    country="BG",
                    referrer="https://example.com/",
                ),
                Hit(
                    link=self.link,
                    ip_hash="visitor-1",
                    country="BG",
                    referrer="https://example.com/",
                ),
                Hit(
                    link=self.link,
                    ip_hash="visitor-2",
                    country="FR",
                    referrer="https://news.example/",
                ),
                Hit(
                    link=self.link,
                    ip_hash="visitor-3",
                    country="FR",
                    referrer="https://news.example/",
                ),
            ]
        )
        may_17 = timezone.make_aware(datetime(2026, 5, 17, 10, 0))
        may_18 = timezone.make_aware(datetime(2026, 5, 18, 10, 0))
        Hit.objects.filter(pk__in=[hits[0].pk, hits[1].pk, hits[2].pk]).update(
            clicked_at=may_17
        )
        Hit.objects.filter(pk=hits[3].pk).update(clicked_at=may_18)

        response = self.client.get(reverse("links-stats", kwargs={"pk": self.link.pk}))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data,
            {
                "total_clicks": 4,
                "unique_visitors": 3,
                "daily_clicks": [
                    {"date": may_18.date(), "count": 1},
                    {"date": may_17.date(), "count": 3},
                ],
                "top_countries": [
                    {"country": "BG", "count": 2},
                    {"country": "FR", "count": 2},
                ],
                "top_referrers": [
                    {"referrer": "https://example.com/", "count": 2},
                    {"referrer": "https://news.example/", "count": 2},
                ],
            },
        )

    def test_api_links_stats_view_only_allows_owner(self):
        other_user = User.objects.create_user(username="otheruser", password="testpass")
        other_link = ShortLink.objects.create(
            owner=other_user,
            original_url="https://www.novinite.com/",
            slug="novinite-com",
        )
        Hit.objects.create(link=other_link, ip_hash="visitor-1")
        self.client.force_authenticate(user=self.user)

        response = self.client.get(reverse("links-stats", kwargs={"pk": other_link.pk}))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_api_links_create_view(self):
        self.client.force_authenticate(user=self.user)

        data = {
            "original_url": "https://www.novinite.com/",
            "slug": "novinite-com",
        }

        response = self.client.post(reverse("links-list"), data=data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["original_url"], data["original_url"])
        self.assertEqual(response.data["slug"], data["slug"])
        self.assertEqual(ShortLink.objects.count(), 2)

    def test_api_links_update_view(self):
        self.client.force_authenticate(user=self.user)

        data = {
            "original_url": "https://www.novinite.com/",
            "slug": "novinite-com",
        }

        response = self.client.patch(
            reverse("links-detail", kwargs={"pk": self.link.pk}),
            data=data,
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["original_url"], data["original_url"])
        self.assertEqual(response.data["slug"], data["slug"])

        self.link.refresh_from_db()
        self.assertEqual(self.link.original_url, data["original_url"])
        self.assertEqual(self.link.slug, data["slug"])

    def test_api_links_destroy_view(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.delete(
            reverse("links-detail", kwargs={"pk": self.link.pk})
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(ShortLink.objects.count(), 0)


class AuthAPITests(APITestCase):
    def test_auth_endpoints_are_under_api_v1_base_path(self):
        self.assertEqual(reverse("auth-register"), "/api/v1/auth/register/")
        self.assertEqual(reverse("token_obtain_pair"), "/api/v1/auth/token/")
        self.assertEqual(reverse("token_refresh"), "/api/v1/auth/token/refresh/")
        self.assertEqual(reverse("auth-logout"), "/api/v1/auth/logout/")

    def test_register_creates_user_and_returns_user_info(self):
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "first_name": "New",
            "last_name": "User",
            "password": "StrongPass123!",
            "password_confirm": "StrongPass123!",
        }

        response = self.client.post(reverse("auth-register"), data=data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["username"], data["username"])
        self.assertEqual(response.data["email"], data["email"])
        self.assertNotIn("password", response.data)
        self.assertTrue(User.objects.filter(username=data["username"]).exists())

    def test_register_rejects_mismatched_passwords(self):
        data = {
            "username": "newuser",
            "password": "StrongPass123!",
            "password_confirm": "OtherStrongPass123!",
        }

        response = self.client.post(reverse("auth-register"), data=data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password_confirm", response.data)

    def test_login_returns_access_and_refresh_tokens(self):
        User.objects.create_user(username="loginuser", password="StrongPass123!")

        response = self.client.post(
            reverse("token_obtain_pair"),
            data={"username": "loginuser", "password": "StrongPass123!"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_refresh_returns_new_access_token(self):
        User.objects.create_user(username="refreshuser", password="StrongPass123!")
        login_response = self.client.post(
            reverse("token_obtain_pair"),
            data={"username": "refreshuser", "password": "StrongPass123!"},
        )

        response = self.client.post(
            reverse("token_refresh"),
            data={"refresh": login_response.data["refresh"]},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

    def test_logout_blacklists_refresh_token(self):
        User.objects.create_user(username="logoutuser", password="StrongPass123!")
        login_response = self.client.post(
            reverse("token_obtain_pair"),
            data={"username": "logoutuser", "password": "StrongPass123!"},
        )
        access = login_response.data["access"]
        refresh = login_response.data["refresh"]

        response = self.client.post(
            reverse("auth-logout"),
            data={"refresh": refresh},
            HTTP_AUTHORIZATION=f"Bearer {access}",
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(BlacklistedToken.objects.count(), 1)
