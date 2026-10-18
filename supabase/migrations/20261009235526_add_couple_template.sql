insert into public.templates (id, name, slug, category, component_key, is_active, is_premium)
values (
  'a3a3a3a3-a3a3-43a3-83a3-a3a3a3a3a3a3',
  'كابل',
  'couple',
  'wedding',
  'couple',
  true,
  true
)
on conflict (id) do update
set
  name = excluded.name,
  slug = excluded.slug,
  category = excluded.category,
  component_key = excluded.component_key,
  is_active = excluded.is_active,
  is_premium = excluded.is_premium;
