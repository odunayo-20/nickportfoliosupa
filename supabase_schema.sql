-- Create folders table for media library
CREATE TABLE IF NOT EXISTS public.folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    name TEXT NOT NULL,
    parent_id UUID REFERENCES public.folders(id) ON DELETE CASCADE
);

-- Create media table
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- image, video, file, etc.
    size BIGINT NOT NULL,
    url TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL,
    hash TEXT
);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    content TEXT,
    category TEXT,
    tech_stack TEXT[] DEFAULT '{}',
    github_url TEXT,
    live_url TEXT,
    app_store_url TEXT,
    play_store_url TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    is_featured BOOLEAN DEFAULT false,
    featured_image_id UUID REFERENCES public.media(id) ON DELETE SET NULL,
    media_ids UUID[] DEFAULT '{}'
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    name TEXT,
    title TEXT,
    bio TEXT,
    skills TEXT[] DEFAULT '{}',
    social_links JSONB DEFAULT '{}'::jsonb
);

-- Create posts table (blog)
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT,
    content TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
    category TEXT DEFAULT 'General',
    tags TEXT[] DEFAULT '{}',
    published_at TIMESTAMPTZ,
    featured_image_id UUID REFERENCES public.media(id) ON DELETE SET NULL,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    author_name TEXT,
    author_email TEXT,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT true, -- default to true for guest comments if needed
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE
);

-- Create RLS policies
-- Enable RLS
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read folders" ON public.folders FOR SELECT USING (true);
CREATE POLICY "Allow public read media" ON public.media FOR SELECT USING (true);
CREATE POLICY "Allow public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public read posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Allow public read comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Allow public read profiles" ON public.profiles FOR SELECT USING (true);

-- Admin write access (explicit policies for clarity and robustness)
CREATE POLICY "Enable insert for authenticated users only" ON public.folders FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.folders FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.folders FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users only" ON public.media FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.media FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.media FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users only" ON public.projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.projects FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users" ON public.posts FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow owners to update profiles" ON public.profiles FOR ALL USING (auth.uid() = id);

-- Guest comment creation
CREATE POLICY "Allow guest create comments" ON public.comments FOR INSERT WITH CHECK (true);

-- ==========================================
-- STORAGE BUCKET CONFIGURATION
-- ==========================================

-- 1. Create the "media" storage bucket (Public)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies

-- Allow public access to view and download files
CREATE POLICY "Public Read Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'media' );

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'media' AND auth.role() = 'authenticated' );

-- Allow authenticated users to update their files
CREATE POLICY "Authenticated users can update" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'media' AND auth.role() = 'authenticated' );

-- Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'media' AND auth.role() = 'authenticated' );
