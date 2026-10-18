create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  name text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'premium')),
  subscription_status text not null default 'none' check (subscription_status in ('none', 'active', 'canceled', 'past_due')),
  expires_at timestamptz,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null,
  preview_image text,
  component_key text not null,
  is_active boolean not null default true,
  is_premium boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  template_id uuid not null references public.templates (id),
  slug text not null unique,
  groom_name text not null,
  bride_name text not null,
  event_type text not null default 'wedding',
  event_date date not null,
  event_time time not null,
  venue_name text not null,
  address text not null,
  map_url text,
  cover_image text,
  music_url text,
  show_countdown boolean not null default true,
  show_rsvp boolean not null default true,
  show_messages boolean not null default true,
  show_gallery boolean not null default false,
  show_music boolean not null default false,
  published boolean not null default false,
  visits_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz
);

create table if not exists public.invitation_gallery (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations (id) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations (id) on delete cascade,
  guest_name text not null,
  attending boolean not null,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations (id) on delete cascade,
  guest_name text not null,
  message text not null,
  approved boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists invitations_user_id_idx on public.invitations (user_id);
create index if not exists invitations_slug_idx on public.invitations (slug);
create index if not exists rsvps_invitation_id_idx on public.rsvps (invitation_id);
create index if not exists messages_invitation_id_idx on public.messages (invitation_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists invitations_set_updated_at on public.invitations;
create trigger invitations_set_updated_at
before update on public.invitations
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.protect_profile_privileges()
returns trigger
language plpgsql
as $$
begin
  if new.role is distinct from old.role
     or new.plan is distinct from old.plan
     or new.subscription_status is distinct from old.subscription_status
     or new.expires_at is distinct from old.expires_at then
    if auth.role() <> 'service_role' then
      raise exception 'Not allowed to change billing or role fields';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_privileges on public.profiles;
create trigger profiles_protect_privileges
before update on public.profiles
for each row execute function public.protect_profile_privileges();

create or replace function public.touch_invitation_visit(p_slug text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$' then
    return;
  end if;
  update public.invitations
  set visits_count = visits_count + 1
  where slug = p_slug
    and published = true;
end;
$$;

revoke all on function public.touch_invitation_visit(text) from public;
grant execute on function public.touch_invitation_visit(text) to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.templates enable row level security;
alter table public.invitations enable row level security;
alter table public.invitation_gallery enable row level security;
alter table public.rsvps enable row level security;
alter table public.messages enable row level security;

create policy "profiles_select_own" on public.profiles
  for select to authenticated using (id = auth.uid());

create policy "profiles_update_own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "templates_public_read" on public.templates
  for select to anon, authenticated using (is_active = true);

create policy "invitations_public_read_published" on public.invitations
  for select to anon, authenticated using (published = true);

create policy "invitations_owner_read" on public.invitations
  for select to authenticated using (user_id = auth.uid());

create policy "invitations_owner_insert" on public.invitations
  for insert to authenticated with check (user_id = auth.uid());

create policy "invitations_owner_update" on public.invitations
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "invitations_owner_delete" on public.invitations
  for delete to authenticated using (user_id = auth.uid());

create policy "gallery_public_read" on public.invitation_gallery
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.invitations i
      where i.id = invitation_id and i.published = true
    )
  );

create policy "gallery_owner_all" on public.invitation_gallery
  for all to authenticated
  using (
    exists (
      select 1 from public.invitations i
      where i.id = invitation_id and i.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.invitations i
      where i.id = invitation_id and i.user_id = auth.uid()
    )
  );

create policy "rsvps_insert_public" on public.rsvps
  for insert to anon, authenticated
  with check (
    exists (
      select 1 from public.invitations i
      where i.id = invitation_id and i.published = true and i.show_rsvp = true
    )
  );

create policy "rsvps_owner_read" on public.rsvps
  for select to authenticated
  using (
    exists (
      select 1 from public.invitations i
      where i.id = invitation_id and i.user_id = auth.uid()
    )
  );

create policy "messages_public_read_approved" on public.messages
  for select to anon, authenticated
  using (
    approved = true
    and exists (
      select 1 from public.invitations i
      where i.id = invitation_id and i.published = true and i.show_messages = true
    )
  );

create policy "messages_owner_read" on public.messages
  for select to authenticated
  using (
    exists (
      select 1 from public.invitations i
      where i.id = invitation_id and i.user_id = auth.uid()
    )
  );

create policy "messages_insert_public" on public.messages
  for insert to anon, authenticated
  with check (
    char_length(message) between 2 and 500
    and char_length(guest_name) between 2 and 80
    and exists (
      select 1 from public.invitations i
      where i.id = invitation_id and i.published = true and i.show_messages = true
    )
  );

insert into public.templates (id, name, slug, category, component_key, is_active, is_premium)
values
  ('11111111-1111-4111-8111-111111111111', 'كلاسيك', 'classic', 'wedding', 'classic', true, false),
  ('22222222-2222-4222-8222-222222222222', 'لاكشري', 'luxury', 'wedding', 'luxury', true, false),
  ('33333333-3333-4333-8333-333333333333', 'رومانتيك', 'romantic', 'engagement', 'romantic', true, false),
  ('44444444-4444-4444-8444-444444444444', 'فلورال', 'floral', 'henna', 'floral', true, false),
  ('55555555-5555-4555-8555-555555555555', 'مينيمال', 'minimal', 'newborn', 'minimal', true, false),
  ('66666666-6666-4666-8666-666666666666', 'حديقة الإوز', 'swans', 'engagement', 'swans', true, true),
  ('77777777-7777-4777-8777-777777777777', 'قمر الليل', 'moonlight', 'wedding', 'moonlight', true, true),
  ('88888888-8888-4888-8888-888888888888', 'حديقة الذهب', 'gardenbloom', 'henna', 'gardenbloom', true, true),
  ('99999999-9999-4999-8999-999999999999', 'ورد الليل', 'nightrose', 'wedding', 'nightrose', true, true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'invitation-images',
    'invitation-images',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  ),
  (
    'invitation-music',
    'invitation-music',
    true,
    10485760,
    array['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/mp4']
  )
on conflict (id) do nothing;

create policy "images_public_read"
on storage.objects for select
to anon, authenticated
using (bucket_id in ('invitation-images', 'invitation-music'));

create policy "media_owner_insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id in ('invitation-images', 'invitation-music')
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "media_owner_update"
on storage.objects for update
to authenticated
using (
  bucket_id in ('invitation-images', 'invitation-music')
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id in ('invitation-images', 'invitation-music')
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "media_owner_delete"
on storage.objects for delete
to authenticated
using (
  bucket_id in ('invitation-images', 'invitation-music')
  and (storage.foldername(name))[1] = auth.uid()::text
);
