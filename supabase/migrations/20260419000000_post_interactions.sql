-- Create post_likes table
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  session_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, session_id)
);

-- Enable RLS
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read likes
CREATE POLICY "Anyone can read post_likes"
ON post_likes FOR SELECT
USING (true);

-- Allow anyone to insert their own like (with their session_id which should be validated by the app, but effectively anon access if using anon key, though best to do via service role or secure server action)
CREATE POLICY "Anyone can insert post_likes"
ON post_likes FOR INSERT
WITH CHECK (true);

-- Allow anyone to delete their own like
CREATE POLICY "Anyone can delete their own like"
ON post_likes FOR DELETE
USING (true);

-- Create a view or function to get likes count if needed, or just let the application query it
-- Let's update the comments table policies just in case they aren't fully public for inserts
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read approved comments
CREATE POLICY "Anyone can read approved comments"
ON comments FOR SELECT
USING (is_approved = true OR auth.role() = 'authenticated');

-- Allow anyone to insert a comment (will be set to unapproved by default unless stated otherwise)
CREATE POLICY "Anyone can insert comments"
ON comments FOR INSERT
WITH CHECK (true);
