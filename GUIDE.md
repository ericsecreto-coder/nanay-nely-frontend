# How to Run Nanay Nely Frontend

## 1. Open the project in VS Code

```bash
cd C:\Users\Rodel\Projects\nanay-nely-frontend
code .
```

## 2. Set up environment variables

Copy the example env file and fill in your Supabase credentials:

```bash
copy .env.local.example .env.local
```

Open `.env.local` and add:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Set up the database

1. Go to your Supabase dashboard → SQL Editor
2. Copy everything from `supabase/schema.sql`
3. Paste and run it (creates all tables + RLS policies + seed data)

## 4. Promote yourself to admin

In Supabase SQL Editor, run:

```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'your@email.com');
```

(Replace with the email you registered with)

## 5. Add Nanay Nely's photo

Place the photo file at: `public/maker/nanay-nely.jpg`

## 6. Install and run

```bash
npm install
npm run dev
```

The site opens at **http://localhost:3000**

---

## Key URLs

| Page | URL |
|------|-----|
| Home | http://localhost:3000 |
| Admin Login | http://localhost:3000/admin/login |
| Admin Dashboard | http://localhost:3000/admin |
| Admin Products | http://localhost:3000/admin/products |
| Admin Home Screen | http://localhost:3000/admin/home |
| Admin Accounts | http://localhost:3000/admin/admins |
| Admin Orders | http://localhost:3000/admin/orders |
| Customer Login | http://localhost:3000/login |
| Register | http://localhost:3000/register |
| About | http://localhost:3000/about |

---

## Common commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Check code for errors |

## Troubleshooting

- **"Missing Supabase env vars"** — `.env.local` is missing or has wrong values
- **Blank page on admin** — You haven't promoted your account to admin (see step 4)
- **Image not showing** — Make sure the file is at `public/maker/nanay-nely.jpg`
- **Port already in use** — Press `Ctrl+C` in the terminal to stop the server first
