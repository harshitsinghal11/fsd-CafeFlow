## Tech Stack
- Next.js 16.1.1 with App Router
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4
- Supabase JavaScript client
- Supabase PostgreSQL
- Zustand for cart state
- Vitest for unit tests
- Lucide React for icons
- Sonner for toast notifications
- React Hook Form & Zod for form validation

## Project Structure
- `app/`
  Contains route segments, layouts, pages, and API routes.
- `app/(auth)/`
  Contains the admin login page.
- `app/admin/`
  Contains the dashboard and analytics pages.
- `app/main/`
  Contains customer menu, checkout, and my orders pages.
- `src/actions/`
  Contains server actions for admin login, logout, order placement, order lookup, status updates, and admin data fetching (orders, analytics).
- `src/components/`
  Contains UI components split into `layout/`, `shared/`, `feature/menu/`, and `feature/admin/`.
- `src/hooks/data/`
  Contains SWR data fetching hooks.
- `src/store/`
  Contains the Zustand cart store.
- `src/types/`
  Contains shared TypeScript models.
- `src/lib/`
  Contains Supabase helpers, analytics logic, admin session utilities, and order filters.
- `assets/DATABASE.sql`
  Contains the database schema and RLS setup.
- `proxy.ts`
  Protects admin routes by validating the signed session cookie.

## System Architecture
The application uses a single Next.js codebase for frontend pages and backend data operations. Customer menu pages read menu data from Supabase. Customer write actions and admin data fetching are executed natively via Next.js Server Actions. Supabase stores menu and order data.

## Frontend Architecture
- The App Router handles page routing and layouts.
- The landing page and menu pages are rendered through route-based pages.
- Menu category pages are server components that query Supabase directly.
- Checkout, My Orders, admin dashboard, and analytics are client components.
- Shared layout components include `Navbar`, `Footer`, and `FloatingCart`.
- The cart is managed through a persisted Zustand store with a safe hydration hook (`useStore`).
- Forms are validated client-side with `react-hook-form` and `zod`.

## Backend Architecture
- Server Actions (`src/actions/orderActions.ts`, `lookupAction.ts`, and `src/actions/analyticsActions.ts`) handle data fetching and mutations, avoiding network overhead of traditional API routes.
- `src/utils/supabasePublicServer.ts`
  Creates the anon-key server client.
- `src/utils/supabaseAdmin.ts`
  Creates the service-role server client.

## Authentication & Authorization
- Customer flows are anonymous.
- Admin authentication uses a PIN checked in a server action.
- Successful admin login creates a signed `admin_session` cookie.
- `proxy.ts` redirects unauthenticated `/admin` requests to `/admin/login`.
- Admin API routes verify the same cookie before reading or updating admin data.
- Supabase RLS allows public menu reads and public order inserts, but not public order updates or deletes.

## API Design Standards
- All implemented APIs are same-origin Next.js route handlers.
- Input validation is handled via Zod schemas.
- Most data operations use Next.js Server Actions instead of API routes.
- Unauthorized admin access returns `401`.
- Implemented routes:
  - `GET /api/orders/lookup?phone=`
- API versioning
  Project not supported.

## State Management
- Cart state uses Zustand with persisted local storage.
- Checkout form, order lookup, admin order list, filter selection, and analytics use local React state.
- There is no global server-state library such as React Query.

## Caching Strategy
- Admin order and analytics requests use `cache: "no-store"` from the client.
- Order lookup also uses `cache: "no-store"`.
- Admin orders are refreshed every 5 seconds through polling.
- Menu pages fetch directly from Supabase during page render.
- Dedicated cache layer
  Project not supported.

## Security Considerations
- The admin session cookie is signed with HMAC SHA-256.
- The admin session cookie is `httpOnly`, `sameSite=lax`, and `secure` in production.
- The service role key is only used in server code.
- Customer input is validated before database operations.
- Admin routes are protected at both route level and API level.
- Supabase RLS restricts public access patterns on `menu_items` and `orders`.

## Performance Strategy
- Menu pages fetch only the items for the selected category.
- The cart is handled client-side without extra network calls.
- Admin data refresh uses lightweight polling instead of heavier real-time infrastructure.
- Weekly analytics are computed from a limited query of completed orders.
- Advanced performance tuning
  Project not supported.

## Logging & Monitoring
Project not supported.

## Deployment Strategy
- The project includes `dev`, `build`, `start`, `lint`, and `test` scripts.
- Environment variables are documented in `.env.example`.
- The database schema is applied manually through `assets/DATABASE.sql`.
- CI/CD pipeline, deployment config, and infrastructure-as-code
  Project not supported.
