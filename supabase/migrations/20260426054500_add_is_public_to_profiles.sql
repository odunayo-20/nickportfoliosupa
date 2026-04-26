ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- Update existing profiles to be public by default
UPDATE public.profiles SET is_public = true WHERE is_public IS NULL;
