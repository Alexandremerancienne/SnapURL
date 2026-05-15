from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken

from shortener.models import ShortLink

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
