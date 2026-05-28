# Supabase Backend Setup — Nanay Nely

This project uses **Supabase** for authentication, PostgreSQL database, and Row Level Security (RLS). Only the **anon (public) key** is used in the Next.js frontend. Never put the **service role key** in client code or `.env.local` files committed to git.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. Wait for the database to finish provisioning.

## 2. Environment variables

Copy the example file:

```bash
cp .env.local.example .env.local
```

Fill in values from **Project Settings → API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tnsratbuwbkasxamsuqm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuc3JhdGJ1d2JrYXN4YW1zdXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3ODA5OTAsImV4cCI6MjA5NTM1Njk5MH0.Rh7L0OOTXIS2Gg6CsX9CHf__KEePyhHDuZQmHQzUiQc
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```


| Variable                        | Purpose                                     |
| ------------------------------- | ------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Project API URL                             |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (safe for browser with RLS) |
| `NEXT_PUBLIC_SITE_URL`          | Site URL for auth redirects & PWA           |


**Do not add** `SUPABASE_SERVICE_ROLE_KEY` to the frontend app.

## 3. Run the database schema

1. Open **SQL Editor** in the Supabase dashboard.
2. Paste and run the entire contents of `**supabase/schema.sql`**.
3. Confirm tables exist under **Table Editor**:
  - `profiles`
  - `products`
  - `orders`
  - `order_items`
  - `contact_messages`

## 4. Configure Authentication

1. **Authentication → Providers → Email** — enable Email.
2. For local development you may disable **Confirm email** so login works immediately after signup.
3. **Authentication → URL Configuration**:
  - **Site URL**: `http://localhost:3000` (or your production URL)
  - **Redirect URLs**:
    - `http://localhost:3000/auth/callback`
    - `http://localhost:3000/reset-password`

## 5. Create your first admin

1. Register a normal account at `/register` (creates a `customer` profile automatically).
2. In **SQL Editor**, promote that user:

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'your-admin@email.com'
);
```

1. Sign in at `**/admin/login**`.

## 6. Start the app

```bash
npm install
npm run dev
```

## Security model (RLS)


| Role          | Permissions                                         |
| ------------- | --------------------------------------------------- |
| **Anonymous** | Read active products; submit contact messages       |
| **Customer**  | Own profile (read/update); own orders; place orders |
| **Admin**     | All products CRUD; all orders; all contact messages |


Customers **cannot** read other users' orders or admin data. Admins bypass restrictions via `is_admin()` policies.

## Features wired to Supabase

- Customer register / login / logout
- Profile saved on registration (trigger + client upsert)
- Product CRUD (admin)
- Order submission with line items
- Customer order history
- Admin order status updates
- Contact form → `contact_messages`
- Protected `/dashboard` and `/admin/`* routes

## Troubleshooting


| Issue               | Fix                                                 |
| ------------------- | --------------------------------------------------- |
| `Invalid API key`   | Check `.env.local` URL and anon key                 |
| Profile not created | Re-run `schema.sql` trigger section                 |
| Orders blocked      | Ensure user is logged in as `customer`, not `admin` |
| RLS errors          | Confirm policies in `schema.sql` were applied       |
| Email not arriving  | Check Supabase Auth logs; disable confirm for dev   |


## Production checklist

- Set production `NEXT_PUBLIC_SITE_URL` (HTTPS)
- Add production URLs to Supabase redirect allow list
- Enable email confirmation if required
- Rotate keys if `.env.local` was ever exposed
- Never deploy `SUPABASE_SERVICE_ROLE_KEY` to the browser

