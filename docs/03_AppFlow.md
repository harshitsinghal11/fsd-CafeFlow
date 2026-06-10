## Application Overview
CafeFlow has two main application areas: a customer ordering flow and an admin kitchen flow. Customers browse menu items, place an order, receive a token number, and later check status by phone number. Admin users log in with a PIN, manage active orders, and review weekly completed-order analytics.

## Navigation Structure
- `/`
  Home page with category cards.
- `/main/menu/cold-coffee`
  Cold coffee items.
- `/main/menu/thick-shakes`
  Thick shake items.
- `/main/menu/mocktails`
  Mocktail items.
- `/main/checkout`
  Cart review and order placement.
- `/main/my-orders`
  Phone-based order lookup.
- `/admin/login`
  Admin login page.
- `/admin`
  Admin order dashboard.
- `/admin/analytics`
  Weekly sales report page.

## Authentication Flow
- Customers do not sign in.
- Admin enters the PIN on `/admin/login`.
- The server action checks the configured PIN.
- On success, the server sets the signed `admin_session` cookie and redirects to `/admin`.
- `proxy.ts` checks the cookie on every admin route except the login page.
- Admin APIs check the same cookie before returning data.
- Logout deletes the cookie and redirects back to `/admin/login`.

## Role Based Flows
- Guest Customer Flow
  Browse categories, add menu items to cart, open checkout, submit name and phone number, receive token number, and later track orders by phone number.
- Admin Staff Flow
  Log in with PIN, review active orders, move status from `pending` to `preparing` to `completed`, cancel orders when needed, review order history, and open analytics.
- Additional roles
  Project not supported.

## Feature Workflows
- Menu Browsing
  Home page links to a category page, and the category page reads matching menu items from Supabase.
- Add to Cart
  Customer selects size and item, and the Zustand store adds or increments the item.
- Checkout
  Customer reviews cart, enters name and phone number, and submits to `POST /api/orders/place`.
- Order Confirmation
  The API inserts the order and returns `order_no`, and the checkout page shows the token confirmation view.
- My Orders
  Customer enters a phone number, and the page calls `GET /api/orders/lookup`.
- Admin Order Management
  Admin dashboard loads all orders from `GET /api/admin/orders`, splits active and history views, and updates status through `PATCH /api/admin/orders`.
- Admin Analytics
  Analytics page calls `GET /api/admin/analytics` and renders week totals with daily breakdown.

## Data Flow
- `menu_items` data flows from Supabase to server-rendered menu pages.
- Cart data flows from user actions into the Zustand store and local storage.
- Checkout form data flows from the browser to `POST /api/orders/place`, then to the `orders` table.
- Order lookup data flows from the browser to `GET /api/orders/lookup`, then from the RPC function or fallback query back to the browser.
- Admin dashboard data flows from the browser to protected admin APIs, then from the service-role Supabase client back to the browser.
- Analytics data flows from completed `orders` rows through `calculateWeeklyStats` before rendering.

## Error Handling Flow
- Invalid checkout name or phone number is blocked before submission and again in the API.
- Invalid lookup phone number returns a `400` response and shows an inline error message.
- Failed order placement shows an alert on the checkout page.
- Unauthorized admin API calls return `401`, and the admin UI redirects to the login page.
- Missing or invalid admin PIN returns `/admin/login?error=Invalid PIN`.
- Cart expiry clears the cart, shows an alert, and sends the user back to the home page.

## Edge Cases
- Empty cart at checkout.
- Cart expiry after 10 minutes.
- Invalid phone number input.
- Blank customer name.
- No menu items returned for a category.
- No orders found for a phone number.
- No active orders in the admin dashboard.
- RPC function unavailable during order lookup, with fallback to direct query.
- Missing environment variables causing server-side failures.

## User Journey Maps
- Customer Journey
  Home -> Category page -> Add items -> Checkout -> Token confirmation -> My Orders lookup.
- Admin Journey
  Admin login -> Admin dashboard -> Update order status -> Review history -> Open analytics.
