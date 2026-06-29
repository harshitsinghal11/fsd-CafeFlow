-- =================================================================================
-- CafeFlow Database Schema
-- =================================================================================
-- This file defines the tables, enums, and indexes required for the CafeFlow
-- application based on the TypeScript models and application logic.
-- Use this file to initialize your PostgreSQL / Supabase database.
-- =================================================================================

-- ---------------------------------------------------------------------------------
-- 1. Custom Types / Enums
-- ---------------------------------------------------------------------------------
CREATE TYPE order_status_type AS ENUM (
  'pending',
  'preparing',
  'completed',
  'cancelled'
);

-- ---------------------------------------------------------------------------------
-- 2. Tables
-- ---------------------------------------------------------------------------------

-- Menu Items Table
-- Stores all available products for the cafe.
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,          -- e.g., 'Cold Coffee', 'Thick Shakes', 'Mocktails'
  price_s INTEGER NOT NULL CHECK (price_s > 0),      -- Standard/Small price
  price_l INTEGER CHECK (price_l IS NULL OR price_l > 0), -- Large price (optional)
  is_available BOOLEAN NOT NULL DEFAULT TRUE         -- To toggle item visibility
);

-- Orders Table
-- Stores all customer orders placed via the checkout flow.
-- Order items are stored as a JSONB array since they represent a snapshot of the 
-- cart at the time of purchase.
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  order_no BIGINT GENERATED ALWAYS AS IDENTITY (START WITH 100 INCREMENT BY 1) NOT NULL, -- Sequential Token ID
  customer_name TEXT NOT NULL CHECK (length(trim(customer_name)) > 0),
  customer_phone TEXT NOT NULL CHECK (customer_phone ~ '^[0-9]{10}$'), -- Strict 10-digit phone
  items JSONB NOT NULL CHECK (jsonb_typeof(items) = 'array'), -- Snapshot of OrderItem[]
  total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
  status order_status_type NOT NULL DEFAULT 'pending'
);

-- ---------------------------------------------------------------------------------
-- 3. Indexes for Performance
-- ---------------------------------------------------------------------------------

-- Speeds up category lookups on the menu page
CREATE INDEX idx_menu_items_category ON menu_items(category);

-- Speeds up availability filtering
CREATE INDEX idx_menu_items_available ON menu_items(is_available);

-- Ensures order numbers are unique and speeds up specific token lookups
CREATE UNIQUE INDEX idx_orders_order_no ON orders(order_no);

-- Speeds up fetching orders by phone number for the "My Orders" tracking page
CREATE INDEX idx_orders_customer_phone_date ON orders(customer_phone, created_at DESC);

-- Speeds up the admin dashboard (loading by status and date)
CREATE INDEX idx_orders_status_date ON orders(status, created_at DESC);

-- ---------------------------------------------------------------------------------
-- 4. RPC Function for Secure Order Lookup (Optional but recommended)
-- ---------------------------------------------------------------------------------
-- The application uses this function to safely fetch orders for a specific phone
-- number without exposing a direct SELECT operation to the public.
CREATE OR REPLACE FUNCTION get_orders_by_phone(phone_input text)
RETURNS SETOF orders
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT *
  FROM orders
  WHERE customer_phone = regexp_replace(coalesce(phone_input, ''), '\D', '', 'g')
  ORDER BY created_at DESC
  LIMIT 50;
$$;
