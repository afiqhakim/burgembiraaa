# Burgembiraaa Monorepo

This repo has 2 apps:
- `frontend` (Next.js website)
- `backend` (FastAPI API + PostgreSQL)

## Quick Start (Windows PowerShell)

1. Install root Node deps:

```bash
npm install
```

2. Setup backend Python env:

```bash
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
cd ..
```

3. Create env files:

```bash
copy backend\.env.example backend\.env
copy frontend\.env.local.example frontend\.env.local
```

4. Start DB (first time):

```bash
docker run --name postgres-dev -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=app_db -p 5432:5432 -d postgres:15
```

If already created:

```bash
docker start postgres-dev
```

5. Run migrations:

```bash
cd backend
.\.venv\Scripts\Activate.ps1
alembic upgrade head
cd ..
```

6. Run apps:

```bash
npm run dev
```

URLs:
- Frontend: `http://localhost:3000`
- Backend: `http://127.0.0.1:8000`
- Backend docs: `http://127.0.0.1:8000/docs`

## Useful Commands

```bash
npm run dev:frontend
npm run dev:backend
npm run build
npm run lint
```

## shadcn MCP + CLI

shadcn is already initialized in `frontend`.

### MCP status
- The shadcn MCP tools detect this project and `@shadcn` registry.

### CLI usage

From `frontend`:

```bash
npm run ui:list
npm run ui:add -- button
npm run ui:add -- card
```

## Security Rules (Important)

- Never commit real `.env` files.
- Only commit `.env.example` templates.
- If secrets were ever committed, rotate them and rewrite history.
