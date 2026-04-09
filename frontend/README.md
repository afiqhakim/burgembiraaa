# Frontend (Next.js + shadcn/ui)

This is the frontend app for Burgembiraaa.

## Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS v4
- shadcn/ui

## Start

From repo root:

```bash
npm run dev:frontend
```

App URL:
- `http://localhost:3000`

## Environment

Create local env file:

```bash
copy .env.local.example .env.local
```

Current variable:
- `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`

## shadcn/ui Setup Status

Already initialized in this app:
- `components.json` exists
- Aliases use `@/*`
- Base component created (`src/components/ui/button.tsx`)

## Add shadcn components

From `frontend` directory:

```bash
npm run ui:add -- button
npm run ui:add -- input
npm run ui:add -- card
```

List available items:

```bash
npm run ui:list
```

## Lint

```bash
npm run lint
```
