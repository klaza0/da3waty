# Da3waty | دعوتي — Digital Wedding Invitations

An Arabic platform for creating electronic invitations for weddings and special occasions, by **Ibrahim Montaser / IMDEV**. Pick a design, customize your details, preview the invitation live, and publish it to a shareable link in minutes.

**[Open Da3waty live](https://da3waty.vercel.app/)**

## Preview

### Home
![Da3waty home page in Arabic with the invitation builder entry point](https://github.com/user-attachments/assets/342ae2d4-0b5f-4107-9035-8c6c3073829e)

### Template gallery
![Invitation designs gallery including wax-seal, luxury, and romantic templates](https://github.com/user-attachments/assets/7c8aad84-df70-44fe-a587-7ca47913ba4d)

### Sealed invitation opening
![Wax-sealed envelope invitation intro for a published invitation](https://github.com/user-attachments/assets/ad6b8c7c-f1d3-45ef-ad2c-bc751cfe2906)

## Features

- A gallery of invitation designs, from wax-seal animated openings to luxury and romantic themes.
- An invitation builder with a live preview while you edit.
- Publishing to unique shareable links at `/invite/[slug]`.
- RSVP responses, guest greetings, and photo uploads.
- QR code generation for invitations.
- Accounts with optional Google sign-in through Supabase Auth.
- One-time payment model: a single subscription unlocks every design.

## Built with

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19 + TypeScript |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion |
| Backend | Supabase (Postgres, Auth, Storage) |
| Extras | qrcode, zod, sonner |

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Without Supabase you can still browse the home page, `/templates`, the builder at `/create/classic`, and the demo invitation at `/invite/seif-sama`. Saving invitations, RSVPs, greetings, and photo uploads needs a Supabase project.

Environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Core flow

```text
Homepage → /templates → /create/[templateId] → Live preview → Publish → /invite/[slug]
```

---

Built by **Ibrahim Montaser / IMDEV**.
