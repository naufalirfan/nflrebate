# SplitBudget — Patungan Liburan

MVP vibecoding: Next.js App Router + Tailwind + Supabase + PWA (next-pwa).

## Stack
- Next.js 16 + Tailwind CSS 4 + next-pwa
- Supabase (Auth, Postgres, Storage, Realtime)
- Vercel + Cloudflare

## Fitur MVP
- **Dompet Grup**: saldo hijau/merah + timeline
- **Quick Input**: <10s, payer + split rata/custom
- **Settle Up**: graph simplification, copy rek/QRIS, upload bukti, konfirmasi lunas
- Invite via link & kode 6-char

## Setup
```bash
npm install
cp .env.example .env.local # isi SUPABASE_URL & ANON_KEY
# jalankan SQL: supabase/migrations/001_init.sql di Supabase SQL Editor
# aktifkan Google OAuth di Supabase Auth > Providers
npm run dev
```

## Env
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=
```

## Supabase
- Jalankan `supabase/migrations/001_init.sql`
- Storage buckets: `proofs`, `qris` (public)
- Auth: Email/password + Google OAuth (redirect: /auth/callback)
- RLS: permissive MVP, lock down next phase

## Deploy Vercel
- Framework: Next.js, Root: / (auto), Node 20
- Env vars via Vercel Dashboard (jangan share di chat)
- vercel.json tidak diperlukan (default)

## Mode
Pencatatan murni — tanpa Payment Gateway (sesuai PRD).
