# Spendwise

Spendwise is a student expense tracker built with React, Vite, Express, and PostgreSQL-compatible storage.

## Features

- Dashboard with monthly spending and budget summaries
- Expense creation, editing, search, filtering, and deletion
- Monthly budget creation and updates
- Spending reports by category
- Local fallback mode for development
- Supabase database support

## Requirements

- Node.js 18 or newer
- npm
- A Supabase PostgreSQL project for persistent storage

## Local development

Start the frontend and API together from the repository root:

```bash
npm install
npm run dev
```

The frontend runs at http://localhost:5173 by default, and its `/api` requests
are proxied to the local API on port 5000.

For persistent data, configure `server/.env` before starting the app:

```bash
cd server
cp .env.example .env
```

Update the copied .env file with the real Supabase direct connection string. Never commit the file or include credentials in screenshots or chat.

### Deploying the frontend and API

The Render configuration in `render.yaml` deploys the API only. When the
frontend is hosted separately, configure these environment variables before
building/redeploying:

- On the frontend host, set `VITE_API_URL` to the API's public URL ending in
  `/api` (for example, `https://your-api.example.com/api`). Do not use
  `localhost` for a deployed frontend.
- On the API host, set `FRONTEND_URL` to the frontend's public origin only
  (for example, `https://your-app.example.com`, without a path or trailing
  slash). This allows the browser's cross-origin API requests.
- For persistent production data, also set `DATABASE_URL` to the Supabase
  PostgreSQL connection string and initialize the schema as described below.

After redeploying, verify that `<API URL>/health` and `<API URL>/expenses`
return JSON.

#### Vercel-only deployment

If you deploy only the frontend to Vercel without an absolute `VITE_API_URL`,
the production app stores expenses and budgets in that browser's local storage.
This requires no separate API service, but data is limited to that browser and
device and is not shared or backed up. Redeploy the Vercel project after pushing
the code changes. To use shared, persistent data instead, deploy the API and
database and configure `VITE_API_URL`, `FRONTEND_URL`, and `DATABASE_URL`.

## Backend commands

```bash
cd server
npm run dev
npm start
```

## Database setup

Run the SQL in `server/supabase-schema.sql` in the Supabase SQL Editor before using the production database. The script creates the required tables, indexes, and sample records.

## Available scripts

- `npm run dev` — start the Vite development server
- `npm run build` — create a production frontend build
- `npm run preview` — preview the production build
- `cd server && npm run dev` — start the Express API with automatic reload
- `cd server && npm start` — start the Express API

## Notes

- The backend uses local in-memory data when `DATABASE_URL` is not configured.
- Supabase must be configured before production data persistence is enabled.
- Deployment must follow the security checklist in `SECURITY_CHECKLIST.md`.
