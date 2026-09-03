-- 🗄️ Supabase Database Setup SQL (Step by Step)
-- Run each section separately (COPY & PASTE ONE SECTION AT A TIME, then click RUN)

-- ============================================
-- STEP 1: Create profiles table
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  total_orders integer DEFAULT 0,
  total_amount numeric DEFAULT 0
);

-- ============================================
-- STEP 2: Create orders table
-- (RUN THIS AFTER STEP 1 SUCCEEDS)
-- ============================================
-- CREATE TABLE IF NOT EXISTS public.orders (
--   id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
--   user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
--   order_id text NOT NULL,
--   order_time text NOT NULL,
--   buyer_name text NOT NULL,
--   product_title text NOT NULL,
--   amount numeric NOT NULL,
--   status text DEFAULT 'pending',
--   created_at timestamp with time zone DEFAULT now(),
--   updated_at timestamp with time zone DEFAULT now()
-- );

-- ============================================
-- STEP 3: Enable Row Level Security
-- (RUN THIS AFTER STEP 2 SUCCEEDS)
-- ============================================
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 4: Create RLS policies for profiles
-- (RUN THIS AFTER STEP 3 SUCCEEDS)
-- ============================================
-- CREATE POLICY "Users can view their own profile" ON public.profiles
--   FOR SELECT
--   USING (auth.uid() = id);
--
-- CREATE POLICY "Users can update their own profile" ON public.profiles
--   FOR UPDATE
--   USING (auth.uid() = id);
--
-- CREATE POLICY "Users can insert their own profile" ON public.profiles
--   FOR INSERT
--   WITH CHECK (auth.uid() = id);

-- ============================================
-- STEP 5: Create RLS policies for orders
-- (RUN THIS AFTER STEP 4 SUCCEEDS)
-- ============================================
-- CREATE POLICY "Users can view their own orders" ON public.orders
--   FOR SELECT
--   USING (auth.uid() = user_id);
--
-- CREATE POLICY "Users can insert their own orders" ON public.orders
--   FOR INSERT
--   WITH CHECK (auth.uid() = user_id);
--
-- CREATE POLICY "Users can update their own orders" ON public.orders
--   FOR UPDATE
--   USING (auth.uid() = user_id);

-- ============================================
-- STEP 6: Create indexes
-- (RUN THIS AFTER STEP 5 SUCCEEDS)
-- ============================================
-- CREATE INDEX idx_profiles_username ON public.profiles(username);
-- CREATE INDEX idx_orders_user_id ON public.orders(user_id);
-- CREATE INDEX idx_orders_created_at ON public.orders(created_at);
