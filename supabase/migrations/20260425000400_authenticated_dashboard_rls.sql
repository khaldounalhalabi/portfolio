alter table public.projects enable row level security;
alter table public.skill_groups enable row level security;
alter table public.contact_info enable row level security;
alter table public.contact_links enable row level security;

drop policy if exists "Authenticated can insert projects" on public.projects;
create policy "Authenticated can insert projects"
on public.projects
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update projects" on public.projects;
create policy "Authenticated can update projects"
on public.projects
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete projects" on public.projects;
create policy "Authenticated can delete projects"
on public.projects
for delete
to authenticated
using (true);

drop policy if exists "Authenticated can insert skill groups" on public.skill_groups;
create policy "Authenticated can insert skill groups"
on public.skill_groups
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update skill groups" on public.skill_groups;
create policy "Authenticated can update skill groups"
on public.skill_groups
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete skill groups" on public.skill_groups;
create policy "Authenticated can delete skill groups"
on public.skill_groups
for delete
to authenticated
using (true);

drop policy if exists "Authenticated can insert contact info" on public.contact_info;
create policy "Authenticated can insert contact info"
on public.contact_info
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update contact info" on public.contact_info;
create policy "Authenticated can update contact info"
on public.contact_info
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete contact info" on public.contact_info;
create policy "Authenticated can delete contact info"
on public.contact_info
for delete
to authenticated
using (true);

drop policy if exists "Authenticated can insert contact links" on public.contact_links;
create policy "Authenticated can insert contact links"
on public.contact_links
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update contact links" on public.contact_links;
create policy "Authenticated can update contact links"
on public.contact_links
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete contact links" on public.contact_links;
create policy "Authenticated can delete contact links"
on public.contact_links
for delete
to authenticated
using (true);

drop policy if exists "Authenticated can upload portfolio images" on storage.objects;
create policy "Authenticated can upload portfolio images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'portfolio-images');

drop policy if exists "Authenticated can update portfolio images" on storage.objects;
create policy "Authenticated can update portfolio images"
on storage.objects
for update
to authenticated
using (bucket_id = 'portfolio-images')
with check (bucket_id = 'portfolio-images');

drop policy if exists "Authenticated can delete portfolio images" on storage.objects;
create policy "Authenticated can delete portfolio images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'portfolio-images');
