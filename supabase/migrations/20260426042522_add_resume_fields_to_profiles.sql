ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS resume_url text,
ADD COLUMN IF NOT EXISTS resume_name text;
