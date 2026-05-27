from django.urls import path
from rest_framework.routers import SimpleRouter

from .views import DashboardStatsView, DashboardUsernameView, LinkViewSet, AnalyticsStatsView, AnalyticsClicksView, AnalyticsCountriesView

router = SimpleRouter()
router.register("links", LinkViewSet, basename="links")


urlpatterns = router.urls + [
    path("dashboard/stats/", DashboardStatsView.as_view(), name="dashboard-stats"),
    path("analytics/stats/", AnalyticsStatsView.as_view(), name="analytics-stats"),
    path("analytics/clicks/", AnalyticsClicksView.as_view(), name="analytics-clicks"),
    path("analytics/countries/", AnalyticsCountriesView.as_view(), name="analytics-countries"),
    path("dashboard/links/", LinkViewSet.as_view({"get": "list"}), name="dashboard-links"),  
    path(
        "dashboard/username/",
        DashboardUsernameView.as_view(),
        name="dashboard-username",
    ),
]
