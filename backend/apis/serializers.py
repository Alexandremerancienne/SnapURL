import re

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from shortener.models import ShortLink

from .utils import unique_slug

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "password",
            "password_confirm",
        )
        read_only_fields = ("id",)

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError(
                {"password_confirm": "Passwords do not match."}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate_refresh(self, value):
        try:
            token = RefreshToken(value)
            token.blacklist()
        except Exception as exc:
            raise serializers.ValidationError("Invalid refresh token.") from exc
        return value


class LinkCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShortLink
        fields = ("id", "original_url", "slug", "created_at")
        read_only_fields = ("id", "created_at")

    def validate_slug(self, value):

        if not re.fullmatch(r"[A-Za-z0-9-]{3,30}", value):
            raise serializers.ValidationError(
                "Slug must contain only letters, numbers and hyphens."
            )

        return value

    def create(self, validated_data):

        if not validated_data.get("slug"):
            validated_data["slug"] = unique_slug()

        return ShortLink.objects.create(**validated_data)


class LinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShortLink
        fields = ("id", "original_url", "slug", "created_at")
