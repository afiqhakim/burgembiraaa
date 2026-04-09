# burgembiraaa

Monorepo with:
- `frontend`: Next.js app
- `backend`: FastAPI app + Alembic migrations
- Root: npm workspaces + Turborepo orchestration

## Prerequisites

- Node.js 20+
- npm 10+
- Python 3.12+
- Docker (for local Postgres)

## 1) Install dependencies

From repo root:

```bash
npm install
```

For backend Python packages:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

## Step 2: Create Local Env Files

```bash
copy backend\.env.example backend\.env
copy frontend\.env.local.example frontend\.env.local
```

Then open `backend/.env` and set your real values.

## Step 3: Start PostgreSQL (Docker)

```bash
docker run --name postgres-dev ^
  -e POSTGRES_USER=postgres ^
  -e POSTGRES_PASSWORD=password ^
  -e POSTGRES_DB=app_db ^
  -p 5432:5432 ^
  -d postgres:15
```

or (for windows powershell)

```bash
docker run --name postgres-dev -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=app_db -p 5432:5432 -d postgres:15
```

or if already exist 

```bash
docker start postgres-dev
```

## Step 4: Run Database Migrations

```bash
cd backend
.venv\Scripts\activate
alembic upgrade head
cd ..
```

## Step 5: Run the Apps

In a terminal where backend venv is active:

```bash
cd backend
.venv\Scripts\activate
cd ..
npm run dev
```

This starts both apps via Turborepo.

Expected URLs:
- frontend: `http://localhost:3000`
- backend: `http://127.0.0.1:8000`

## Useful Commands

Run only frontend:

```bash
npm run dev:frontend
```

Run only backend:

```bash
npm run dev:backend
```

## Team Rule (Important)

Never commit real secrets:
- do not commit `.env`
- only commit `.env.example`
