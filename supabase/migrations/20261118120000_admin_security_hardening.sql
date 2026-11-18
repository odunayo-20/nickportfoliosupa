-- =====================================================================================
-- Admin security hardening
--
-- Before: every write policy checked only auth.role() = 'authenticated', so ANY signed-in
-- account (e.g. one created directly against Supabase Auth with the public key) could edit
-- posts, projects, settings, media, comments, subscribers and the storage bucket.
--
-- After: writes require public.is_admin() = the signed-in user's email is on allowed_users
-- AND confirmed. Public reads the site needs are unchanged, except:
--   * comments: the public sees only approved comments, and never author_email
--   * newsletter_subscribers / gdpr_consents / post_likes writes: server-side only (service role)
--
-- Rollback: supabase/rollbacks/20261118120000_admin_security_hardening.rollback.sql
-- =====================================================================================

begin;

-- ---------------------------------------------------------------------------
-- 1. is_admin()
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from auth.users u
    join public.allowed_users a on lower(a.email) = lower(u.email)
    where u.id = auth.uid()
      and u.email_confirmed_at is not null
  );
$$;

comment on function public.is_admin() is
  'True when the current user is a confirmed account whose email is in allowed_users. Used by RLS.';

-- Whitelist emails are compared case-insensitively; store them lower-case.
update public.allowed_users set email = lower(trim(email)) where email <> lower(trim(email));
alter table public.allowed_users drop constraint if exists allowed_users_email_lowercase;
alter table public.allowed_users add constraint allowed_users_email_lowercase check (email = lower(email));

-- ---------------------------------------------------------------------------
-- 2. Content tables: public read stays, writes = admin only
--    (posts/projects keep "read all": the admin list reads through the cached anon client.)
-- ---------------------------------------------------------------------------
drop policy if exists "Enable all for authenticated users" on public.posts;
create policy "Admins manage posts" on public.posts
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "Enable insert for authenticated users only" on public.projects;
drop policy if exists "Enable update for authenticated users only" on public.projects;
drop policy if exists "Enable delete for authenticated users only" on public.projects;
create policy "Admins manage projects" on public.projects
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "Admin full access settings" on public.settings;
drop policy if exists "Enable all for authenticated users" on public.settings;
create policy "Admins manage settings" on public.settings
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "Admins can do everything on site_settings" on public.site_settings;
create policy "Admins manage site_settings" on public.site_settings
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "Enable all access for authenticated users" on public.categories;
create policy "Admins manage categories" on public.categories
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "Enable insert for authenticated users only" on public.folders;
drop policy if exists "Enable update for authenticated users only" on public.folders;
drop policy if exists "Enable delete for authenticated users only" on public.folders;
create policy "Admins manage folders" on public.folders
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "Enable insert for authenticated users only" on public.media;
drop policy if exists "Enable update for authenticated users only" on public.media;
drop policy if exists "Enable delete for authenticated users only" on public.media;
create policy "Admins manage media" on public.media
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Optional image metadata (alt text for accessibility/SEO, dimensions for layout).
alter table public.media add column if not exists width integer;
alter table public.media add column if not exists height integer;
alter table public.media add column if not exists alt_text text;

-- Profiles: only an admin can write, and only their own row.
drop policy if exists "Allow owners to update profiles" on public.profiles;
create policy "Admins manage own profile" on public.profiles
  for all to authenticated
  using (auth.uid() = id and (select public.is_admin()))
  with check (auth.uid() = id and (select public.is_admin()));

-- ---------------------------------------------------------------------------
-- 3. Comments: public sees approved only, never author_email; guests can't self-approve
-- ---------------------------------------------------------------------------
drop policy if exists "Allow public read comments" on public.comments;
drop policy if exists "Allow guest create comments" on public.comments;
drop policy if exists "Admins can update comments" on public.comments;
drop policy if exists "Admins can delete comments" on public.comments;

create policy "Public reads approved comments" on public.comments
  for select using (is_approved = true or (select public.is_admin()));
create policy "Guests create unapproved comments" on public.comments
  for insert to anon, authenticated with check (coalesce(is_approved, false) = false or (select public.is_admin()));
