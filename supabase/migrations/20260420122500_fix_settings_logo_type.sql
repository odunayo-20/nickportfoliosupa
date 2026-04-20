-- Fix: settings.logo was typed as UUID when it should store a URL (TEXT).
-- If any rows have a UUID value in logo, resolve it to the media URL first.

DO $$
BEGIN
    -- Only run if logo column exists and is uuid type
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name   = 'settings'
          AND column_name  = 'logo'
          AND data_type    = 'uuid'
    ) THEN
        -- Step 1: Add a temporary TEXT column to hold the resolved URL
        ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS logo_url_tmp TEXT;

        -- Step 2: For any row whose logo UUID resolves to a media item, copy the URL
        UPDATE public.settings s
        SET    logo_url_tmp = m.url
        FROM   public.media m
        WHERE  s.logo::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
          AND  m.id = s.logo;

        -- Step 3: Drop the old UUID-typed logo column
        ALTER TABLE public.settings DROP COLUMN logo;

        -- Step 4: Rename tmp column to logo
        ALTER TABLE public.settings RENAME COLUMN logo_url_tmp TO logo;

    END IF;
END $$;

-- Ensure og_image_url is TEXT (safety net in case it was also UUID)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name   = 'settings'
          AND column_name  = 'og_image_url'
          AND data_type    = 'uuid'
    ) THEN
        ALTER TABLE public.settings
            ALTER COLUMN og_image_url TYPE TEXT
            USING og_image_url::TEXT;
    END IF;
END $$;

-- Make sure logo and og_image_url exist as TEXT columns (idempotent)
ALTER TABLE public.settings
    ADD COLUMN IF NOT EXISTS logo        TEXT,
    ADD COLUMN IF NOT EXISTS og_image_url TEXT DEFAULT '';
