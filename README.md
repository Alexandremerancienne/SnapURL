# URLShortener

## Run with Docker

Create a local environment file:

```bash
cp .env.example .env
```

Build and start the full stack:

```bash
docker compose up --build
```

The services will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- PostgreSQL: localhost:5432

The backend container waits for PostgreSQL, runs Django migrations, then starts the development server.

Useful commands:

```bash
docker compose exec backend python manage.py createsuperuser
docker compose exec backend python manage.py test
docker compose down
docker compose down -v
```

Use `docker compose down -v` only when you want to delete the local PostgreSQL Docker volume and reset the database.
