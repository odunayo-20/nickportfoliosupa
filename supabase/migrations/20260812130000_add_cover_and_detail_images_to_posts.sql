-- Add cover_image_id and detail_image_id columns to public.posts table
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS cover_image_id UUID REFERENCES public.media(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS detail_image_id UUID REFERENCES public.media(id) ON DELETE SET NULL;
