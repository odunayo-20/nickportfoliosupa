-- Add manual ordering to public.projects (additive only, existing rows untouched).
-- Lower values appear first; ties fall back to newest created_at in the app queries.
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS projects_display_order_idx ON public.projects (display_order);
