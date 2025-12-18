# 📚 Booky – Online Bookstore Order Processing System
       
Booky is a **full-stack, containerized Order Processing System** for an online bookstore.  
It manages the **entire lifecycle of book sales** — from customer browsing and checkout to administrative inventory control, automated stock replenishment, and business analytics.

The system is built using a modern **PERN stack** (**PostgreSQL, Express, React, Node.js**) and orchestrated with **Docker Compose** for seamless deployment.

---

## 🚀 Tech Stack

### Backend
- **Node.js + Express**
- **PostgreSQL**
- **JWT Authentication**
- **Role-Based Access Control (RBAC)**
- **Database Triggers & Stored Logic**

### Frontend
- **React (Vite)**
- **Tailwind CSS**
- **Context API (Auth & Theme)**
- **Dark / Light Mode**

### DevOps & Infrastructure
- **Docker & Docker Compose**
- **PostgreSQL Database Containers**
- **AI Service (Ollama – Llama 3.2)**

---

## ✨ Key Features

## 1️⃣ Customer Experience

### 🔍 Smart Browsing & Search
- Browse books with **pagination** for performance.
- Filter by **title** or **category**.
- View detailed book information.

### 🛒 Shopping Cart System
- Persistent shopping cart.
- Quantity adjustment with **real-time stock validation**.
- Prevents adding items beyond available warehouse stock.

### 💳 Flexible Checkout
- **Credit/Debit Card** payments with **Luhn Algorithm validation**.
- **Cash on Delivery (COD)** option.
- Secure order confirmation flow.

### 📦 Order Management
- View complete **order history**.
- Cancel orders in **Confirmed** status.
- Automatic **stock restoration** when an order is canceled.

### 👤 User Profiles
- Update personal information.
- Manage shipping addresses.
- Upload or change **profile avatars** (stored locally).

---

## 2️⃣ Administrative & Inventory Control

### 🔐 Role-Based Access Control (RBAC)
- Separate **ADMIN** and **CUSTOMER** roles.
- Protected backend routes and frontend views.

### 📘 Book Management
- Add, edit, and delete books.
- Manage **authors**, **publishers**, and **categories**.
- Control pricing and stock levels.

### 🔄 Automated Stock Replenishment (Core Feature)
- When a book’s stock drops below a defined **threshold**:
  - A **PostgreSQL trigger** automatically creates a **replenishment order**.
- Ensures stock consistency and zero downtime.

### ✅ Replenishment Confirmation
- Admins review replenishment orders.
- Upon confirmation:
  - A second **database trigger** automatically increases stock.
- All logic handled at the database level for **maximum integrity**.

---

## 3️⃣ Business Intelligence & Reporting

An advanced **Admin Reporting Dashboard** provides actionable insights:

### 📊 Sales Analytics
- Total sales for:
  - Previous month
  - Any specific calendar day

### 🏆 Top Performers
- **Top 5 customers** by total spending.
- **Top 10 best-selling books** over the last 3 months.

### 📦 Inventory Health
- Track how many times each book required replenishment.
- Identify high-demand or low-stock-risk items.

---

## 4️⃣ 🤖 AI-Powered Assistance

### Booky Assistant
- Integrated **book-focused AI chatbot** powered by **Ollama (Llama 3.2)**.
- Designed specifically for bookstore-related interactions:
  - Book recommendations
  - Category explanations
  - Browsing and checkout guidance
  - Admin workflow assistance
- The chatbot does **not** answer general or unrelated questions.

---

## 🛠 Technical Highlights

- **Database Triggers**
  - Prevent negative stock.
  - Automate replenishment and stock updates.
- **High Data Integrity**
  - Business logic enforced at the database level.
- **Responsive UI**
  - Built with Tailwind CSS.
  - Fully supports **Dark Mode & Light Mode**.
- **Containerized Architecture**
  - Backend, frontend, database, and AI service run with a single command.

---
       
## 🐳 Running the Project (Docker)

```bash
docker compose up --build
```
---
<div align="center">
  <img src="https://i.ibb.co/pv1wBhD2/Booky-Logo.jpg"
       alt="Project Logo"
       height="100" />
</div>

---