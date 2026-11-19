drop function if exists public.visits_by_country(timestamptz);
drop index if exists public.page_visits_country_idx;
alter table public.page_visits drop column if exists city;
alter table public.page_visits drop column if exists country;
