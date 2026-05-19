from django.db.models import Count
from django.db.models.functions import TruncDate
from django.utils import timezone
from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
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
                )[::-1],
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

        total_links = user_links.count()
        total_clicks = sum(link.hits.count() for link in user_links)
        last_month_clicks = user_links.filter(
            hits__clicked_at__gte=timezone.now() - timezone.timedelta(days=30)
        ).count()
        return Response(
            {
                "total_links": total_links,
                "total_clicks": total_clicks,
                "last_month_clicks": last_month_clicks,
            }
        )
