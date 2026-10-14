# Nfl Rebate — Portal Rebate Forex

> Tautkan akun broker → pantau komisi per lot real-time → tarik kapan saja. Clone my.pipsbackfx.app untuk Exness, XM, Headway.

**Live:** https://nflrebate.vercel.app · **Repo:** `naufalirfan/nflrebate` · **Stack:** Next.js 16 App Router + Supabase (Postgres + Auth + RLS) + Tailwind 4 + PWA

---

## ✨ Fitur

| Modul | Status | Keterangan |
|-------|--------|------------|
| **Auth email-only** | ✅ | Register / login / forgot & reset password (`/forgot-password`, `/reset-password`), `mailer_autoconfirm` aktif, hash `#access_token&type=recovery` → `/reset-password` |
| **Akun broker** | ✅ | Exness / XM / Headway, tipe Standard/Cent/Raw/ECN/Pro, status `pending → active/rejected` |
| **Dashboard rebate** | ✅ | Saldo, lifetime, withdrawn, volume bulan ini; filter broker/akun/symbol/tanggal; CSV export; `Rincian Rebate (Rincian)` per tiket |
| **Import CSV (Admin)** | ✅ | Idempotent `ticket_id UNIQUE`, `rate = rebate_rules.rate_per_lot × volume_lots`, DLQ, auto credit `user_balances` |
| **Withdrawal** | ✅ | Bank / E-Wallet (Dana/OVO/GoPay) / USDT TRC20, kurs 16.500; `pending` → admin approve/reject → potong saldo + audit log |
| **Admin Withdrawals** | ✅ | List pending + riwayat 50, approve/reject dengan cek saldo, RLS `is_admin()` |
| **Theme** | ✅ | Light `#f7f7f5` / Dark charcoal `#1e1e24` (`surface #2a2a30`, `hairline #34343e`), toggle pill 44×44 di header |
| **PWA** | ✅ | `manifest.json` — Nfl Rebate, `standalone` |
| KYC / 2FA / Referral multi-tier / VPS Worker BullMQ | ⏳ | Roadmap Fase 2 |

## 🖥 Halaman

`/ (landing)` · `/login` · `/register` · `/forgot-password` · `/reset-password` · `/dashboard` · `/accounts` · `/withdraw` · `/admin/import` · `/admin/withdrawals` · `/auth/callback` · `/auth/confirm`

Guard: `middleware.ts` (`@supabase/ssr`) — unauthenticated → `/login`, authenticated di `/login|/register` → `/dashboard`.

## 🎨 Design

- **Source:** Figma — `https://design.hagicode.com/designs/figma/` (monochrome chrome `#000/#fff` + pastel blocks)
- **Tokens:** `bg #f7f7f5` / `dark #1e1e24`, `surface-soft #f7f7f5 → #2a2a30`, `hairline #e6e6e6 → #34343e`, pastel `lime #dceeb1` · `lilac #c5b0f4` · `cream #f4ecd6` · `sky #c2e8ff`
- **Geometry:** `rounded-[24px]` card, `rounded-[50px]` pill, `rounded-[8px]` inner; `h-[56px]` header sticky; `min-h-[44px]` semua button/input (a11y tap target); `input text-[16px]` anti iOS zoom
- **File:** `DESIGN.md` (Figma 32k, lint 0) + `src/app/globals.css` — `@custom-variant dark`, `Kate -apple-system` dsb, `:focus-visible 2px dashed`

## 🗄 Database

Supabase project `xclimizoxzfanigualch` (ap-southeast-1). Tiga migrasi di `supabase/migrations/`:

- **001_init.sql** — base SplitBudget (`profiles`, dsb)
- **002_nfl.sql** — `broker_accounts (broker in Exness/XM/Headway, unique broker+account_number)`, `rebate_rules (broker, account_type, symbol_group, rate_per_lot)`, `trade_logs (ticket_id UNIQUE, volume_lots>0, client_rebate)`, `user_balances (available/total_earned/total_withdrawn)`, `withdrawals` + RLS permissive (di-replace 003) + trigger `handle_new_user()` (insert `profiles` + `user_balances` on `auth.users` insert) + seed 9 rules (Exness/XM/Headway × forex/metals/indices)
- **003_rls_withdraw.sql** — tambah `trade_logs.user_id + index + backfill`, function `is_admin() → role in (admin,super_admin,admin_ops,finance)`, RLS hardening:
  - `profiles / broker_accounts / trade_logs / user_balances / withdrawal_requests / audit_logs` → `auth.uid()=owner OR is_admin()`
  - `rebate_rules` → `SELECT true` (public read), `INSERT/UPDATE/DELETE is_admin()` only

> Jalankan SQL via **Supabase SQL Editor** atau `POST /v1/projects/{ref}/database/query { "query": "..." }` dengan `SUPABASE_ACCESS_TOKEN`.

