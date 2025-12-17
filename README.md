<h1>
  <img src="../order-processing-system/frontend/src/assets/BookyLogo.jpg"
       alt="Project Logo"
       height="75"
       style="vertical-align: middle; margin-right: 12px;" />
  Order Processing System 
</h1>

The **Order Processing System** is a full-stack bookstore application that handles online book browsing, purchasing, and inventory management. Customers can search for books, manage a shopping cart, place orders, and view their order history, while administrators can manage books, monitor stock levels, confirm replenishment orders, and generate sales reports.

The backend is built with **Node.js, Express, and PostgreSQL**, using JWT-based authentication and role-based access control. Core business rules such as stock validation and automatic replenishment are enforced at the database level. The frontend is developed using **React, Vite, and Tailwind CSS**, and the entire system is containerized with **Docker Compose** for easy setup and deployment.

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
