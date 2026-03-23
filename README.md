# Cafeflow ☕
**Digital Order-to-Cup Management System**

Cafeflow is a full-stack real-time coffee shop ordering system built with **Next.js 15 (App Router)** and **Supabase**.
It connects customers and kitchen staff through a seamless, token-based workflow without requiring user accounts.

The system eliminates manual token handling, reduces queue friction, and provides a live operational dashboard.

---

## Project Objective

Traditional coffee shop ordering systems suffer from:

* Long queues
* Manual token management
* No real-time kitchen visibility
* Unnecessary login friction

Cafeflow provides:

* Guest ordering (no signup required)
* Auto-generated token system (starting from #100)
* Real-time kitchen dashboard
* Order tracking via phone number
* Sales analytics for administrators

---

## Tech Stack

Frontend

* Next.js 15 (App Router)
* TypeScript
* Tailwind CSS
* Lucide React Icons

State Management

* Zustand (with LocalStorage persistence)

Backend & Database

* Supabase (PostgreSQL)
* Supabase Realtime Channels

Authentication

* Custom Admin PIN (Cookie-based session)
* Middleware route protection

---

## Folder Structure

```
cafeflow/
│
├── app/                # App Router pages
├── src/                # Utilities, store, logic
├── public/             # Static assets
├── assets/             # Documentation & SQL schema
│   ├── Cafeflow_Documentation.pdf
│   └── DATABASE.sql
│
├── middleware.ts       # Admin route protection
├── .env.local          # Environment variables (ignored)
└── README.md
```

---

## Core Features

### Digital Menu

* Categorized coffee and beverage display
* Add-to-cart functionality
* Floating cart interface

### Smart Cart Expiry

* 10-minute reservation timer
* Automatic cart reset on expiry
* Prevents inventory blocking

### Guest Checkout

* No authentication required
* Requires:

  * Customer Name
  * 10-digit phone number
* Generates auto-incremented order number (starting from 100)

### Real-Time Kitchen Dashboard

Kanban-style interface:

* Pending (Yellow)
* Preparing (Blue)
* Completed (Green)
* Cancelled (Red)

Features:

* Live order updates via Supabase Realtime
* Optimistic UI updates
* Order filtering & history view

### Order Tracking

Customers can:

* Enter phone number
* View order status
* Access past order history

### Sales Analytics

Admin dashboard includes:

* Weekly revenue
* Daily breakdown (Mon–Sun)
* Today's performance highlight
* Server-side aggregation

---

## Database Overview

Primary Table: `orders`

Key Fields:

* order_no (auto-increment starting from 100)
* customer_name
* customer_phone (validated 10 digits)
* items (JSONB)
* total_amount
* status (enum)
* created_at

Status Enum:

* pending
* preparing
* completed
* cancelled

Full SQL schema available in:

```
assets/DATABASE.sql
```

---

## Security & Validation

* `/admin` protected via `middleware.ts`
* PIN-based authentication
* Cookie session management
* Regex validation for phone numbers
* Required field validation during checkout
* 24-hour admin session expiry

---

## Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
ADMIN_SECRET_PIN=your_secure_pin
```

Legacy fallback supported in code: `ADMIN_PIN`

Do not commit `.env.local` to GitHub.

---

## Getting Started

Install dependencies:

```
npm install
```

Run development server:

```
npm run dev
```

Open:

```
http://localhost:3000
```

Admin dashboard:

```
http://localhost:3000/admin
```

Build for production:

```
npm run build
npm start
```

---

## Usage Rules

* Cart expires after 10 minutes
* Phone number must be exactly 10 digits
* Admin session auto-expires after 24 hours
* Order history retained for analytics

---

## Deployment

Recommended:

* Vercel (Frontend)
* Supabase (Database & Realtime)

---

## Future Improvements

* Payment gateway integration
* SMS notifications
* Inventory tracking
* Multi-branch support
* Role-based staff management

---

## License

This project is built for educational and portfolio purposes.

---
