-- Supabase schema for Blog page
-- Run this in Supabase SQL editor to create the expected tables and RLS policies.

create table if not exists posts (
  id text primary key default gen_random_uuid(),
  caption text not null,
  tags text[] not null default array[]::text[],
  created_at timestamptz not null default now()
);

create table if not exists post_media (
  id text primary key default gen_random_uuid(),
  post_id text not null references posts(id) on delete cascade,
  src text not null,
  name text not null,
  kind text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

alter table if exists public.posts enable row level security;
drop policy if exists "Allow anon select posts" on public.posts;
create policy "Allow anon select posts" on public.posts for select using (true);
drop policy if exists "Allow anon insert posts" on public.posts;
create policy "Allow anon insert posts" on public.posts for insert with check (auth.role() = 'anon');
drop policy if exists "Allow anon update posts" on public.posts;
create policy "Allow anon update posts" on public.posts for update using (auth.role() = 'anon') with check (auth.role() = 'anon');
drop policy if exists "Allow anon delete posts" on public.posts;
create policy "Allow anon delete posts" on public.posts for delete using (auth.role() = 'anon');

alter table if exists public.post_media enable row level security;
drop policy if exists "Allow anon select post_media" on public.post_media;
create policy "Allow anon select post_media" on public.post_media for select using (true);
drop policy if exists "Allow anon insert post_media" on public.post_media;
create policy "Allow anon insert post_media" on public.post_media for insert with check (auth.role() = 'anon');
drop policy if exists "Allow anon update post_media" on public.post_media;
create policy "Allow anon update post_media" on public.post_media for update using (auth.role() = 'anon') with check (auth.role() = 'anon');
drop policy if exists "Allow anon delete post_media" on public.post_media;
create policy "Allow anon delete post_media" on public.post_media for delete using (auth.role() = 'anon');

create index if not exists idx_post_media_post_id on post_media(post_id);
create index if not exists idx_posts_created_at on posts(created_at desc);
