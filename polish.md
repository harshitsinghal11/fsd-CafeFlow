# CafeFlow: Continued Polish & Refactoring Plan 🛠️

Based on the latest deep analysis of the project, we have successfully modernized the core features. However, there are significant opportunities for architectural simplification and SEO/stability improvements.

---

## 🚀 Phase 4: DRY Refactoring & Architecture Optimization

### 1. Dynamic Routing for Menu Categories (Code Duplication)
- **The Issue**: The `app/main/menu/` directory currently contains three nearly identical, hardcoded folders (`cold-coffee`, `mocktails`, `thick-shakes`). If the cafe adds a new category (e.g. "Hot Coffee"), a developer has to copy-paste an entire folder. This violates the DRY (Don't Repeat Yourself) principle.
- **The Fix**: Delete the hardcoded folders and replace them with a single dynamic route: `app/main/menu/[category]/page.tsx`. This allows the application to scale infinitely based purely on the database categories, without needing new code for new categories.

### 2. Complete the Server Action Migration
- **The Issue**: While admin data fetching was migrated to Server Actions, the customer order lookup still relies on a traditional API route (`app/api/orders/lookup/route.ts`).
- **The Fix**: Convert the lookup logic into a Server Action (`lookupOrderAction`) and refactor `MyOrdersPage` to use it. This will allow us to **delete the entire `app/api` directory**, making the project 100% RPC/Server-Action based, reducing network overhead.

---

## 🛡️ Phase 5: Stability, SEO, & UX

### 1. React Error Boundaries
- **The Issue**: The application lacks a global `error.tsx` file. If a database query fails or a server component throws an exception, the user is presented with a raw, ugly Next.js 500 internal server error page.
- **The Fix**: Implement a root `error.tsx` component to catch unexpected failures gracefully, offering the user a friendly apology and a "Try Again" or "Go Home" button.

### 2. Metadata and SEO
- **The Issue**: The application's root `layout.tsx` is missing basic SEO metadata (Title, Description, OpenGraph tags). This hurts search engine indexing and makes link-sharing on WhatsApp or social media look generic.
- **The Fix**: Export a standard `Metadata` object from `layout.tsx` to properly brand the application across the web.
