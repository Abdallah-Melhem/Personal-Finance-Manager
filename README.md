# 💰 FinTrack — Personal Finance Management System

> A full-stack MERN web application for tracking income, expenses, and financial goals. Built as a comprehensive academic project demonstrating modern web development practices.

![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Screenshots](#screenshots)
- [Testing](#testing)

---

## Overview

**FinTrack** is a Personal Finance Management System built with the MERN stack (MongoDB, Express.js, React, Node.js). It allows registered users to record and categorize their income and expenses, visualize their financial health through an interactive dashboard with charts, filter and search through transactions, manage their account profile, and upload a custom avatar.

This project was built as a full academic assignment covering all layers of a production-ready web application — from database modeling and RESTful API design to a responsive React frontend.

---

## ✨ Features

### Authentication & Security
- 🔐 **JWT-based authentication** with secure token storage
- 🔒 **Password hashing** using bcrypt
- 🛡️ **Protected routes** on both client and server
- 👤 **User-scoped data** — each user can only access their own records

### Transaction Management
- ➕ **Add** income and expense transactions
- ✏️ **Edit** transaction details
- 🗑️ **Delete** with a confirmation modal
- 🏷️ **Categorized** (Salary, Food, Bills, Transportation, etc.)

### Search, Filtering & Pagination
- 🔍 **Keyword search** across description and category (debounced)
- 🗂️ **Multi-filter**: type, category, and custom date range
- 📄 **Server-side pagination** (10 records per page with navigation)

### Dashboard & Analytics
- 📊 **Summary cards**: Balance, Total Income, Total Expenses, Transaction Count
- 📈 **Bar chart**: Monthly income vs expenses (Recharts)
- 🥧 **Donut chart**: Expenses breakdown by category (Recharts, interactive)
- 🕒 **Recent transactions** table on dashboard

### User Profile
- 🖼️ **Profile picture upload** (JPEG, PNG, WebP — max 5MB, via Multer)
- ✏️ **Update name and email**
- 🔑 **Change password** with current password verification

### Developer Quality
- ✅ **Express-validator** input validation on all endpoints
- ⚠️ **Centralized error handling** (CastError, duplicate key, JWT errors, 404)
- 📦 **Modular architecture** (routes → controllers → models → middleware)
- 🧪 **40-test automated suite** covering all phases

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router v6 |
| **UI Library** | Bootstrap 5, Bootstrap Icons |
| **Charts** | Recharts |
| **Backend** | Node.js, Express.js 4 |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Authentication** | JSON Web Tokens (JWT), bcrypt |
| **File Uploads** | Multer |
| **Validation** | express-validator |
| **Dev Tools** | nodemon, concurrently |

---

## 📁 Project Structure

```
fintrack-mern/
├── client/                     # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConfirmModal.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── TransactionFilters.jsx
│   │   │   ├── TransactionForm.jsx
│   │   │   └── TransactionList.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── AddTransaction.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EditTransaction.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Transactions.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                     # Express.js backend
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── transactionController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   └── validatorMiddleware.js
│   ├── models/
│   │   ├── Transaction.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── userRoutes.js
│   ├── uploads/               # Profile picture storage (git-ignored)
│   ├── testRunner.js          # Automated test suite (40 tests)
│   ├── server.js
│   └── package.json
│
├── .env.example               # Environment variable template
├── package.json               # Root scripts (concurrently)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- A free **MongoDB Atlas** account ([cloud.mongodb.com](https://cloud.mongodb.com))

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/fintrack-mern.git
cd fintrack-mern
```

### 2. Install Dependencies

```bash
# Install root + all workspace dependencies (server + client)
npm install
```

### 3. Set Up Environment Variables

open `.env` and fill in your values:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/fintrack?retryWrites=true&w=majority
JWT_SECRET=your_strong_secret_key_here
PORT=5000
NODE_ENV=development
```

> **MongoDB Atlas Setup**: Create a free cluster → Create a database user → Whitelist your IP → Copy the connection string.

### 4. Start the Application

```bash
# Starts both backend (port 5000) and frontend (port 5173) concurrently
npm run dev
```

Then open your browser at: **[http://localhost:5173](http://localhost:5173)**

---

## ⚙️ Environment Variables

Create a file at `server/.env`:

| Variable | Description | Example |
|---|---|---|
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for signing JWTs | Any long random string |
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |

---

## 📡 API Reference

All API endpoints are prefixed with `/api`. Protected routes require the header:
```
Authorization: Bearer <token>
```

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | ❌ | Register a new user |
| `POST` | `/login` | ❌ | Login and receive JWT |
| `POST` | `/logout` | ❌ | Logout (client-side token discard) |
| `GET` | `/me` | ✅ | Get current user info |

### Transactions — `/api/transactions`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | ✅ | List transactions (with search, filter, pagination) |
| `POST` | `/` | ✅ | Create a new transaction |
| `GET` | `/:id` | ✅ | Get a single transaction |
| `PUT` | `/:id` | ✅ | Update a transaction |
| `DELETE` | `/:id` | ✅ | Delete a transaction |

**Query Parameters for `GET /`:**

| Param | Type | Description |
|---|---|---|
| `search` | `string` | Keyword search (description or category) |
| `type` | `income` \| `expense` | Filter by type |
| `category` | `string` | Filter by exact category |
| `startDate` | `YYYY-MM-DD` | Date range start |
| `endDate` | `YYYY-MM-DD` | Date range end |
| `page` | `number` | Page number (default: 1) |
| `limit` | `number` | Items per page (default: 10, max: 50) |

### Dashboard — `/api/dashboard`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/summary` | ✅ | Total income, expense, balance, recent transactions |
| `GET` | `/categories` | ✅ | Expense breakdown by category |
| `GET` | `/monthly` | ✅ | Monthly income vs expense grouped by month |

### Users — `/api/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/profile` | ✅ | Get user profile |
| `PUT` | `/profile` | ✅ | Update name and email |
| `PUT` | `/password` | ✅ | Change password |
| `POST` | `/profile-picture` | ✅ | Upload profile picture (multipart/form-data) |

---

## 🧪 Testing

A comprehensive automated test suite is included. To run it:

```bash
# In one terminal — start the server
cd server
npm run dev

# In another terminal — run the 40-test suite
cd server
node testRunner.js
```

### Test Coverage (40 Tests, 13 Categories)

| # | Category | Tests |
|---|---|---|
| 1 | Registration | 4 |
| 2 | Login | 2 |
| 3 | Logout | 1 |
| 4 | Protected Routes | 3 |
| 5 | Transaction CRUD | 7 |
| 6 | Ownership & Data Isolation | 4 |
| 7 | Keyword Search | 1 |
| 8 | Filters | 2 |
| 9 | Pagination | 1 |
| 10 | Dashboard Endpoints | 6 |
| 11 | User Profile & Avatar | 5 |
| 12 | Input Validation | 2 |
| 13 | Centralized Error Handling | 2 |

---

## 📜 Available Scripts

### Root (from project root)

| Script | Description |
|---|---|
| `npm run dev` | Start both server and client concurrently |
| `npm run server` | Start only the backend server |
| `npm run client` | Start only the frontend (Vite dev server) |

### Server (`/server`)

| Script | Description |
|---|---|
| `npm start` | Start with Node.js |
| `npm run dev` | Start with nodemon (auto-reload) |

### Client (`/client`)

| Script | Description |
|---|---|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## 🔒 Security Notes

- Passwords are hashed with **bcrypt** (salt rounds: 10) before storage — plaintext passwords are never saved.
- JWTs are signed with a secret key and expire after **7 days**.
- All API routes that access user data verify ownership before returning or modifying data, preventing cross-user data leaks.
- File uploads are restricted to images only (JPEG, PNG, WebP) with a 5MB size cap.

---

## 📄 License

This project is built as an academic assignment and is open for educational reference.

---

*Built with ❤️ using the MERN Stack*
