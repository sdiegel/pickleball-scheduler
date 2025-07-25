-- Users (Supabase Auth already stores basic auth info; we extend with profile)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  display_name text not null,
  skill_tier text,
  profile_visibility text default 'public',
  email text,
  phone text,
  created_at timestamptz default now()
);

-- Locations
create table public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  geo_json jsonb,
  is_private boolean default true
);

-- Matches
create type public.match_status as enum ('open','full','confirmed','closed');
create type public.match_format as enum ('singles','doubles');

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  host_id uuid references public.users on delete cascade,
  location_id uuid references public.locations,
  start_dt timestamptz not null,
  duration_min int not null,
  format match_format not null,
  capacity int not null,
  join_mode text default 'instant',
  visibility text default 'invite',
  skill_min numeric,
  skill_max numeric,
  waitlist_max int default 4,
  notes text,
  status match_status default 'open',
  created_at timestamptz default now()
);

-- Participants
create table public.participants (
  match_id uuid references public.matches on delete cascade,
  user_id uuid references public.users on delete cascade,
  role text default 'player',
  joined_at timestamptz default now(),
  primary key (match_id, user_id)
);

-- Requests / Wait-list
create type public.request_status as enum ('pending','waitlist','accepted','rejected');

create table public.requests (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references public.matches on delete cascade,
  user_id uuid references public.users on delete cascade,
  status request_status default 'pending',
  msg text,
  ts timestamptz default now()
);

-- Comments
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references public.matches on delete cascade,
  user_id uuid references public.users on delete cascade,
  text text not null,
  ts timestamptz default now()
);

-- Row-Level Security: enable and open read to authenticated users
alter table public.users enable row level security;
alter table public.locations enable row level security;
alter table public.matches enable row level security;
alter table public.participants enable row level security;
alter table public.requests enable row level security;
alter table public.comments enable row level security;

-- Example RLS (tweak later):
create policy "Users can view all locations" on public.locations
  for select using ( true );
