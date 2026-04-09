# Burgembiraaa Monorepo

This repo has 2 apps:
- `frontend` (Next.js website)
- `backend` (FastAPI API + PostgreSQL)

## Prerequisites

- Node.js 20+
- npm 10+
- Python 3.12+
- Docker Desktop

## 1) Install root dependencies

```bash
npm install
```

## 2) Setup backend Python environment

### Windows (PowerShell)

```powershell
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
cd ..
```

### macOS/Linux (bash/zsh)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
cd ..
```

## 3) Create local env files

### Windows (PowerShell)

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.local.example frontend/.env.local
```

### macOS/Linux (bash/zsh)

```bash
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

## 4) Start PostgreSQL with Docker

First time:

```bash
docker run --name postgres-dev -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=app_db -p 5432:5432 -d postgres:15
```

If container already exists:

```bash
docker start postgres-dev
```

## 5) Run migrations

### Windows (PowerShell)

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
alembic upgrade head
cd ..
```

### macOS/Linux (bash/zsh)

```bash
cd backend
source .venv/bin/activate
alembic upgrade head
cd ..
```

## 6) Run the apps

```bash
npm run dev
```

URLs:
- Frontend: `http://localhost:3000`
- Backend: `http://127.0.0.1:8000`
- Backend docs: `http://127.0.0.1:8000/docs`

## Useful commands

```bash
npm run dev:frontend
npm run dev:backend
npm run build
npm run lint
```

## shadcn

shadcn is initialized in `frontend`.

From `frontend`:

```bash
npm run ui:list
npm run ui:add -- button
npm run ui:add -- card
```

## Security rules

- Never commit real `.env` files.
- Only commit `.env.example` templates.
- If secrets were ever committed, rotate them and rewrite history.
