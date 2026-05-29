from django.urls import path
from rest_framework.routers import SimpleRouter

from .views import (
    AnalyticsViewSet,
    DashboardStatsView,
    DashboardUsernameView,
    LinkViewSet,
)

router = SimpleRouter()
router.register("links", LinkViewSet, basename="links")
router.register("analytics", AnalyticsViewSet, basename="analytics")


urlpatterns = router.urls + [
    path("dashboard/stats/", DashboardStatsView.as_view(), name="dashboard-stats"),
    path(
        "dashboard/links/", LinkViewSet.as_view({"get": "list"}), name="dashboard-links"
    ),
    path(
        "dashboard/username/",
        DashboardUsernameView.as_view(),
        name="dashboard-username",
    ),
]
