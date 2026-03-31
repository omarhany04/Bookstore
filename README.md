# Booky

Booky is a full-stack bookstore platform built with React, Express, Node.js, and PostgreSQL. It covers the full customer journey from browsing books and checkout to order history, profile management, admin inventory workflows, replenishment tracking, reports, and a Booky-specific AI assistant.

## Current Stack

### Frontend
- React + Vite
- Tailwind CSS
- React Router
- Context-based auth and app state

### Backend
- Node.js + Express
- PostgreSQL via `pg`
- JWT authentication
- Role-based access control

### Database
- PostgreSQL schema, triggers, and seed data in [`database/`](./database)

### AI Assistant
- Booky-specific chatbot with built-in direct intents
- Cloud provider chain: Gemini -> OpenRouter -> Groq
- Recommends books from the current catalog and stays scoped to Booky topics

## Main Features

### Customer flows
- Browse books with category filtering and detail pages
- Add books to cart with stock-aware quantity handling
- Checkout with card validation or cash on delivery
- View past orders and cancel confirmed orders
- Manage profile details and avatar
- Take the reading quiz

### Admin flows
- Protected admin dashboard
- Manage books, categories, publishers, and stock thresholds
- Review replenishment orders
- View sales and inventory reports

### Database-driven inventory logic
- PostgreSQL triggers create replenishment orders when stock drops below threshold
- Confirming replenishment updates stock at the database layer
- Order cancellation restores stock and keeps reports consistent

## Project Structure

```text
Booky/
├─ backend/
├─ frontend/
├─ database/
├─ docker-compose.yml
└─ README.md
```

## Environment Variables

### Backend

Use [`backend/.env.example`](./backend/.env.example) as the template.

Required for production or any hosted deployment:

```env
DATABASE_URL=
JWT_SECRET=
GEMINI_API_KEY=
OPENROUTER_API_KEY=
GROQ_API_KEY=
```

Optional model overrides:

```env
GEMINI_MODEL=gemini-2.5-flash-lite
OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct:free
GROQ_MODEL=llama-3.1-8b-instant
```

Local-only:

```env
PORT=5000
```

### Frontend

For local or hosted frontend builds:

```env
VITE_API_BASE=http://localhost:5000/api
```

## Local Development

You can run Booky either with Docker Compose or by starting frontend and backend separately.

### Option 1: Docker Compose

1. Copy [`backend/.env.example`](./backend/.env.example) to `backend/.env`.
2. Fill in `JWT_SECRET` and any chatbot provider keys you want to use.
3. From the repo root, start the stack:

```bash
docker compose up --build
```

Local service URLs:

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:5000](http://localhost:5000)
- Health check: [http://localhost:5000/health](http://localhost:5000/health)
- Postgres: `localhost:5433`

Compose starts:
- PostgreSQL with [`database/schema.sql`](./database/schema.sql) and [`database/seed.sql`](./database/seed.sql)
- Express backend
- Vite frontend

To stop everything:

```bash
docker compose down
```

### Option 2: Run services manually

1. Start PostgreSQL locally or use Supabase.
2. Create `backend/.env` with a valid `DATABASE_URL`, `JWT_SECRET`, and optional chatbot provider keys.
3. Start the backend:

```bash
cd backend
npm install
npm start
```

4. In a second terminal, start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Default local URLs:

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API base: [http://localhost:5000/api](http://localhost:5000/api)

## Production Deployment

The current recommended free deployment path for this repo is:

- Frontend: Vercel
- Backend: Vercel
- Database: Supabase

### Supabase

1. Create a Supabase project.
2. Run [`database/schema.sql`](./database/schema.sql) and [`database/seed.sql`](./database/seed.sql) in the SQL editor.
3. Use the transaction pooler connection string for `DATABASE_URL`.

### Backend on Vercel

Deploy the `backend` directory as its own Vercel project and add:

```env
DATABASE_URL=postgresql://postgres.YOUR_PROJECT_REF:YOUR_DB_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
JWT_SECRET=your-strong-random-secret
GEMINI_API_KEY=...
OPENROUTER_API_KEY=...
GROQ_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash-lite
OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct:free
GROQ_MODEL=llama-3.1-8b-instant
```

### Frontend on Vercel

Deploy the `frontend` directory as a second Vercel project and add:

```env
VITE_API_BASE=https://your-backend-project.vercel.app/api
```

[`frontend/vercel.json`](./frontend/vercel.json) is already included so client-side routes work correctly on refresh.

## Chatbot Notes

- The assistant is scoped to Booky topics only.
- It can answer direct built-in questions even when no provider key is available.
- For richer AI responses, configure at least one of:
  - `GEMINI_API_KEY`
  - `OPENROUTER_API_KEY`
  - `GROQ_API_KEY`

Starter prompts in the UI include:
- `Show me science books`
- `How does checkout work?`
- `What can admins do?`

## Seeded Admin User

The seed data creates an admin account in [`database/seed.sql`](./database/seed.sql). Review that file before sharing or deploying the project and change seeded credentials in real environments.

## Useful Endpoints

- `GET /health`
- `GET /api/books`
- `GET /api/categories`
- `POST /api/auth/login`
- `POST /api/chat`
- `GET /api/admin/replenishment-orders`
- `GET /api/reports/top-books`

## Notes

- Keep real secrets in `backend/.env` or your hosting platform environment settings, not in the repo.
- [`backend/.env.example`](./backend/.env.example) is only a template.
- If admin access changes for a user, signing out and back in is the safest way to refresh the frontend session state.

<div align="center">
  <img
    src="https://i.ibb.co/pv1wBhD2/Booky-Logo.jpg"
    alt="Booky logo"
    height="100"
  />
</div>

---