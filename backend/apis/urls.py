from django.urls import path
from rest_framework.routers import SimpleRouter

from .views import DashboardStatsView, LinkViewSet

router = SimpleRouter()
router.register("links", LinkViewSet, basename="links")


urlpatterns = router.urls + [
    path("dashboard/stats/", DashboardStatsView.as_view(), name="dashboard-stats"),
]
