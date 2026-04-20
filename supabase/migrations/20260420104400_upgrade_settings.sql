-- Alter existing settings table to include more premium configuration
ALTER TABLE public.settings 
ADD COLUMN IF NOT EXISTS site_tagline TEXT DEFAULT 'Design-led software engineering',
ADD COLUMN IF NOT EXISTS portfolio_url TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS meta_description TEXT DEFAULT 'High-performance software solutions and modern UI architecture.',
ADD COLUMN IF NOT EXISTS keywords TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS og_image_url TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS theme_mode TEXT DEFAULT 'light',
ADD COLUMN IF NOT EXISTS accent_color TEXT DEFAULT 'indigo-600',
ADD COLUMN IF NOT EXISTS notifications JSONB DEFAULT '{
    "email_inquiries": true,
    "blog_comments": false,
    "analytics_digest": true
}'::jsonB,
ADD COLUMN IF NOT EXISTS security JSONB DEFAULT '{
    "two_factor": true,
    "ip_whitelist": false
}'::jsonB;

-- Ensure RLS is enabled
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Policy for public read already exists from schema dump, let's verify/ensure
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'settings' AND policyname = 'Allow public read settings'
    ) THEN
        CREATE POLICY "Allow public read settings" ON public.settings FOR SELECT USING (true);
    END IF;
END $$;

-- Policy for admin access already exists, let's ensure it's broad
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'settings' AND policyname = 'Admin full access settings'
    ) THEN
        CREATE POLICY "Admin full access settings" ON public.settings FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Insert a default row if the table is empty
INSERT INTO public.settings (id, site_title)
SELECT '00000000-0000-0000-0000-000000000000', 'Architect Portfolio'
WHERE NOT EXISTS (SELECT 1 FROM public.settings);
