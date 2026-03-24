-- CafeFlow Database Schema
-- Target: PostgreSQL (Supabase)

-- Required for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1) Status enum
DO $$
BEGIN
  CREATE TYPE public.order_status_type AS ENUM (
    'pending',
    'preparing',
    'completed',
    'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2) Menu table
CREATE TABLE IF NOT EXISTS public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  name text NOT NULL,
  category text NOT NULL,
  price_s integer NOT NULL CHECK (price_s > 0),
  price_l integer CHECK (price_l IS NULL OR price_l > 0),
  is_available boolean NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_menu_items_category ON public.menu_items (category);
CREATE INDEX IF NOT EXISTS idx_menu_items_is_available ON public.menu_items (is_available);

-- 3) Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  order_no bigint GENERATED ALWAYS AS IDENTITY (START WITH 100 INCREMENT BY 1) NOT NULL,
  customer_name text NOT NULL CHECK (length(trim(customer_name)) > 0),
  customer_phone text NOT NULL CHECK (customer_phone ~ '^[0-9]{10}$'),
  items jsonb NOT NULL CHECK (jsonb_typeof(items) = 'array'),
  total_amount integer NOT NULL CHECK (total_amount >= 0),
  status public.order_status_type NOT NULL DEFAULT 'pending'
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_order_no ON public.orders (order_no);
CREATE INDEX IF NOT EXISTS idx_orders_status_created_at ON public.orders (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone_created_at ON public.orders (customer_phone, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);

-- 4) Public lookup function for "My Orders"
-- Uses SECURITY DEFINER to avoid exposing direct table SELECT to anonymous users.
CREATE OR REPLACE FUNCTION public.get_orders_by_phone(phone_input text)
RETURNS SETOF public.orders
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM public.orders
  WHERE customer_phone = regexp_replace(coalesce(phone_input, ''), '\D', '', 'g')
  ORDER BY created_at DESC
  LIMIT 50;
$$;

REVOKE ALL ON FUNCTION public.get_orders_by_phone(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_orders_by_phone(text) TO anon, authenticated;

-- 5) RLS hardening
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS menu_items_public_read ON public.menu_items;
CREATE POLICY menu_items_public_read
  ON public.menu_items
  FOR SELECT
  TO anon, authenticated
  USING (is_available = true);

DROP POLICY IF EXISTS orders_public_insert ON public.orders;
CREATE POLICY orders_public_insert
  ON public.orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND customer_phone ~ '^[0-9]{10}$'
    AND length(trim(customer_name)) > 0
    AND total_amount >= 0
    AND jsonb_typeof(items) = 'array'
  );

-- No anonymous UPDATE / DELETE / direct SELECT policy on orders.
-- Admin operations are expected through backend APIs using SUPABASE_SERVICE_ROLE_KEY.

-- 6) Optional one-time command for existing deployments:
-- If your orders table already exists and order_no started below 100, run:
-- ALTER TABLE public.orders ALTER COLUMN order_no RESTART WITH 100;
