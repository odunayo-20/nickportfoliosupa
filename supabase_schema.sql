-- ==========================================
-- MEDIA & FOLDERS
-- ==========================================

-- Create folders table for media library
CREATE TABLE IF NOT EXISTS public.folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
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

-- ==========================================
-- PORTFOLIO CONTENT
-- ==========================================

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
    featured_image UUID REFERENCES public.media(id) ON DELETE SET NULL,
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
    avatar_url TEXT,
    resume_url TEXT,
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
    is_approved BOOLEAN DEFAULT true,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE
);

-- ==========================================
-- ADMIN & UTILITIES
-- ==========================================

-- Create messages table for inquiries
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false
);

-- Create allowed_users table (Whitelist)
CREATE TABLE IF NOT EXISTS public.allowed_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    site_title TEXT,
    site_description TEXT,
    logo TEXT,
    seo JSONB DEFAULT '{}'::jsonb
);

-- ==========================================
-- RLS POLICIES
-- ==========================================

-- Enable RLS
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allowed_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read folders" ON public.folders FOR SELECT USING (true);
CREATE POLICY "Allow public read media" ON public.media FOR SELECT USING (true);
CREATE POLICY "Allow public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public read posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Allow public read comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Allow public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read settings" ON public.settings FOR SELECT USING (true);

-- Admin write access
CREATE POLICY "Admin full access folders" ON public.folders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access media" ON public.media FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access projects" ON public.projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access posts" ON public.posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access profiles" ON public.profiles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access settings" ON public.settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access allowed_users" ON public.allowed_users FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read delete messages" ON public.messages FOR SELECT OR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin update messages" ON public.messages FOR UPDATE USING (auth.role() = 'authenticated');

-- Guest actions
CREATE POLICY "Allow guest create messages" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow guest create comments" ON public.comments FOR INSERT WITH CHECK (true);

-- ==========================================
-- STORAGE BUCKET CONFIGURATION
-- ==========================================

-- 1. Create the "media" storage bucket (Public)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies
CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT USING ( bucket_id = 'media' );
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'media' AND auth.role() = 'authenticated' );
CREATE POLICY "Authenticated Update" ON storage.objects FOR UPDATE USING ( bucket_id = 'media' AND auth.role() = 'authenticated' );
CREATE POLICY "Authenticated Delete" ON storage.objects FOR DELETE USING ( bucket_id = 'media' AND auth.role() = 'authenticated' );
