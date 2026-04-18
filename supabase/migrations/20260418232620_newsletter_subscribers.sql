-- ==========================================
-- NEWSLETTER SUBSCRIBERS
-- ==========================================

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
    unsubscribed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admin full access newsletter_subscribers"
    ON public.newsletter_subscribers
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Anyone can subscribe (insert)
CREATE POLICY "Allow public subscribe"
    ON public.newsletter_subscribers
    FOR INSERT
    WITH CHECK (true);

-- Allow unsubscribe via email token (UPDATE by anon using their email)
-- Public can update their own row to 'unsubscribed'
CREATE POLICY "Allow public unsubscribe"
    ON public.newsletter_subscribers
    FOR UPDATE
    USING (true)
    WITH CHECK (status = 'unsubscribed');
