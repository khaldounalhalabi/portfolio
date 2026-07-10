create table visits (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  session_id text not null,
  referrer text,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table visits enable row level security;

-- Public portfolio visitors can record page views.
create policy "visits_insert_public" on visits
  for insert to anon, authenticated
  with check (true);

-- Authenticated dashboard users can read visit stats.
create policy "visits_select_authenticated" on visits
  for select to authenticated
  using (true);

create index idx_visits_created_at on visits(created_at desc);
create index idx_visits_path on visits(path);
create index idx_visits_session_id on visits(session_id);
