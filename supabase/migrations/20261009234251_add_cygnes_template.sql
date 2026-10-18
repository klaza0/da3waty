insert into public.templates (id, name, slug, category, component_key, is_active, is_premium)
values
  ('11111111-1111-4111-8111-111111111111', 'ختم الشمع', 'classic', 'engagement', 'classic', true, false),
  ('22222222-2222-4222-8222-222222222222', 'لاكشري', 'luxury', 'wedding', 'luxury', true, false),
  ('33333333-3333-4333-8333-333333333333', 'رومانتيك', 'romantic', 'engagement', 'romantic', true, false),
  ('44444444-4444-4444-8444-444444444444', 'فلورال', 'floral', 'henna', 'floral', true, false),
  ('55555555-5555-4555-8555-555555555555', 'مينيمال', 'minimal', 'newborn', 'minimal', true, false),
  ('66666666-6666-4666-8666-666666666666', 'حديقة الإوز', 'swans', 'engagement', 'swans', true, true),
  ('77777777-7777-4777-8777-777777777777', 'قمر الليل', 'moonlight', 'wedding', 'moonlight', true, true),
  ('88888888-8888-4888-8888-888888888888', 'حديقة الذهب', 'gardenbloom', 'henna', 'gardenbloom', true, true),
  ('99999999-9999-4999-8999-999999999999', 'ورد الليل', 'nightrose', 'wedding', 'nightrose', true, true),
  ('c1c1c1c1-c1c1-41c1-81c1-c1c1c1c1c1c1', 'سيغن', 'cygnes', 'wedding', 'cygnes', true, true)
on conflict (id) do update
set
  name = excluded.name,
  slug = excluded.slug,
  category = excluded.category,
  component_key = excluded.component_key,
  is_active = excluded.is_active,
  is_premium = excluded.is_premium;
