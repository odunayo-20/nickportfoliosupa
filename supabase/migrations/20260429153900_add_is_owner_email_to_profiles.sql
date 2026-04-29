-- Add is_owner column to identify the portfolio owner's profile
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_owner BOOLEAN DEFAULT false;

-- Add email column so it can be displayed publicly without auth
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS email TEXT;

-- If there is exactly one profile, mark it as the owner
UPDATE public.profiles SET is_owner = true
WHERE id = (SELECT id FROM public.profiles LIMIT 1)
  AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE is_owner = true);
