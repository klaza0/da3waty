# دعوتي | Da3waty

منصة عربية لإنشاء دعوات إلكترونية للأفراح والمناسبات.

## التشغيل المحلي

```bash
npm install
cp .env.example .env.local
npm run dev
```

بدون Supabase يمكنك تصفح:

- الصفحة الرئيسية
- `/templates`
- منشئ الدعوة `/create/classic`
- الدعوة التجريبية `/invite/seif-sama`

لحفظ الدعوات، RSVP، التهاني، ورفع الصور تحتاج مشروع Supabase.

## متغيرات البيئة

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## إعداد Supabase

المشروع مربوط بـ [Da3waty على Supabase](https://supabase.com/dashboard/project/ggzbhvashqdxcyywoaxx) (خطة مجانية). انسخ `.env.example` إلى `.env.local` إذا احتجت إعادة المفاتيح.

فعّل Google OAuth اختياريًا من Authentication > Providers، وأضف Redirect URL:

`http://localhost:3000/auth/callback`

## المسار الأساسي

```text
Homepage → /templates → /create/[templateId] → Live Preview → Publish → /invite/[slug]
```

دعوة العرض الجاهزة: `/invite/seif-sama` (سيف و سما — 6 نوفمبر 2026 — نادي الجلاء).
