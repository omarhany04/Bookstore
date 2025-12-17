# Order Processing System (Online Bookstore)
Alexandria University — Database Systems (Fall 2025)

## Tech Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: PostgreSQL (use pgAdmin 4 to inspect)

## Quick Start (Docker)
1. Install Docker Desktop
2. From the repo root:
   ```bash
   docker compose up --build
   ```
3. Open:
   - Frontend: http://localhost:5173
   - Backend health: http://localhost:5000/health

## Default Demo Accounts
- Admin:
  - username: `admin`
  - password: `admin123`
- Customer:
  - username: `sara`
  - password: `sara123`

## Notes
- Stock constraints + auto replenishment triggers are implemented in `database/schema.sql`.
- Reports are under Admin → Reports.
