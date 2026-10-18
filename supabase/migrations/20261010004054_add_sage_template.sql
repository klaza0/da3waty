insert into public.templates (id, name, slug, category, component_key, is_active, is_premium)
values (
  'e5e5e5e5-e5e5-45e5-85e5-e5e5e5e5e5e5',
  'ختم الورد',
  'sage',
  'engagement',
  'sage',
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
