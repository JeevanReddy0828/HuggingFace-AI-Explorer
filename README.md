# HuggingFace AI Explorer

A full-stack web app to browse, filter, compare, and bookmark AI models from the HuggingFace Hub.

![Browse page](docs/browse.png)

## Features

- **Browse** — paginated model grid with live search and task/sort filters
- **Compare** — side-by-side stats table for up to 4 models
- **Bookmarks** — persist favourite models to PostgreSQL; survives page reloads
- **Real-time HF API** — data fetched directly from `huggingface.co/api/models`
- **Model links** — every card links out to the model's HuggingFace page

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 · React 19 · TypeScript · Tailwind CSS |
| Backend | Python · Flask · SQLAlchemy · Alembic |
| Database | PostgreSQL 16 |
| Infrastructure | Docker · Docker Compose |
| CI | GitHub Actions |
| Error tracking | Sentry (optional) |

## Getting started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Run locally

```bash
git clone <repo-url>
cd hugging-face-ai-explorer

cp .env.example .env
# optionally add your HF_TOKEN for higher API rate limits

docker compose up --build
```

| Service | URL |
|---------|-----|
| App | http://localhost:3000 |
| API | http://localhost:5000 |
| Health | http://localhost:5000/health |

### Environment variables

Copy `.env.example` to `.env` and fill in any values you need:

| Variable | Required | Description |
|----------|----------|-------------|
| `POSTGRES_PASSWORD` | No | DB password (default: `postgres`) |
| `HF_TOKEN` | No | HuggingFace token — increases API rate limits |
| `SENTRY_DSN` | No | Sentry DSN for error tracking |
| `SENTRY_ORG` | No | Sentry org slug (needed for source map uploads) |
| `SENTRY_PROJECT` | No | Sentry project slug |
| `SENTRY_AUTH_TOKEN` | No | Sentry auth token for CI source map uploads |

## Project structure

```
.
├── backend/                  Flask API
│   ├── app/
│   │   ├── routes/           REST endpoints (models, bookmarks)
│   │   ├── services/         HuggingFace API client
│   │   └── models.py         SQLAlchemy ORM models
│   ├── migrations/           Alembic schema migrations
│   ├── tests/                Pytest test suite
│   └── Dockerfile
├── frontend/                 Next.js app
│   └── src/
│       ├── app/              Pages (browse, compare, bookmarks)
│       ├── components/       ModelCard, ModelFilters, ComparePanel, NavBar
│       └── lib/              API client, custom hooks
├── docker-compose.yml
└── .github/workflows/ci.yml  Lint · type-check · build · test on every push
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/models/` | List/search models |
| `GET` | `/api/models/:id` | Single model detail |
| `GET` | `/api/bookmarks/` | List bookmarks |
| `POST` | `/api/bookmarks/` | Add bookmark |
| `DELETE` | `/api/bookmarks/:id` | Remove bookmark |
| `GET` | `/api/bookmarks/ids` | All bookmarked model IDs |

### Models query params

| Param | Example | Description |
|-------|---------|-------------|
| `search` | `llama` | Text search |
| `pipeline_tag` | `text-generation` | Filter by task |
| `sort` | `downloads` \| `likes` \| `lastModified` | Sort field |
| `limit` | `20` | Page size (max 100) |
| `offset` | `0` | Pagination offset |

## Development

### Backend (without Docker)

```bash
cd backend
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# set env vars
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hf_explorer

flask --app wsgi:app db upgrade
python wsgi.py
```

### Frontend (without Docker)

```bash
cd frontend
npm install

# point at local backend
echo "BACKEND_URL=http://localhost:5000" > .env.local

npm run dev
```

### Running tests

```bash
cd backend
pytest --cov=app -v
```

## CI

Every push to `main` or `develop` (and every PR targeting `main`) runs:

1. **Backend** — migrations against a real Postgres container, then pytest
2. **Frontend** — TypeScript type-check, ESLint, Next.js production build
3. **Docker** — `docker compose build` to catch image-level issues
