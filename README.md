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

## 🐳 Docker Images (Docker Hub)

Prebuilt images are available on Docker Hub:

- **Frontend:** `omarhany04/order-processing-frontend`
- **Backend:** `omarhany04/order-processing-backend`

---

## 🤖 Ollama Setup (Booky Assistant)

Booky Assistant uses **Ollama** with **Llama 3.2 (3B)**.  
To make the chatbot work correctly, you must pull the model (one-time setup).

### 1) Install Ollama (on your machine)

Download Ollama from:

https://ollama.com

Verify installation:

```bash
ollama --version
```

### 2) Pull the required model
```bash
ollama pull llama3.2:3b
```

## Quick Notes (Important)

The backend connects to Ollama using:
```bash
OLLAMA_BASE_URL=http://ollama:11434

OLLAMA_MODEL=llama3.2:3b
```
If you don’t pull the model, the assistant may fail or return no response.

## Services & Ports
<table>
  <thead>
    <tr>
      <th align="left">Service</th>
      <th align="left">URL</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Frontend</b></td>
      <td><a href="http://localhost:5173">http://localhost:5173</a></td>
    </tr>
    <tr>
      <td><b>Backend</b></td>
      <td><a href="http://localhost:5000">http://localhost:5000</a></td>
    </tr>
    <tr>
      <td><b>Ollama</b></td>
      <td><a href="http://localhost:11434">http://localhost:11434</a></td>
    </tr>
    <tr>
      <td><b>Database</b></td>
      <td><code>localhost:5433</code></td>
    </tr>
  </tbody>
</table>





## 🚀 Quick Start Guide

### Prerequisites
- **Docker** and **Docker Compose** installed on your system
- At least **4GB RAM** available (for Ollama AI service)
- Ports **5000**, **5173**, **5433**, and **11434** available (or configure different ports in `.env`)

### Step 1: Clone the Repository
```bash
git clone https://github.com/omarhany04/Bookstore
cd order-processing-system
```

### Step 2: Configure Environment Variables (Optional)
The project works out-of-the-box with default values. For customization:

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env if you want to change defaults (optional)
```

**Important:** For production deployments, **change the JWT_SECRET** in `.env` to a strong random string.

### Step 3: Start the Application 
```bash
# Build and start all services
docker compose up --build

# Or run in detached mode (background)
docker compose up --build -d
```

### Step 4: Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Database:** localhost:5433 (user: `bookstore_user`, password: `bookstore_pass`)

### Step 5: Stop the Application
```bash
# Stop all services
docker compose down

# Stop and remove volumes (clears database data ana ai model)
docker compose down -v
```
---
---
<div align="center">
  <img src="https://i.ibb.co/pv1wBhD2/Booky-Logo.jpg"
       alt="Project Logo"
       height="100" />
</div>

---
---