## Database Overview
The project uses Supabase PostgreSQL. The implemented schema includes one enum type, two tables, one SQL function, and row-level security policies.

## ER Diagram
```text
menu_items
  id
  name
  category
  price_s
  price_l
  is_available

orders
  id
  order_no
  customer_name
  customer_phone
  items (jsonb snapshot)
  total_amount
  status

Relationship:
orders.items stores menu item snapshots in JSONB.
No foreign key relationship is defined between orders and menu_items.
```

## Tables
- `public.menu_items`
  - `id uuid primary key`
  - `created_at timestamptz`
  - `name text`
  - `category text`
  - `price_s integer`
  - `price_l integer nullable`
  - `is_available boolean`
- `public.orders`
  - `id uuid primary key`
  - `created_at timestamptz`
  - `order_no bigint generated identity`
  - `customer_name text`
  - `customer_phone text`
  - `items jsonb`
  - `total_amount integer`
  - `status order_status_type`

## Relationships
- There are no foreign key relationships in the implemented schema.
- Order line items are stored inside `orders.items` as JSONB snapshots.

## Constraints
- `price_s > 0`
- `price_l IS NULL OR price_l > 0`
- `customer_name` must not be blank after trim
- `customer_phone` must match `^[0-9]{10}$`
- `items` must be a JSON array
- `total_amount >= 0`
- `status` must be one of the enum values

## Indexes
- `idx_menu_items_category`
- `idx_menu_items_is_available`
- `idx_orders_order_no`
- `idx_orders_status_created_at`
- `idx_orders_customer_phone_created_at`
- `idx_orders_created_at`

## RLS Policies
- `menu_items_public_read`
  Allows `anon` and `authenticated` users to select available menu items.
- `orders_public_insert`
  Allows `anon` and `authenticated` users to insert valid pending orders.
- Public order update, delete, and direct select policies on `orders`
  Project not supported.

## Triggers
Project not supported.

## Functions
- `public.get_orders_by_phone(phone_input text)`
  - Returns matching orders ordered by newest first.
  - Uses `SECURITY DEFINER`.
  - Normalizes non-digit characters from the input.
  - Limited to 50 rows.

## Storage Structure
Project not supported.

## API Models
- `OrderStatus`
  - `pending`
  - `preparing`
  - `completed`
  - `cancelled`
- `OrderItem`
  - `id`
  - `name`
  - `size`
  - `price`
  - `quantity`
- `Order`
  - `id`
  - `created_at`
  - `order_no`
  - `customer_name`
  - `customer_phone`
  - `items`
  - `total_amount`
  - `status`
- `MenuItem`
  - `id`
  - `created_at`
  - `name`
  - `category`
  - `price_s`
  - `price_l`
  - `is_available`

## Audit Strategy
- The current implementation updates order status in place.
- There is no audit log table, trigger-based history, or change trail.
- Dedicated audit strategy
  Project not supported.
