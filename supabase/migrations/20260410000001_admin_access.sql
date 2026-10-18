create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.protect_profile_privileges()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'UPDATE'
     and lower(coalesce(old.email, '')) = 'imontaser6@gmail.com'
     and (new.role is distinct from 'admin' or new.plan is distinct from 'premium') then
    raise exception 'Cannot demote the site owner';
  end if;

  if new.role is distinct from old.role
     or new.plan is distinct from old.plan
     or new.subscription_status is distinct from old.subscription_status
     or new.expires_at is distinct from old.expires_at then
    if auth.role() <> 'service_role' and not public.is_admin() then
      raise exception 'Not allowed to change billing or role fields';
    end if;
  end if;
  return new;
end;
$$;

drop policy if exists "admin_read_profiles" on public.profiles;
create policy "admin_read_profiles" on public.profiles
  for select to authenticated using (public.is_admin());

drop policy if exists "admin_update_profiles" on public.profiles;
create policy "admin_update_profiles" on public.profiles
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin_all_templates" on public.templates;
create policy "admin_all_templates" on public.templates
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin_all_invitations" on public.invitations;
create policy "admin_all_invitations" on public.invitations
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin_all_gallery" on public.invitation_gallery;
create policy "admin_all_gallery" on public.invitation_gallery
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin_all_rsvps" on public.rsvps;
create policy "admin_all_rsvps" on public.rsvps
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin_all_messages" on public.messages;
create policy "admin_all_messages" on public.messages
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

update public.profiles
set role = 'admin',
    plan = 'premium',
    subscription_status = 'active'
where lower(email) = 'imontaser6@gmail.com';

update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'admin')
where lower(email) = 'imontaser6@gmail.com';
