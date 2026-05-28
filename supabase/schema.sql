-- =============================================================================
-- Nanay Nely — Full Supabase schema (run once in SQL Editor)
-- Tables: profiles, products, orders, order_items, contact_messages, notifications
-- Security: RLS enabled, anon key only in frontend (never service role)
-- =============================================================================

-- Extensions
create extension if not exists "pgcrypto";

-- Types
do $$ begin
  create type public.user_role as enum ('customer', 'admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.order_status as enum (
    'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.contact_status as enum ('new', 'read', 'archived');
exception when duplicate_object then null;
end $$;

-- -----------------------------------------------------------------------------
-- profiles
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  phone text,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- products
-- -----------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  origin text not null default 'Infanta, Quezon',
  description text not null,
  price numeric(10, 2) not null check (price >= 0),
  image_url text not null,
  is_active boolean not null default true,
  stock integer not null default 0 check (stock >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- product_reviews
-- -----------------------------------------------------------------------------
create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null default '',
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- orders
-- -----------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status public.order_status not null default 'pending',
  customer_name text not null,
  contact_number text not null,
  delivery_address text not null default '',
  notes text,
  total numeric(10, 2) not null check (total >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- order_items
-- -----------------------------------------------------------------------------
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete restrict,
  product_name text not null,
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  line_total numeric(10, 2) not null check (line_total >= 0),
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- contact_messages
-- -----------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  name text not null,
  email text not null,
  message text not null,
  status public.contact_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- site_settings (home page content, managed by admin)
-- -----------------------------------------------------------------------------
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  section_key text unique not null,
  value jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- notifications
-- -----------------------------------------------------------------------------
do $$ begin
  create type public.notification_type as enum (
    'new_order', 'order_confirmed', 'order_status', 'info'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  type public.notification_type not null default 'info',
  title text not null,
  message text not null,
  related_order_id uuid references public.orders (id) on delete set null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Helpers & triggers
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'customer'
  )
  on conflict (id) do update set
    full_name = coalesce(excluded.full_name, public.profiles.full_name);
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists contact_messages_updated_at on public.contact_messages;
create trigger contact_messages_updated_at before update on public.contact_messages
for each row execute function public.set_updated_at();

drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at before update on public.site_settings
for each row execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- Indexes
create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists order_items_order_id_idx on public.order_items (order_id);
create index if not exists contact_messages_status_idx on public.contact_messages (status);

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.contact_messages enable row level security;
alter table public.notifications enable row level security;
alter table public.site_settings enable row level security;

-- profiles
drop policy if exists "Profiles: users read own" on public.profiles;
create policy "Profiles: users read own" on public.profiles for select to authenticated
using (auth.uid() = id);

drop policy if exists "Profiles: users update own" on public.profiles;
create policy "Profiles: users update own" on public.profiles for update to authenticated
using (auth.uid() = id) with check (auth.uid() = id and role = 'customer');

drop policy if exists "Profiles: admins read all" on public.profiles;
create policy "Profiles: admins read all" on public.profiles for select to authenticated
using (public.is_admin());

-- products
drop policy if exists "Products: public read active" on public.products;
create policy "Products: public read active" on public.products for select to anon, authenticated
using (is_active = true);

drop policy if exists "Products: admins read all" on public.products;
create policy "Products: admins read all" on public.products for select to authenticated
using (public.is_admin());

drop policy if exists "Products: admins insert" on public.products;
create policy "Products: admins insert" on public.products for insert to authenticated
with check (public.is_admin());

drop policy if exists "Products: admins update" on public.products;
create policy "Products: admins update" on public.products for update to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Products: admins delete" on public.products;
create policy "Products: admins delete" on public.products for delete to authenticated
using (public.is_admin());

-- product_reviews
alter table public.product_reviews enable row level security;

drop policy if exists "Reviews: public read" on public.product_reviews;
create policy "Reviews: public read" on public.product_reviews for select to anon, authenticated
using (true);

drop policy if exists "Reviews: auth insert own" on public.product_reviews;
create policy "Reviews: auth insert own" on public.product_reviews for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Reviews: auth update own" on public.product_reviews;
create policy "Reviews: auth update own" on public.product_reviews for update to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Reviews: auth delete own" on public.product_reviews;
create policy "Reviews: auth delete own" on public.product_reviews for delete to authenticated
using (auth.uid() = user_id);

drop policy if exists "Reviews: admins all" on public.product_reviews;
create policy "Reviews: admins all" on public.product_reviews for all to authenticated
using (public.is_admin());

-- orders
drop policy if exists "Orders: customers read own" on public.orders;
create policy "Orders: customers read own" on public.orders for select to authenticated
using (auth.uid() = user_id);

drop policy if exists "Orders: customers insert own" on public.orders;
create policy "Orders: customers insert own" on public.orders for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Orders: admins read all" on public.orders;
create policy "Orders: admins read all" on public.orders for select to authenticated
using (public.is_admin());

drop policy if exists "Orders: admins update" on public.orders;
create policy "Orders: admins update" on public.orders for update to authenticated
using (public.is_admin()) with check (public.is_admin());

-- order_items
drop policy if exists "Order items: customers read own orders" on public.order_items;
create policy "Order items: customers read own orders" on public.order_items for select to authenticated
using (exists (select 1 from public.orders o where o.id = order_items.order_id and o.user_id = auth.uid()));

drop policy if exists "Order items: customers insert own orders" on public.order_items;
create policy "Order items: customers insert own orders" on public.order_items for insert to authenticated
with check (exists (select 1 from public.orders o where o.id = order_items.order_id and o.user_id = auth.uid()));

drop policy if exists "Order items: admins read all" on public.order_items;
create policy "Order items: admins read all" on public.order_items for select to authenticated
using (public.is_admin());

-- contact_messages
drop policy if exists "Contact: anyone insert" on public.contact_messages;
create policy "Contact: anyone insert" on public.contact_messages for insert to anon, authenticated
with check (true);

drop policy if exists "Contact: users read own" on public.contact_messages;
create policy "Contact: users read own" on public.contact_messages for select to authenticated
using (user_id is not null and auth.uid() = user_id);

drop policy if exists "Contact: admins read all" on public.contact_messages;
create policy "Contact: admins read all" on public.contact_messages for select to authenticated
using (public.is_admin());

drop policy if exists "Contact: admins update" on public.contact_messages;
create policy "Contact: admins update" on public.contact_messages for update to authenticated
using (public.is_admin()) with check (public.is_admin());

-- notifications
drop policy if exists "Notifications: select" on public.notifications;
create policy "Notifications: select" on public.notifications for select to authenticated
using (
  (user_id is null and public.is_admin()) or
  (user_id is not null and auth.uid() = user_id)
);

drop policy if exists "Notifications: insert" on public.notifications;
create policy "Notifications: insert" on public.notifications for insert to authenticated
with check (true);

drop policy if exists "Notifications: update" on public.notifications;
create policy "Notifications: update" on public.notifications for update to authenticated
using (
  (user_id is null and public.is_admin()) or
  (user_id is not null and auth.uid() = user_id)
);

create index if not exists notifications_user_id_idx on public.notifications (user_id);
create index if not exists notifications_is_read_idx on public.notifications (is_read);
create index if not exists notifications_created_at_idx on public.notifications (created_at desc);

-- -----------------------------------------------------------------------------
-- Seed sample products
-- -----------------------------------------------------------------------------
insert into public.products (name, origin, description, price, image_url, stock)
select * from (values
  (
    'Classic Lambanog',
    'Infanta, Quezon',
    'Smooth and balanced traditional flavor for gatherings and celebrations.',
    180.00,
    '/products/classic.jpg',
    25
  ),
  (
    'Premium Reserve',
    'Small Batch',
    'Aged profile with richer aroma and refined finish.',
    260.00,
    'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1000&q=80',
    15
  ),
  (
    'Citrus Infused',
    'Special Blend',
    'Refreshing twist with a zesty edge while preserving native character.',
    220.00,
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1000&q=80',
    10
  )
) as v(name, origin, description, price, image_url, stock)
where not exists (select 1 from public.products limit 1);

-- site_settings
drop policy if exists "Site settings: public read" on public.site_settings;
create policy "Site settings: public read" on public.site_settings for select to anon, authenticated
using (true);

drop policy if exists "Site settings: admins all" on public.site_settings;
create policy "Site settings: admins all" on public.site_settings for all to authenticated
using (public.is_admin()) with check (public.is_admin());

-- Insert defaults
insert into public.site_settings (section_key, value) values
  ('meet_the_maker', '{"tag":"Meet the Maker","title":"Nanay Nely","role":"Master Lambanog Distiller — Infanta, Quezon","image_url":"/maker/nanay-nely.jpg","paragraphs":["For over four decades, Nanay Nely has been perfecting the art of lambanog distilling using methods handed down by her elders. Every bottle begins in the nipa palm groves behind her home, where she still harvests sap by hand before sunrise.","Her small-batch spirit carries the soul of Infanta — earthy, smooth, and deeply authentic. Nanay Nely believes lambanog is more than a drink; it is a story of family, patience, and Filipino craftsmanship."],"is_active":true}'::jsonb),
  ('hero', '{"tag":"Authentic Filipino Spirit","title":"Nanay Nely''s Lambanog","subtitle":"Crafted in Infanta, Quezon","description":"Premium local lambanog with rich heritage, smooth flavor, and handcrafted quality for every celebration.","image_url":"https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1100&q=80","is_active":true}'::jsonb),
  ('why_choose_us', '{"tag":"Why Choose Us","title":"Heritage, Taste, and Craftsmanship","description":"A proudly local product rooted in tradition and served with modern quality standards.","items":[{"title":"Traditional Distilling","desc":"Handcrafted with generations of Infanta, Quezon knowledge.","icon":"🍶"},{"title":"Natural Ingredients","desc":"Premium nipa sap and time-honored fermentation process.","icon":"🌿"},{"title":"Small Batch Quality","desc":"Every bottle follows a consistent, careful production standard.","icon":"✨"}],"is_active":true}'::jsonb),
  ('the_process', '{"tag":"From Sap to Spirit","title":"The Process","description":"Every bottle of Nanay Nely''s lambanog sasa follows a time-honored journey from the nipa palm to your glass.","steps":[{"title":"Harvesting the Sap","desc":"Nipa palm sap is carefully hand-tapped at dawn from stout stalks in the mangrove forests of Infanta, Quezon.","image_url":"/maker/made sasa.jpg"},{"title":"Natural Fermentation","desc":"The fresh sap is collected in containers and left to ferment naturally, developing its signature character.","image_url":"/maker/made2.jpg"},{"title":"Traditional Distillation","desc":"Fermented sap is distilled in small pots over wood fire — a method passed down through generations.","image_url":"/maker/made3.jpg"},{"title":"Collecting the Spirit","desc":"The clear distillate is carefully collected drop by drop, preserving the pure essence of lambanog sasa.","image_url":"/maker/made5.avif"}],"is_active":true}'::jsonb),
  ('featured_product', '{"tag":"Featured Product","title":"Try Our Best Seller","description":"Handcrafted with pride in Infanta, Quezon — experience the authentic taste of traditional lambanog.","product_name":"Classic Lambanog","product_origin":"Infanta, Quezon","product_description":"Smooth and balanced with a clean finish. Our signature spirit, distilled using traditional methods passed down through generations.","product_price":180,"image_url":"/products/classic.jpg","is_active":true}'::jsonb)
on conflict (section_key) do nothing;

-- Promote first admin (replace email):
-- update public.profiles set role = 'admin'
-- where id = (select id from auth.users where email = 'you@example.com');
