# RENZA Backend API

Production-grade REST API for the **RENZA On-Demand Household Help Platform**, built with Node.js, Express, TypeScript, and PostgreSQL.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js ≥ 18 |
| Framework | Express 4 |
| Language | TypeScript 5 (strict mode) |
| Database | PostgreSQL 15+ |
| Auth | JWT + bcryptjs |
| Security | Helmet, CORS, express-rate-limit |

---

## Quick Start

### 1. Prerequisites
- Node.js ≥ 18
- PostgreSQL 15+
- npm or yarn

### 2. Clone & Install

```bash
cd D:\renza-backend
npm install
```

### 3. Configure Environment

```bash
copy .env.example .env
```

Edit `.env` with your actual values:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/renza_db
JWT_SECRET=change_this_to_a_random_64_char_string_in_production
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:3000
```

### 4. Create Database & Run Schema

```bash
# Create database
psql -U postgres -c "CREATE DATABASE renza_db;"

# Run schema (creates tables + seeds services + default admin)
psql -U postgres -d renza_db -f src/database/schema.sql
```

> **Default Admin Credentials** (change password after first login):
> - Email: `admin@renza.in`
> - Password: `Admin@1234`

### 5. Run Development Server

```bash
npm run dev
```

### 6. Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
src/
├── config/
│   ├── db.ts          # PostgreSQL pool + query helper
│   └── env.ts         # Env var validation (fails fast if missing)
├── controllers/       # Business logic per domain
├── middleware/        # Auth, admin guard, global error handler
├── models/types.ts    # All TypeScript interfaces
├── routes/            # Express routers
├── utils/             # JWT helpers, response wrappers, validators
└── database/schema.sql
server.ts              # Entry point with graceful shutdown
```

---

## API Reference

Base URL: `http://localhost:5000`

All responses follow the envelope format:
```json
{
  "success": true,
  "message": "...",
  "data": { ... },
  "meta": { "total": 100, "page": 1, "limit": 20 }
}
```

---

### 🔑 Auth — `/api/auth`

#### `POST /api/auth/register`
```json
// Request
{
  "name": "Priya Kumar",
  "email": "priya@example.com",
  "password": "Secret@123",
  "phone": "9876543210"
}

// Response 201
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": { "id": 1, "name": "Priya Kumar", "email": "priya@example.com", "role": "user" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### `POST /api/auth/login`
```json
// Request
{ "email": "priya@example.com", "password": "Secret@123" }

// Response 200
{ "success": true, "data": { "user": {...}, "token": "eyJ..." } }
```

#### `GET /api/auth/me`
```
Authorization: Bearer <token>
```

#### `PUT /api/auth/me`
```json
// Request (Authorization: Bearer <token>)
{ "name": "Priya K", "phone": "9876543211" }
```

---

### 📅 Bookings — `/api/bookings`
> All routes require `Authorization: Bearer <token>`

#### `POST /api/bookings`
```json
{
  "service_id": 1,
  "address": "123 Main Street, Apartment 4B",
  "area": "Koramangala",
  "city": "Bangalore",
  "scheduled_date": "2026-10-15T10:00:00.000Z",
  "duration_hours": 3,
  "notes": "Please bring eco-friendly supplies"
}
// Response 201 — booking object with total_price auto-calculated (₹199 × 3 = ₹597)
```

#### `GET /api/bookings`
```
GET /api/bookings?status=pending&page=1&limit=10
```

#### `GET /api/bookings/:id`
Returns booking with user, service, and helper details.

#### `PUT /api/bookings/:id/cancel`
Cancels a booking (only `pending` or `confirmed` can be cancelled by the owner).

---

### 🧹 Services — `/api/services`

#### `GET /api/services`
Returns all 6 active RENZA services with pricing.

---

### 👷 Helpers — `/api/helpers`

#### `GET /api/helpers`
```
GET /api/helpers?area=Koramangala&city=Bangalore&skill=House+Cleaning&page=1&limit=20
```

#### `GET /api/helpers/:id`
Returns a single active helper's public profile.

---

### 📬 Contact — `/api/contact`

#### `POST /api/contact`
```json
{
  "name": "Arun Sharma",
  "email": "arun@example.com",
  "phone": "9123456789",
  "message": "I want to know more about your services in Chennai."
}
```

---

### 🛡️ Admin — `/api/admin`
> All routes require `Authorization: Bearer <admin-token>`

#### `GET /api/admin/dashboard`
Returns aggregated stats: total users, helpers, bookings, revenue, recent bookings, new leads count.

#### `GET /api/admin/users`
```
GET /api/admin/users?search=priya&role=user&is_active=true&page=1&limit=20
```

#### `GET /api/admin/helpers`
```
GET /api/admin/helpers?status=pending&city=Bangalore
```

#### `POST /api/admin/helpers`
```json
{
  "name": "Suresh K",
  "phone": "9876543210",
  "email": "suresh@example.com",
  "skills": ["House Cleaning", "Kitchen Cleaning"],
  "area": "Indiranagar",
  "city": "Bangalore",
  "status": "active"
}
```

#### `PUT /api/admin/helpers/:id`
Partial update — any field from helper schema.

#### `DELETE /api/admin/helpers/:id`
Permanently removes helper.

#### `GET /api/admin/bookings`
```
GET /api/admin/bookings?status=pending&city=Bangalore&page=1&limit=20
```

#### `PUT /api/admin/bookings/:id`
```json
{
  "helper_id": 5,
  "status": "confirmed",
  "notes": "Helper confirmed for the slot"
}
```

#### `GET /api/admin/leads`
```
GET /api/admin/leads?status=new&page=1&limit=20
```

#### `PUT /api/admin/leads/:id`
```json
{ "status": "contacted" }
```

---

## Health Check

```
GET /health
```
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-09-26T13:36:00.000Z",
    "environment": "development",
    "database": "connected"
  }
}
```

---

## Security

- **Helmet** — Sets security-related HTTP headers
- **CORS** — Whitelist-based origin control via `ALLOWED_ORIGINS`
- **Rate Limiting** — 100 req/15min general; 20 req/15min on auth routes
- **JWT** — Signed with HS256, configurable expiry
- **bcrypt** — cost factor 12 for password hashing
- **Input Validation** — All inputs validated before DB queries
- **SQL Injection** — All queries use parameterized `$1, $2` placeholders

---

## Error Codes

| HTTP | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (no/invalid/expired token) |
| 403 | Forbidden (insufficient role) |
| 404 | Resource Not Found |
| 409 | Conflict (e.g., duplicate email) |
| 429 | Too Many Requests |
| 500 | Internal Server Error |
