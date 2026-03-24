# CafeFlow

CafeFlow is a full-stack cafe ordering system built with Next.js and Supabase.
It supports guest ordering, token-based fulfillment, order tracking by phone, and a protected admin panel.

## Features

### Customer Flow

- Browse categories:
  - Cold Coffee
  - Thick Shakes
  - Mocktails
- Add items to persisted cart (Zustand)
- 10-minute cart expiry timer
- Checkout with:
  - customer name
  - 10-digit phone number
- Receive generated token (`order_no`)
- Track order history by phone number

### Admin Flow

- PIN-based admin login
- Signed admin session cookie
- Route protection via `proxy.ts`
- Backend-protected admin APIs:
  - `GET/PATCH /api/admin/orders`
  - `GET /api/admin/analytics`
- Customer APIs (same-origin):
  - `POST /api/orders/place`
  - `GET /api/orders/lookup?phone=XXXXXXXXXX`
- Order workflow:
  - `pending -> preparing -> completed`
  - cancellation support
- History filters (`all`, `completed`, `cancelled`)
- Weekly analytics cards + daily breakdown

## Security Model

- Admin session cookie is signed (HMAC) and verified in `proxy.ts`.
- Admin data and status updates are performed through server routes protected by cookie verification.
- Supabase schema includes:
  - RLS enabled
  - restricted public insert policy for orders
  - no direct anonymous update/delete on orders
  - controlled RPC for phone-based order lookup (`get_orders_by_phone`)

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase (PostgreSQL)
- Zustand
- Vitest (unit tests)

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_SECRET_PIN=your_admin_pin
ADMIN_SESSION_SECRET=long_random_secret_for_cookie_signing
```

Legacy fallback supported:

```env
ADMIN_PIN=your_admin_pin
```

Notes:

- `SUPABASE_SERVICE_ROLE_KEY` must never be exposed to client code.
- `ADMIN_SESSION_SECRET` should be different from the admin PIN.
- You can copy from [`.env.example`](./.env.example).

## Setup

1. Install packages:

```bash
npm install
```

2. Apply database schema:

- Open Supabase SQL Editor
- Run [`assets/DATABASE.sql`](./assets/DATABASE.sql)

3. Seed `menu_items` with your menu data.

4. Start dev server:

```bash
npm run dev
```

## Commands

- Lint: `npm run lint`
- Test: `npm run test`
- Build: `npm run build`
- Start production: `npm run start`

## Routes

- `/` Home
- `/main/menu/cold-coffee`
- `/main/menu/thick-shakes`
- `/main/menu/mocktails`
- `/main/checkout`
- `/main/my-orders`
- `/admin/login`
- `/admin`
- `/admin/analytics`

## Troubleshooting

- `net::ERR_NAME_NOT_RESOLVED` in browser:
  - Customer pages now call local API routes, so this should no longer appear for Supabase RPC URLs.
  - If an order request still fails, verify:
    - `NEXT_PUBLIC_SUPABASE_URL` is correct (`https://<project-ref>.supabase.co`)
    - internet/DNS access can resolve the Supabase host
- `Multiple GoTrueClient instances detected` warning:
  - Removed by avoiding browser-side Supabase clients in customer flows.

## Project Structure

```text
cafeflow/
|-- app/
|   |-- api/
|   |-- admin/
|   `-- main/
|-- src/
|   |-- component/
|   |-- store/
|   |-- types/
|   `-- utils/
|-- assets/
|   `-- DATABASE.sql
|-- proxy.ts
`-- README.md
```

## Testing Coverage (Current)

- Admin session token generation/verification
- Order status filtering and active/history separation
- Weekly analytics aggregation logic
