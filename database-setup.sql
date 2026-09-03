-- 🗄️ SUPABASE SETUP - Copy and paste ONLY ONE section at a time into SQL Editor

-- ============================================
-- STEP 1: Create users table
-- Just copy this, paste it, and click RUN
-- ============================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID NOT NULL,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
