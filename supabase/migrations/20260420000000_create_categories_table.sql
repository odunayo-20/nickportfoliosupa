CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE
);

-- RLS Policies
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.categories
    FOR SELECT
    USING (true);

CREATE POLICY "Enable all access for authenticated users" ON public.categories
    FOR ALL
    USING (auth.role() = 'authenticated');
