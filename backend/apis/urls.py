from rest_framework.routers import SimpleRouter

from .views import LinkViewSet

router = SimpleRouter()
router.register("links", LinkViewSet, basename="links")

urlpatterns = router.urls
