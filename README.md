<<<<<<< HEAD
﻿# Burgembiraaa (Beginner Setup Guide)

This project has 2 apps:
- `frontend` = website (Next.js)
- `backend` = API server (FastAPI + PostgreSQL)

Think of it like this:
- frontend shows the UI
- backend stores data and business logic

## Why `.env` Matters

A `.env` file stores private values (secrets), like:
- database password
- JWT/secret key

If a real `.env` is committed to GitHub:
- anyone can copy your credentials
- your database/app can be accessed by others
- even if you delete the file later, old commits still keep a copy

So we keep only template files in git:
- `backend/.env.example`
- `frontend/.env.local.example`

You create your own local `.env` files from these templates.

## Requirements

Install these first:
- Node.js 20+
- npm 10+
- Python 3.12+
- Docker Desktop

## Step 1: Install Dependencies

From project root:
=======
﻿# burgembiraaa

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
>>>>>>> 1f1825000cd89e52e1344dd2d6257a67881860fc

```bash
npm install
```

<<<<<<< HEAD
For backend Python packages:
=======
Backend Python deps:
>>>>>>> 1f1825000cd89e52e1344dd2d6257a67881860fc

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
<<<<<<< HEAD
cd ..
```

## Step 2: Create Local Env Files

```bash
copy backend\.env.example backend\.env
copy frontend\.env.local.example frontend\.env.local
```

Then open `backend/.env` and set your real values.

## Step 3: Start PostgreSQL (Docker)
=======
```

## 2) Configure environment

Create backend env file:

```bash
copy backend\.env.example backend\.env
```

If needed, create frontend env file:

```bash
copy frontend\.env.local.example frontend\.env.local
```

## 3) Start Postgres
>>>>>>> 1f1825000cd89e52e1344dd2d6257a67881860fc

```bash
docker run --name postgres-dev ^
  -e POSTGRES_USER=postgres ^
  -e POSTGRES_PASSWORD=password ^
  -e POSTGRES_DB=app_db ^
  -p 5432:5432 ^
  -d postgres:15
```

<<<<<<< HEAD
## Step 4: Run Database Migrations
=======
## 4) Run database migrations

```bash
cd backend
alembic upgrade head
```

## 5) Run apps

Activate backend virtualenv in your terminal first:
>>>>>>> 1f1825000cd89e52e1344dd2d6257a67881860fc

```bash
cd backend
.venv\Scripts\activate
<<<<<<< HEAD
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
=======
cd ..
```

From root (both apps via Turbo):

```bash
npm run dev
```

Or individually:

```bash
npm run dev:frontend
npm run dev:backend
```

Expected local URLs:
- Frontend: `http://localhost:3000`
- Backend API: `http://127.0.0.1:8000`

## Notes

- Backend reads config from `backend/.env`.
- Default backend CORS origin is `http://localhost:3000`; override with `CORS_ORIGINS`.
- Do not commit real `.env` files. Keep secrets only in local env files.
>>>>>>> 1f1825000cd89e52e1344dd2d6257a67881860fc
