# Personal Finance Management System

A complete academic Full-Stack Web Development application built using the **MERN** stack (MongoDB, Express.js, React, Node.js).

---

## 1. Project Overview

The **Personal Finance Management System** provides registered users with a secure, responsive, and intuitive web application to track their personal income and expenses. The system implements core full-stack web development concepts—authentication, authorization, RESTful API design, database modeling, CRUD operations, state management, data visualization, search, filtering, and pagination.

### Key Objectives
* Demonstrates full-stack software development best practices using the MERN stack.
* Implements robust user authentication with JWT and bcrypt password hashing.
* Enforces strict data ownership: users can only view and manage their own financial records.
* Provides interactive financial dashboards with real-time calculations and visual charts.

---

## 2. Technology Stack

### Frontend
* **React (Vite)**: Component-based UI library and fast modern build tool (JavaScript).
* **React Router**: Client-side routing for public and protected views.
* **Axios**: Promise-based HTTP client for API communication.
* **Context API**: Global state management for authentication and session status.
* **Bootstrap**: Responsive UI styling and components.
* **Recharts**: Declarative data visualization library for financial charts.

### Backend
* **Node.js**: Asynchronous event-driven JavaScript runtime.
* **Express.js**: Web framework for building RESTful APIs and middleware pipelines.
* **Mongoose**: Object Data Modeling (ODM) library for MongoDB.
* **jsonwebtoken (JWT)**: Stateless token-based user authentication and route protection.
* **bcrypt**: Industry-standard password hashing algorithm.
* **express-validator**: Server-side request validation and sanitization.
* **Multer**: Middleware for handling `multipart/form-data` and profile image uploads.
* **dotenv**: Environment variable management.
* **cors**: Cross-Origin Resource Sharing handling.

### Database
* **MongoDB Atlas**: Fully managed cloud-native NoSQL database.

---

## 3. System Architecture

```
React Frontend (Vite)
       │
       │ HTTP / REST API (Axios + JWT Bearer Header)
       ▼
Express REST API (Routes & Controllers)
       │
       │ Middleware (Auth, Validation, Error Handling)
       ▼
Node.js Runtime
       │
       │ Mongoose ODM
       ▼
MongoDB Atlas (Users, Transactions)
```

---

## 4. Project Directory Structure

```
personal-finance-management/
├── client/                     # Frontend React (Vite) application
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, ProtectedRoute, Cards)
│   │   ├── pages/              # Routed pages (Login, Register, Dashboard, Transactions, Profile)
│   │   ├── context/            # React Contexts (AuthContext)
│   │   ├── services/           # Axios instance and API call services
│   │   ├── utils/              # Client helper functions and formatters
│   │   ├── App.jsx             # Root React component & route definitions
│   │   ├── main.jsx            # React entry point
│   │   └── App.css             # Global styles
│   └── package.json
│
├── server/                     # Backend Node.js & Express application
│   ├── config/                 # Configuration files (Database connection)
│   ├── controllers/            # Route controllers handling business logic
│   ├── middleware/             # Custom middleware (Auth, error handlers)
│   ├── models/                 # Mongoose schemas and models (User, Transaction)
│   ├── routes/                 # Express API routes
│   ├── utils/                  # Backend utilities (JWT token generators)
│   ├── uploads/                # Directory for user profile pictures
│   ├── server.js               # Express application entry point
│   └── package.json
│
├── .env.example                # Example environment variables template
├── .gitignore                  # Git ignore specifications
├── package.json                # Root package configuration
└── README.md                   # Project documentation
```

---

## 5. Database Schema

### User Model (`users` collection)
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Auto-generated unique identifier |
| `name` | String | User's full name (Required, Trimmed) |
| `email` | String | Unique email address (Required, Lowercase, Indexed) |
| `password` | String | Hashed password via bcrypt (Required) |
| `profilePicture` | String | URL or file path to avatar image |
| `createdAt` | Date | Timestamp of account creation |
| `updatedAt` | Date | Timestamp of last profile update |

### Transaction Model (`transactions` collection)
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Auto-generated unique identifier |
| `user` | ObjectId | Reference to `User` model (Required, Indexed) |
| `type` | String | `income` or `expense` (Required) |
| `amount` | Number | Transaction amount, positive value (Required) |
| `category` | String | Specific category (e.g., Salary, Food, Bills) (Required) |
| `description` | String | Optional transaction notes/description |
| `date` | Date | Date of transaction (Required, Defaults to current date) |
| `createdAt` | Date | Timestamp of record creation |
| `updatedAt` | Date | Timestamp of last record update |

---

## 6. REST API Specification

### Authentication (`/api/auth`)
* `POST /api/auth/register` — Register a new user account.
* `POST /api/auth/login` — Authenticate user and issue JWT token.
* `GET /api/auth/me` — Retrieve current authenticated user details.
* `POST /api/auth/logout` — Client session invalidation.

### User Profile (`/api/users`)
* `GET /api/users/profile` — Get profile information of the current user.
* `PUT /api/users/profile` — Update user name and email.
* `PUT /api/users/password` — Change account password (verifies current password).
* `POST /api/users/profile-picture` — Upload and update profile picture using Multer.

### Transactions (`/api/transactions`)
* `GET /api/transactions` — Get transactions for authenticated user (supports search, filter, pagination).
* `POST /api/transactions` — Create a new transaction (income/expense).
* `GET /api/transactions/:id` — Get single transaction details by ID.
* `PUT /api/transactions/:id` — Update an existing transaction.
* `DELETE /api/transactions/:id` — Delete a transaction.

### Dashboard (`/api/dashboard`)
* `GET /api/dashboard/summary` — Retrieve financial totals: income, expenses, balance, count, and recent transactions.
* `GET /api/dashboard/categories` — Get aggregated expense totals grouped by category.
* `GET /api/dashboard/monthly` — Get monthly trend comparison for income vs. expenses.

---

## 7. Environment Variables Setup

Create a `.env` file in the `server/` directory (or workspace root as configured) containing:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/personal_finance_db?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173
```

> **Note**: Never commit `.env` files into version control.

---

## 8. Implementation Phases

1. **Phase 0 — Project Planning**: Requirements analysis, architecture definition, folder structure, repository setup.
2. **Phase 1 — Project Setup**: React/Vite frontend and Node/Express backend scaffolding, MongoDB connection, health check.
3. **Phase 2 — Database Models**: Mongoose User and Transaction schemas with validation and relationships.
4. **Phase 3 — Authentication**: JWT auth, bcrypt hashing, auth middleware, and protected endpoints.
5. **Phase 4 — Transaction CRUD API**: Full backend CRUD for income/expense records with strict user ownership.
6. **Phase 5 — React Authentication**: React Router, AuthContext, login/register forms, protected client routes, navbar.
7. **Phase 6 — Transaction Frontend**: Transaction forms, lists, CRUD operations via Axios, loading/error states.
8. **Phase 7 — Dashboard**: Financial KPI summary cards, Recharts visualizations (income vs expense, category split).
9. **Phase 8 — Search, Filtering and Pagination**: Server-side filtering, multi-parameter search, paginated results.
10. **Phase 9 — Validation and Error Handling**: Centralized error middleware, express-validator, user feedback toasts.
11. **Phase 10 — User Profile**: Profile editing, password change, Multer image upload.
12. **Phase 11 — UI Polish**: Responsive layout improvements, clean Bootstrap styling, empty states.
13. **Phase 12 — Testing**: End-to-end verification, security audits, regression checks.
14. **Phase 13 — Deployment**: Production environment preparation and deployment guide.
