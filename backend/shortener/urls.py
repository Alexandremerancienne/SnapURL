from django.urls import path

from .views import redirect_short_link

urlpatterns = [
    path("<slug:slug>", redirect_short_link, name="redirect_short_link"),
]
