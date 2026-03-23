CREATE TABLE public.menu_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  name text NOT NULL,
  category text NOT NULL,
  price_s integer NOT NULL,
  price_l integer,
  is_available boolean DEFAULT true,
  CONSTRAINT menu_items_pkey PRIMARY KEY (id)
);

CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  order_no bigint GENERATED ALWAYS AS IDENTITY (START WITH 100 INCREMENT BY 1) NOT NULL,
  customer_name text NOT NULL,
  items jsonb NOT NULL,
  total_amount integer NOT NULL,
  status USER-DEFINED DEFAULT 'pending'::order_status_type,
  customer_phone text NOT NULL,
  CONSTRAINT orders_pkey PRIMARY KEY (id)
);

-- If the orders table already exists in your database, run this once:
-- ALTER TABLE public.orders ALTER COLUMN order_no RESTART WITH 100;