create policy "Admins update comments" on public.comments
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins delete comments" on public.comments
  for delete to authenticated using ((select public.is_admin()));

-- Column-level: the anon role can read every column except author_email.
revoke select on public.comments from anon;
grant select (id, created_at, post_id, project_id, parent_id, author_name, content, is_approved)
  on public.comments to anon;

-- ---------------------------------------------------------------------------
-- 4. Newsletter: subscribe/unsubscribe go through server actions (service role) only
-- ---------------------------------------------------------------------------
drop policy if exists "Admin full access newsletter_subscribers" on public.newsletter_subscribers;
drop policy if exists "Allow public subscribe" on public.newsletter_subscribers;
drop policy if exists "Allow public unsubscribe" on public.newsletter_subscribers;
create policy "Admins manage newsletter_subscribers" on public.newsletter_subscribers
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "Admin full access newsletter_campaigns" on public.newsletter_campaigns;
drop policy if exists "Admins can manage newsletter campaigns" on public.newsletter_campaigns;
create policy "Admins manage newsletter_campaigns" on public.newsletter_campaigns
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- 5. Tracking, consent, likes: written server-side only
-- ---------------------------------------------------------------------------
drop policy if exists "Allow tracking inserts" on public.page_visits;   -- /api/track-visit uses the service role
drop policy if exists "Admin read page_visits" on public.page_visits;
create policy "Admins read page_visits" on public.page_visits
  for select to authenticated using ((select public.is_admin()));

drop policy if exists "anon_insert_consent" on public.gdpr_consents;       -- logConsent upserts via service role
drop policy if exists "anon_update_own_consent" on public.gdpr_consents;   -- was USING (true): anyone could rewrite any record
drop policy if exists "auth_read_consents" on public.gdpr_consents;
create policy "Admins read gdpr_consents" on public.gdpr_consents
  for select to authenticated using ((select public.is_admin()));

drop policy if exists "Anyone can insert post_likes" on public.post_likes; -- like/unlike go through server actions
-- "Anyone can read post_likes" stays (like counts).

-- ---------------------------------------------------------------------------
-- 6. Storage bucket "media": admin-only writes, size + type limits
-- ---------------------------------------------------------------------------
drop policy if exists "Authenticated users can upload" on storage.objects;
drop policy if exists "Authenticated users can update" on storage.objects;
drop policy if exists "Authenticated users can delete" on storage.objects;

create policy "Admins upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and (select public.is_admin()));
create policy "Admins update media" on storage.objects
  for update to authenticated using (bucket_id = 'media' and (select public.is_admin()))
  with check (bucket_id = 'media' and (select public.is_admin()));
create policy "Admins delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and (select public.is_admin()));
-- "Public Read Access" (bucket_id = 'media') stays.

update storage.buckets
set file_size_limit = 209715200, -- 200 MB (videos); images are capped at 20 MB in the upload UI
    allowed_mime_types = array[
      'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/svg+xml',
      'video/mp4', 'video/webm', 'video/quicktime',
      'application/pdf'
    ]
where id = 'media';

-- ---------------------------------------------------------------------------
-- 7. Functions + indexes flagged by the Supabase advisors
-- ---------------------------------------------------------------------------
-- Visitor count is only used by /admin/analytics (signed-in client): not callable by the public.
revoke execute on function public.get_unique_visitors_count() from public, anon;
grant execute on function public.get_unique_visitors_count() to authenticated;
alter function public.get_unique_visitors_count() set search_path = '';
-- Event-trigger function; never meant to be called over the API.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
-- Trigger functions: pin search_path (lint 0011).
alter function public.handle_updated_at() set search_path = '';
alter function public.set_gdpr_updated_at() set search_path = '';

-- Foreign keys used in lookups/joins without an index (lint 0001).
create index if not exists comments_post_id_idx on public.comments (post_id);
create index if not exists comments_project_id_idx on public.comments (project_id);
create index if not exists comments_parent_id_idx on public.comments (parent_id);
create index if not exists media_folder_id_idx on public.media (folder_id);

commit;