## 🔐 Auth & RLS

- Email/password only (tanpa OAuth). Supabase Auth `GoTrue v2.197.0`, `site_url https://nflrebate.vercel.app`, `mailer_autoconfirm true`
- Roles `profiles.role`: `trader` (default), `admin` / `super_admin` / `admin_ops` / `finance` — `is_admin()` dipakai RLS. Ubah via SQL: `update profiles set role='super_admin' where email='...'`
- `anon` hanya baca `rebate_rules`; `authenticated` akses owner-scope; admin bypass via `is_admin()`

## 🚀 Quick Start

```bash
git clone https://github.com/naufalirfan/nflrebate.git
cd nflrebate
npm install

# env — jangan commit .env.local, jangan share secret di chat
cp .env.example .env.local
# isi:
# NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon key]
# SUPABASE_SERVICE_ROLE_KEY=[service_role — server only]

# migrasi — copy-paste 001→002→003 di Supabase Dashboard > SQL Editor > Run
# atau via Management API (butuh SUPABASE_ACCESS_TOKEN)

npm run dev      # http://localhost:3000
npm run build    # 13 routes, tsc strict 0 error
```

### Env

| Var | Scope | Keterangan |
|-----|-------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | client+server | Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client | anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | service_role (jangan expose ke client) |
| `NEXT_PUBLIC_APP_URL` | client | `https://nflrebate.vercel.app` (opsional) |
| `SUPABASE_ACCESS_TOKEN` | local/CI only | Management API — jangan taruh di Vercel env |

> Kredensial via **Vercel Dashboard > Settings > Environment Variables** atau `vercel env pull`. Di chat/repo hanya placeholder `[REDACTED]`.

## 📁 Struktur

```
src/app/
  page.tsx                 # landing — monochrome + pastel blocks
  layout.tsx               # viewport themeColor, hash #access_token capture → /reset-password
  globals.css              # Figma tokens, .pbfx-* auth, .dark variants
  (auth)/login|register|forgot-password
  reset-password/
  (app)/layout.tsx         # header 56px + ThemeToggle + nav Dashboard/Akun/Withdraw/Admin
  (app)/dashboard/         # DashboardClient — stat 4 kartu pastel, filter, CSV, Rincian
  (app)/accounts/          # AccountsClient — tautkan broker_accounts
  (app)/withdraw/          # WithdrawClient — form channel + riwayat
  (app)/admin/import/      # ImportClient — CSV idempotent + DLQ
  (app)/admin/withdrawals/ # WithdrawalsAdminClient — approve/reject
  auth/callback|confirm/
src/components/ThemeProvider.tsx  ThemeToggle.tsx
src/lib/supabase/{client,server,middleware}.ts
supabase/migrations/001_init.sql 002_nfl.sql 003_rls_withdraw.sql
public/manifest.json  preview-C.html
DESIGN.md
```

## 🔄 Alur Rebate & Withdraw

```
CSV (ticket_id,symbol,volume_lots,close_time)
  → symbolGroup() → lookup rebate_rules (broker×account_type×symbol_group)
  → gross = rate_per_lot × volume_lots
  → insert trade_logs (UNIQUE ticket_id — duplicate → DLQ)
  → credit user_balances.available + total_earned

Withdraw (amount_usd × 16500 → IDR, channel bank/ewallet/USDT)
  → insert withdrawal_requests status pending
  → Admin approve: cek available ≥ amount, deduct available, add total_withdrawn, status approved, audit_logs
```

## ☁️ Deploy (Vercel)

- Project: `nflrebate` (`prj_m3gH1DPAoySEn6O50D3ts7T7K7wM`) — `https://nflrebate.vercel.app`
- `vercel link --yes && vercel --prod --yes` — auto Next.js, Node 20, Root `/`
- Env di Vercel Dashboard; `vercel.json` tidak diperlukan (default)
- SSO Protection dimatikan (`ssoProtection: null`) untuk public access

## 🧪 Verifikasi

```bash
npm run build                          # 10/10 pages, 13 routes
npx tsc --noEmit                       # 0 error
curl -s https://nflrebate.vercel.app | grep dark:text-white | wc -l
# CSS chunk harus mengandung dceeb1 c5b0f4 f4ecd6 c2e8ff 1e1e24 2a2a30 34343e
```

Mobile audit 390px: no horizontal overflow, tap target ≥44px, input 16px.

## 🗺 Roadmap

Fase 1 ✅ — rebrand, auth email, dashboard, broker linking (Exness/XM/Headway), import CSV manual.
Fase 2 ⏳ — KYC upload + verifikasi, 2FA TOTP, referral multi-tier, worker BullMQ/Redis (MTP, split komisi, clawback), export filter lanjutan, RBAC granular, PgBouncer, R2/Storage bukti.

## 📄 Lisensi

Private — `naufalirfan/nflrebate`. Jangan publish kredensial.
