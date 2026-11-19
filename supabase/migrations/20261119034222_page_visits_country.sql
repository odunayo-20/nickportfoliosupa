-- Visitor geography for /admin/analytics.
-- Filled by /api/track-visit from the hosting platform's geo headers (Vercel: x-vercel-ip-country,
-- x-vercel-ip-city). No third-party IP lookup. Additive only: existing rows keep NULL.
alter table public.page_visits add column if not exists country text;  -- ISO 3166-1 alpha-2, e.g. 'HR'
alter table public.page_visits add column if not exists city text;

create index if not exists page_visits_country_idx on public.page_visits (country) where country is not null;

-- Aggregate for the analytics map/list. SECURITY INVOKER: page_visits RLS still decides who can
-- read (admins only). Aggregating in SQL avoids PostgREST's 1000-row cap skewing the numbers.
create or replace function public.visits_by_country(since timestamptz default null)
returns table (country text, visits bigint, visitors bigint)
language sql
stable
security invoker
set search_path = ''
as $$
  select v.country, count(*)::bigint as visits, count(distinct v.visitor_id)::bigint as visitors
  from public.page_visits v
  where v.country is not null
    and (since is null or v.visited_at >= since)
  group by v.country
  order by visits desc;
$$;

revoke execute on function public.visits_by_country(timestamptz) from public, anon;
grant execute on function public.visits_by_country(timestamptz) to authenticated;
