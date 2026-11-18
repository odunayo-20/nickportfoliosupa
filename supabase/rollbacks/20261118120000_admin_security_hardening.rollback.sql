-- Restores the policies exactly as they were before 20261118120000_admin_security_hardening.sql
-- (captured from pg_policies on 2026-11-18). Run only if the hardening breaks something.
-- The new media columns, the lower-case whitelist data and is_admin() are left in place (harmless).

begin;

alter table public.allowed_users drop constraint if exists allowed_users_email_lowercase;

drop policy if exists "Admins manage posts" on public.posts;
create policy "Enable all for authenticated users" on public.posts for all using (auth.role() = 'authenticated');

drop policy if exists "Admins manage projects" on public.projects;
create policy "Enable insert for authenticated users only" on public.projects for insert with check (auth.role() = 'authenticated');
create policy "Enable update for authenticated users only" on public.projects for update using (auth.role() = 'authenticated');
create policy "Enable delete for authenticated users only" on public.projects for delete using (auth.role() = 'authenticated');

drop policy if exists "Admins manage settings" on public.settings;
create policy "Admin full access settings" on public.settings for all using (auth.role() = 'authenticated');
create policy "Enable all for authenticated users" on public.settings for all to authenticated using (true) with check (true);

drop policy if exists "Admins manage site_settings" on public.site_settings;
create policy "Admins can do everything on site_settings" on public.site_settings for all to authenticated using (true) with check (true);

drop policy if exists "Admins manage categories" on public.categories;
create policy "Enable all access for authenticated users" on public.categories for all using (auth.role() = 'authenticated');

drop policy if exists "Admins manage folders" on public.folders;
create policy "Enable insert for authenticated users only" on public.folders for insert with check (auth.role() = 'authenticated');
create policy "Enable update for authenticated users only" on public.folders for update using (auth.role() = 'authenticated');
create policy "Enable delete for authenticated users only" on public.folders for delete using (auth.role() = 'authenticated');

drop policy if exists "Admins manage media" on public.media;
create policy "Enable insert for authenticated users only" on public.media for insert with check (auth.role() = 'authenticated');
create policy "Enable update for authenticated users only" on public.media for update using (auth.role() = 'authenticated');
create policy "Enable delete for authenticated users only" on public.media for delete using (auth.role() = 'authenticated');

drop policy if exists "Admins manage own profile" on public.profiles;
create policy "Allow owners to update profiles" on public.profiles for all using (auth.uid() = id);

drop policy if exists "Public reads approved comments" on public.comments;
drop policy if exists "Guests create unapproved comments" on public.comments;
drop policy if exists "Admins update comments" on public.comments;
drop policy if exists "Admins delete comments" on public.comments;
create policy "Allow public read comments" on public.comments for select using (true);
create policy "Allow guest create comments" on public.comments for insert with check (true);
create policy "Admins can update comments" on public.comments for update using (auth.role() = 'authenticated');
create policy "Admins can delete comments" on public.comments for delete using (auth.role() = 'authenticated');
grant select on public.comments to anon;

drop policy if exists "Admins manage newsletter_subscribers" on public.newsletter_subscribers;
create policy "Admin full access newsletter_subscribers" on public.newsletter_subscribers for all using (auth.role() = 'authenticated');
create policy "Allow public subscribe" on public.newsletter_subscribers for insert with check (true);
create policy "Allow public unsubscribe" on public.newsletter_subscribers for update using (true) with check (status = 'unsubscribed');

drop policy if exists "Admins manage newsletter_campaigns" on public.newsletter_campaigns;
create policy "Admin full access newsletter_campaigns" on public.newsletter_campaigns for all using (auth.role() = 'authenticated');
create policy "Admins can manage newsletter campaigns" on public.newsletter_campaigns for all
  using (exists (select 1 from public.allowed_users where allowed_users.email = (auth.jwt() ->> 'email')));

drop policy if exists "Admins read page_visits" on public.page_visits;
create policy "Allow tracking inserts" on public.page_visits for insert with check (true);
create policy "Admin read page_visits" on public.page_visits for select using (auth.role() = 'authenticated');

drop policy if exists "Admins read gdpr_consents" on public.gdpr_consents;
create policy "anon_insert_consent" on public.gdpr_consents for insert to anon with check (true);
create policy "anon_update_own_consent" on public.gdpr_consents for update to anon using (true) with check (true);
create policy "auth_read_consents" on public.gdpr_consents for select to authenticated using (true);

create policy "Anyone can insert post_likes" on public.post_likes for insert with check (true);

drop policy if exists "Admins upload media" on storage.objects;
drop policy if exists "Admins update media" on storage.objects;
drop policy if exists "Admins delete media" on storage.objects;
create policy "Authenticated users can upload" on storage.objects for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "Authenticated users can update" on storage.objects for update using (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "Authenticated users can delete" on storage.objects for delete using (bucket_id = 'media' and auth.role() = 'authenticated');

update storage.buckets set file_size_limit = null, allowed_mime_types = null where id = 'media';

grant execute on function public.get_unique_visitors_count() to public, anon, authenticated;
grant execute on function public.rls_auto_enable() to public, anon, authenticated;
alter function public.get_unique_visitors_count() reset search_path;
alter function public.handle_updated_at() reset search_path;
alter function public.set_gdpr_updated_at() reset search_path;
-- (the four new indexes are left in place: harmless)

commit;
