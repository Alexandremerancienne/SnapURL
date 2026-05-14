from django.contrib import admin

from .models import ShortLink, Hit

admin.site.register(ShortLink)
admin.site.register(Hit)
