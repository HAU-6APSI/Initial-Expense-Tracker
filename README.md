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

### Frontend

```bash
npm install
npm run dev
```

The frontend runs at http://localhost:5173 by default.

### Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Update the copied .env file with the real Supabase direct connection string. Never commit the file or include credentials in screenshots or chat.

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
