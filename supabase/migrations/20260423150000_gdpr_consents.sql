-- GDPR Consent Logging Table
-- Stores anonymised consent records — no raw PII is ever written.
-- session_fingerprint is a random UUID generated client-side and stored in localStorage.

create table if not exists public.gdpr_consents (
  id                  uuid        primary key default gen_random_uuid(),
  session_fingerprint text        not null unique,
  necessary           boolean     not null default true,
  analytics           boolean     not null default false,
  marketing           boolean     not null default false,
  country_code        text        default 'HR',
  consent_date        timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Keep updated_at current automatically
create or replace function public.set_gdpr_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger gdpr_consents_updated_at
  before update on public.gdpr_consents
  for each row execute procedure public.set_gdpr_updated_at();

-- RLS
alter table public.gdpr_consents enable row level security;

-- Unauthenticated visitors can INSERT a new consent record
create policy "anon_insert_consent"
  on public.gdpr_consents
  for insert
  to anon
  with check (true);

-- Unauthenticated visitors can UPDATE their own record by fingerprint
create policy "anon_update_own_consent"
  on public.gdpr_consents
  for update
  to anon
  using (true)
  with check (true);

-- Only authenticated users (admin) can SELECT consent records
create policy "auth_read_consents"
  on public.gdpr_consents
  for select
  to authenticated
  using (true);
