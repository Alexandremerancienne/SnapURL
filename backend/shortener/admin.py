from django.contrib import admin

from .models import Hit, ShortLink

admin.site.register(ShortLink)
admin.site.register(Hit)
