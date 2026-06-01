from .base import *  # noqa: F403,405

DEBUG = False

ALLOWED_HOSTS = env_list(
	"DJANGO_ALLOWED_HOSTS",
	"snap-url.com,www.snap-url.com,localhost,127.0.0.1",
)

SECURE_SSL_REDIRECT = env_bool("DJANGO_SECURE_SSL_REDIRECT", default=True)
SESSION_COOKIE_SECURE = env_bool("DJANGO_SECURE_COOKIES", default=True)
CSRF_COOKIE_SECURE = env_bool("DJANGO_SECURE_COOKIES", default=True)

CORS_ALLOWED_ORIGINS = env_list(
	"DJANGO_CORS_ALLOWED_ORIGINS",
	"http://localhost,http://127.0.0.1",
)
CSRF_TRUSTED_ORIGINS = env_list(
	"DJANGO_CSRF_TRUSTED_ORIGINS",
	"http://localhost,http://127.0.0.1",
)

