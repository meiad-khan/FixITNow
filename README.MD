# 🛠️ FixItNow Backend API

A RESTful Backend API for a **Home Service Marketplace** where customers can book home services, technicians can manage bookings, and admins can manage the platform.

---

## 🚀 Live API

**Backend API:**  
https://fix-it-now-dusky.vercel.app

---

## 📂 GitHub Repository

https://github.com/meiad-khan/FixITNow.git

---

## 📬 Postman Documentation / Collection

https://documenter.getpostman.com/view/55201413/2sBY4TqHrS

---

# 📖 Project Overview

FixItNow is a Home Service Marketplace Backend API developed using **Node.js**, **Express.js**, **TypeScript**, **PostgreSQL**, and **Prisma ORM**.

The system supports three different user roles:

- Customer
- Technician
- Admin

Customers can book services and make online payments, technicians can manage bookings, and admins can manage the entire platform.

---

# 🛠️ Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- SSLCommerz Payment Gateway
- Vercel

---

# ✨ Features

## Authentication

- User Registration
- User Login
- JWT Authentication
- Role-based Authorization

---

## User Roles

### Customer

- Browse Services
- Create Booking
- Cancel Booking
- Make Payment
- Submit Review

### Technician

- Create Technician Profile
- Update Profile
- Accept Booking
- Decline Booking
- Start Service
- Complete Service

### Admin

- Manage Categories
- Manage Services

---

## Category

- Create Category
- Get Categories
- Update Category
- Delete Category

---

## Service

- Create Service
- Get All Services
- Get Single Service
- Update Service
- Delete Service

### Supported Query Features

- Search
- Filtering
- Sorting
- Pagination

---

## Technician Profile

- Create Profile
- Update Profile
- Get All Technicians
- Get Single Technician

### Supported Query Features

- Search
- Filtering
- Sorting
- Pagination

---

## Booking

- Create Booking
- Get Booking
- Update Booking Status
- Cancel Booking

### Booking Status Flow

```text
REQUESTED
    ↓
ACCEPTED
    ↓
PAID
    ↓
IN_PROGRESS
    ↓
COMPLETED
```

Customers can cancel a booking before it reaches **IN_PROGRESS**.

---

## Payment

Integrated with **SSLCommerz Sandbox**.

Features:

- Payment Initialization
- Payment Validation
- Payment Success
- Payment Failure
- Payment Cancellation

---

## Review

- One Review per Booking
- Rating
- Review Text

Customers can review only after the booking is completed.

---

# 📁 Project Structure

```text
src
│
├── config
├── errors
├── lib
├── middlewares
├── modules
│   ├── auth
│   ├── booking
│   ├── category
│   ├── payment
│   ├── review
│   ├── service
│   ├── technicianProfile
│   └── user
│
└── utils
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/meiad-khan/FixITNow.git
```

Go to project directory

```bash
cd fixitnow-backend
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
DATABASE_URL=

PORT=3000

APP_URL=http://localhost:3000

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

BCRYPT_SALT_ROUNDS=10

SSL_COMMERZ_STORE_ID=
SSL_COMMERZ_STORE_PASSWD=
```

Generate Prisma Client

```bash
npx prisma generate
```

Run Development Server

```bash
npm run dev
```

Build Project

```bash
npm run build
```

Run Production

```bash
npm start
```

---
## Seed Database

Run:

```bash
npx prisma db seed

# 📌 Main API Modules

- Authentication
- User
- Technician Profile
- Category
- Service
- Booking
- Payment
- Review

---

# 👨‍💻 Developed By

**Md. Meiad Khan**

Software Engineering Student

---

# 📄 License

This project was developed for academic and learning purposes.