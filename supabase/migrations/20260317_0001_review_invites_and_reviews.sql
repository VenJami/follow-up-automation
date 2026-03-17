-- Phase 1: review funnel tables (UI wired, backend next)

create table if not exists public.review_invites (
  token text primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text null,
  consent boolean not null default false,
  status text not null default 'started' check (status in ('started', 'completed')),
  selected_platform text null check (selected_platform in ('google', 'facebook', 'internal', 'video')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz null
);

create index if not exists review_invites_email_idx on public.review_invites (email);
create index if not exists review_invites_status_idx on public.review_invites (status);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  invite_token text not null references public.review_invites(token) on delete cascade,
  rating int not null check (rating >= 1 and rating <= 5),
  body text not null,
  image_url text null,
  created_at timestamptz not null default now()
);

create index if not exists reviews_invite_token_idx on public.reviews (invite_token);
create index if not exists reviews_created_at_idx on public.reviews (created_at desc);

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_review_invites_updated_at on public.review_invites;
create trigger set_review_invites_updated_at
before update on public.review_invites
for each row execute function public.set_updated_at();

-- RLS can be enabled later once we decide anon/public access patterns.
-- For now, server actions will use the service role key.

