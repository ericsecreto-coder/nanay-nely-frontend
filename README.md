# Nanay Nely Frontend (Next.js + Supabase)

Next.js App Router storefront for Nanay Nely's Lambanog with Supabase backend (auth, database, RLS), ordering, admin panel, and PWA support.

## Quick start

```bash
cp .env.local.example .env.local
# Fill in Supabase URL + anon key (see SUPABASE_SETUP.md)

npm install
npm run dev
```

**Full backend setup:** see **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public anon key (safe with RLS) |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Site URL for auth & PWA |

**Never** expose `SUPABASE_SERVICE_ROLE_KEY` in this frontend app.

## Database

Run **`supabase/schema.sql`** once in the Supabase SQL Editor. It creates:

- `profiles` — users with `customer` / `admin` roles
- `products` — catalog with seed data
- `orders` + `order_items` — customer orders
- `contact_messages` — contact form submissions

All tables use **Row Level Security**.

## Features

| Area | Details |
|------|---------|
| **Auth** | Register, login, logout, forgot/reset password |
| **Profiles** | Auto-created on signup; saved via trigger + upsert |
| **Products** | Public catalog; admin CRUD |
| **Orders** | Cart → checkout → Supabase; customer history |
| **Admin** | Products, orders (status updates), contact messages |
| **Contact** | Form saves to `contact_messages` |
| **PWA** | Installable, offline fallback, service worker |

## Pages

- `/` `/about` `/products` `/cart` `/order` `/contact`
- `/login` `/register` `/dashboard` (customer)
- `/admin/login` `/admin` `/admin/products` `/admin/orders` `/admin/messages`

## PWA (production)

```bash
npm run build
npm start
```

Service worker is disabled in `npm run dev`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Generate icons + production build |
| `npm run generate:icons` | PWA icon PNGs |
