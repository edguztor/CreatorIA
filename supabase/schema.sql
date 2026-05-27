-- PostGenius Database Schema
-- Run this in Supabase SQL Editor: https://app.supabase.com -> SQL Editor

-- ============================================================
-- PROFILES TABLE
-- Extends auth.users with app-specific data
-- ============================================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro')),
  posts_used_this_month INTEGER NOT NULL DEFAULT 0,
  posts_limit INTEGER NOT NULL DEFAULT 5,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- GENERATED_POSTS TABLE
-- Stores all AI-generated posts per user
-- ============================================================
CREATE TABLE public.generated_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  input_text TEXT NOT NULL,
  platform TEXT NOT NULL,
  generated_content TEXT NOT NULL,
  tone TEXT NOT NULL,
  language TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_generated_posts_user_id ON public.generated_posts(user_id);
CREATE INDEX idx_generated_posts_created_at ON public.generated_posts(created_at DESC);
CREATE INDEX idx_profiles_stripe_customer ON public.profiles(stripe_customer_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Users can only access their own data
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_posts ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Generated posts: users can read/delete their own posts
CREATE POLICY "Users can view own posts"
  ON public.generated_posts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON public.generated_posts FOR DELETE
  USING (auth.uid() = user_id);

-- Service role (used by API routes) bypasses RLS automatically

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- Trigger fires whenever a new user is created in auth.users
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, plan, posts_limit)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    'free',
    5
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- MONTHLY USAGE RESET FUNCTION
-- Call this from a Supabase Edge Function cron job on the 1st of each month
-- ============================================================
CREATE OR REPLACE FUNCTION public.reset_monthly_usage()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET posts_used_this_month = 0
  WHERE TRUE;
END;
$$;
