from datetime import timedelta

from django.db.models import Count, Q, Max
from django.db.models.functions import TruncDate
from django.utils import timezone
from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from shortener.models import ShortLink, Hit

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
    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == "create":
            return LinkCreateSerializer
        return LinkSerializer

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return ShortLink.objects.none()

        return ShortLink.objects.filter(owner=self.request.user).annotate(
            hits_count=Count("hits")
        )

    def perform_create(self, serializer):
        owner = self.request.user if self.request.user.is_authenticated else None
        serializer.save(owner=owner)

    @action(detail=True, methods=["get"], url_path="stats")
    def stats(self, request, pk=None):
        link = self.get_object()

        return Response(
            {
                "total_clicks": link.hits.count(),
                "unique_visitors": link.hits.values("ip_hash").distinct().count(),
                "daily_clicks": list(
                    link.hits.annotate(date=TruncDate("clicked_at"))
                    .values("date")
                    .annotate(count=Count("id"))
                    .order_by("-date")[:30]
                ),
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


class DashboardStatsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_links = ShortLink.objects.filter(owner=request.user)

        last_month = timezone.now() - timedelta(days=30)

        stats = user_links.aggregate(
            total_links=Count("id", distinct=True),
            total_clicks=Count("hits"),
            last_month_clicks=Count("hits", filter=Q(hits__clicked_at__gte=last_month)),
        )

        return Response(stats)


class DashboardUsernameView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"username": request.user.username})


class AnalyticsStatsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_links = ShortLink.objects.filter(owner=request.user)

        stats = user_links.aggregate(
            total_clicks=Count("hits"),
            unique_visitors=Count("hits__ip_hash", distinct=True),
            last_click=Max("hits__clicked_at"),
        )

        return Response(stats)

class AnalyticsClicksView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        clicks = (
            Hit.objects.filter(link__owner=request.user)
            .annotate(date=TruncDate("clicked_at"))
            .values("date")
            .annotate(count=Count("id"))
            .order_by("date")
        )

        return Response({
            "daily_clicks": list(clicks)
        })