set shell := ["powershell.exe", "-Command"]
set quiet

# =========================
# ALIASES
# =========================

compose := "docker compose"
compose_prod := "docker compose --env-file .env.prod -f docker-compose.prod.yml"


# =========================
# DEV STACK
# =========================

dev:
    {{compose}} up --build

down:
    {{compose}} down

rebuild:
    {{compose}} down -v
    {{compose}} up --build

logs:
    {{compose}} logs -f

ps:
    {{compose}} ps


# =========================
# BACKEND (DJANGO)
# =========================

migrate:
    {{compose}} exec backend python manage.py migrate

makemigrations:
    {{compose}} exec backend python manage.py makemigrations

shell:
    {{compose}} exec backend python manage.py shell

superuser:
    {{compose}} exec backend python manage.py createsuperuser

collectstatic:
    {{compose}} exec backend python manage.py collectstatic --noinput


# =========================
# CELERY
# =========================

celery:
    {{compose}} logs -f celery

celery-worker:
    {{compose}} exec celery celery -A config worker -l info


# =========================
# FRONTEND
# =========================

frontend:
    {{compose}} logs -f frontend


# =========================
# DATABASE
# =========================

db-shell:
    {{compose}} exec db psql -U url_shortener_user -d url_shortener


# =========================
# PROD STACK
# =========================

prod:
    {{compose_prod}} up --build

prod-down:
    {{compose_prod}} down

prod-logs:
    {{compose_prod}} logs -f

prod-ps:
    {{compose_prod}} ps

prod-migrate:
    {{compose_prod}} exec backend python manage.py migrate

prod-superuser:
    {{compose_prod}} exec backend python manage.py createsuperuser


# =========================
# CLEANUP
# =========================

clean:
    {{compose}} down -v --remove-orphans