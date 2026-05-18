from django.db.models import Count
from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from shortener.models import ShortLink

from .serializers import (
    LinkCreateSerializer,
    LinkSerializer,
    LogoutSerializer,
    RegisterSerializer,
    UserSerializer,
)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class LogoutView(APIView):
    serializer_class = LogoutSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(status=status.HTTP_204_NO_CONTENT)


class LinkViewSet(viewsets.ModelViewSet):
    def get_serializer_class(self):
        if self.action == "create":
            return LinkCreateSerializer
        return LinkSerializer

    def get_queryset(self):
        return ShortLink.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=["get"], url_path="stats")
    def stats(self, request, pk=None):
        link = self.get_object()

        return Response(
            {
                "total_clicks": link.hits.count(),
                "unique_visitors": link.hits.values("ip_hash").distinct().count(),
                "top_countries": list(
                    link.hits.values("country")
                    .annotate(count=Count("id"))
                    .order_by("-count", "country")
                ),
                "top_referrers": list(
                    link.hits.values("referrer")
                    .annotate(count=Count("id"))
                    .order_by("-count", "referrer")
                ),
            }
        )


