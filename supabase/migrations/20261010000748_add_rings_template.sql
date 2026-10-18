insert into public.templates (id, name, slug, category, component_key, is_active, is_premium)
values (
  'b4b4b4b4-b4b4-44b4-84b4-b4b4b4b4b4b4',
  'خاتمان',
  'rings',
  'engagement',
  'rings',
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
