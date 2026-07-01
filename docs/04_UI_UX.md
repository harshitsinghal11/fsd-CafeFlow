## Design Principles
- Keep the customer flow short and direct.
- Use a warm cafe visual style built around brown, cream, and accent orange colors.
- Make the primary actions clear on every page.
- Use card-based layouts for menu, cart, and admin order views.
- Keep admin status changes visible and easy to scan.

## Brand Guidelines
- Brand name used in the UI: `CafeFlow`
- Visual theme: cafe-inspired, warm, and casual
- Tone of interface copy: direct and simple
- Formal brand system document
  Project not supported.

## Color System
- Primary brown: `#653100`
- Accent orange: `#DA944B`
- Dark brown background: `#26160C`
- Global page background: `#f8f8f8`
- Neutral gray surfaces and borders are used throughout via Tailwind gray classes.
- Status colors:
  - Pending: yellow
  - Preparing: blue
  - Completed: green
  - Cancelled/Error: red

## Typography
- The project uses the default Next.js and Tailwind font stack.
- Headings commonly use `font-bold`, `font-extrabold`, or `font-black`.
- Supporting text uses smaller gray text for helper content.
- Custom typography system
  Project not supported.

## Spacing & Layout
- The app uses centered containers such as `max-w-md`, `max-w-4xl`, `max-w-5xl`, `max-w-6xl`, and `max-w-7xl`.
- Top padding is added on content pages to account for the absolute top navbar.
- Cards use large rounded corners such as `rounded-xl`, `rounded-2xl`, `rounded-3xl`, and `rounded-[30px]`.
- Menu and dashboard pages use responsive grid layouts.
- The checkout form uses a two-column layout on medium screens and above.

## Design Tokens
- A centralized token file or CSS variable system is not implemented.
- Reused visual values appear inline in Tailwind utility classes.
- Reused values include:
  - Brand brown: `#653100`
  - Accent orange: `#DA944B`
  - Dark brown: `#26160C`
  - Surface background: `#f8f8f8`
  - Large card radii and soft shadows

## Component Library
- `Navbar`
- `Footer`
- `MenuCategoryCard`
- `MenuItemCard`
- `FloatingCart`
- `cartTimer`
- `ActiveOrderCard`
- `OrderHistoryTable`
- `OrderFilter`
- Formal design-system package
  Project not supported.

## Page Inventory
- Home page
- Cold Coffee page
- Thick Shakes page
- Mocktails page
- Checkout page
- My Orders page
- Admin Login page
- Admin Dashboard page
- Admin Analytics page

## Page Specifications
- Home page
  Shows hero copy and category cards.
- Menu pages
  Show category title, back button, and menu item cards.
- Checkout page
  Shows cart summary, timer, customer form, and success token state.
- My Orders page
  Shows phone lookup form, inline errors, and order cards.
- Admin Login page
  Shows PIN form and invalid PIN feedback.
- Admin Dashboard page
  Shows active order cards, history filter buttons, and history table.
- Admin Analytics page
  Shows weekly totals and day-by-day breakdown.

## Responsive Design Rules
- Category cards stack on small screens and expand to multiple columns on wider screens.
- Menu item grids move from one column to up to four columns.
- Checkout switches from single-column to two-column layout at medium screen size.
- Admin active orders move from one column to two and three columns on larger screens.
- Navigation actions stay accessible with fixed top placement and mobile-friendly icon buttons.

## Loading States
- Admin dashboard shows an animated `DashboardSkeleton` while fetching orders.
- Admin analytics shows an animated `AnalyticsSkeleton` while loading stats.
- Checkout submit button changes to `Placing Order...` while the order is being created.
- My Orders button shows a spinner icon while fetching.

## Empty States
- Menu pages can show `No coffees found.` when no items exist.
- Checkout shows `Your cart is empty.` when there are no cart items.
- My Orders shows `No orders found for this number.` when lookup returns no data.
- Admin dashboard shows `No active orders.` when active orders are empty.
- Admin history table shows `No history available yet.` when there is no history data.

## Error States
- Admin login displays invalid PIN feedback from the query string.
- My Orders shows an inline red error box for lookup failures.
- Checkout uses inline validation text (via `react-hook-form`) and Sonner Toast notifications for failed order placement.
- Admin pages use Sonner Toast notifications for failed fetch or status updates.
- Dedicated error page system
  Project not supported.

## Accessibility Guidelines
- Forms use standard inputs, buttons, and labels.
- Required fields and phone patterns are strictly enforced.
- Status uses both text and color to communicate state.
- Icon-only buttons (like Trash, Back, Logout) use descriptive `aria-label` attributes for screen readers.
