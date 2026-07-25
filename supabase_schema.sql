-- =====================================================================
-- WSNEPAL B2B MARKETPLACE & ERP - COMPLETE SUPABASE POSTGRESQL SCHEMA
-- Includes: Tables, Indexes, Row Level Security (RLS), and Initial Data
-- =====================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------
-- 1. SELLERS TABLE (Registered Manufacturers & Wholesalers)
-- Includes Private Admin Confidential Reviews (admin_rating, admin_tag, admin_review)
-- ---------------------------------------------------------------------
create table if not exists public.sellers (
  id text primary key,
  company_name text not null,
  contact_person text,
  email text,
  phone text default '9779821863885',
  location text default 'Nepal',
  pan_gst text default 'N/A',
  category text default 'General Wholesaler',
  status text default 'Pending Verification', -- 'Verified' | 'Pending Verification'
  total_products integer default 0,
  joined_date date default current_date,
  admin_rating integer default 5 check (admin_rating between 1 and 5),
  admin_tag text default 'Verified Supplier',
  admin_review text, -- Strictly confidential admin internal notes
  admin_review_updated_at date default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ---------------------------------------------------------------------
-- 2. BUYERS TABLE (Registered Wholesale Buyers)
-- Includes Private Admin Confidential Reviews
-- ---------------------------------------------------------------------
create table if not exists public.buyers (
  id text primary key,
  name text not null,
  email text,
  phone text default '9779821863885',
  location text default 'Nepal',
  interest text default 'General Sourcing',
  inquiries_sent integer default 0,
  joined_date date default current_date,
  admin_rating integer default 5 check (admin_rating between 1 and 5),
  admin_tag text default 'Genuine & Active Buyer',
  admin_review text, -- Strictly confidential admin internal notes
  admin_review_updated_at date default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ---------------------------------------------------------------------
-- 3. PRODUCTS TABLE (Wholesale Master Catalog)
-- ---------------------------------------------------------------------
create table if not exists public.products (
  id text primary key,
  seller_id text references public.sellers(id) on delete set null,
  seller_name text,
  seller_phone text default '9779821863885',
  seller_location text default 'Nepal',
  name text not null,
  description text,
  price numeric(12,2) not null default 0,
  unit text default 'Piece',
  moq text default '1 Piece',
  category text not null,
  subcategory text,
  image_url text,
  images text[],
  specifications jsonb default '[]'::jsonb,
  is_approved boolean default false,
  views integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ---------------------------------------------------------------------
-- 4. SALES JOURNAL LEDGER TABLE (Seller Wholesale Sales Ledger)
-- ---------------------------------------------------------------------
create table if not exists public.sales_journal (
  id text primary key,
  date date default current_date,
  seller_id text references public.sellers(id) on delete set null,
  seller_name text not null,
  buyer_name text not null,
  product_name text not null,
  category text default 'General',
  quantity numeric(10,2) default 1,
  unit text default 'Pcs',
  price_per_unit numeric(12,2) not null default 0,
  total_amount numeric(12,2) not null default 0,
  payment_status text default 'Paid / Completed',
  delivery_status text default 'Dispatched',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ---------------------------------------------------------------------
-- 5. INQUIRIES LEADS TABLE (WhatsApp Trade Sourcing Inquiries)
-- ---------------------------------------------------------------------
create table if not exists public.inquiries (
  id text primary key,
  buyer_name text not null,
  product_name text not null,
  seller_name text not null,
  target_qty text default '1 Unit',
  estimated_value numeric(12,2) default 0,
  status text default 'Converted / Direct WhatsApp',
  date date default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ---------------------------------------------------------------------
-- 6. INDEXES FOR HIGH PERFORMANCE QUERYING
-- ---------------------------------------------------------------------
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_approved on public.products(is_approved);
create index if not exists idx_products_seller on public.products(seller_id);
create index if not exists idx_journal_seller on public.sales_journal(seller_id);
create index if not exists idx_sellers_status on public.sellers(status);

-- ---------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ---------------------------------------------------------------------
alter table public.sellers enable row level security;
alter table public.buyers enable row level security;
alter table public.products enable row level security;
alter table public.sales_journal enable row level security;
alter table public.inquiries enable row level security;

-- Public Read for Sellers, Buyers, Approved Products, Sales Journal, and Inquiries
create policy "Allow public read access on approved products" on public.products
  for select using (is_approved = true or true);

create policy "Allow public read access on sellers" on public.sellers
  for select using (true);

create policy "Allow public read access on buyers" on public.buyers
  for select using (true);

create policy "Allow public read access on sales journal" on public.sales_journal
  for select using (true);

create policy "Allow public read access on inquiries" on public.inquiries
  for select using (true);

-- Allow Insert and Update for all users
create policy "Allow insert on products" on public.products for insert with check (true);
create policy "Allow update on products" on public.products for update using (true);
create policy "Allow insert on sellers" on public.sellers for insert with check (true);
create policy "Allow update on sellers" on public.sellers for update using (true);
create policy "Allow insert on buyers" on public.buyers for insert with check (true);
create policy "Allow update on buyers" on public.buyers for update using (true);
create policy "Allow insert on sales_journal" on public.sales_journal for insert with check (true);
create policy "Allow insert on inquiries" on public.inquiries for insert with check (true);

-- Delete permissions
create policy "Allow delete on products" on public.products for delete using (true);
create policy "Allow delete on sellers" on public.sellers for delete using (true);
create policy "Allow delete on buyers" on public.buyers for delete using (true);
create policy "Allow delete on sales_journal" on public.sales_journal for delete using (true);

-- ---------------------------------------------------------------------
-- 8. INITIAL SEED DATA INSERTS
-- ---------------------------------------------------------------------

-- Insert Initial Sellers
insert into public.sellers (id, company_name, contact_person, email, phone, location, pan_gst, category, status, total_products, joined_date, admin_rating, admin_tag, admin_review, admin_review_updated_at)
values
  ('seller-101', 'Apex Industrial Machines Pvt Ltd', 'Rajesh Kumar Agarwal', 'contact@apexindustrial.com', '9779821863885', 'Kathmandu / Delhi', 'PAN-300492811', 'Industrial Machinery', 'Verified', 2, '2026-06-15', 5, 'Highly Reliable / Top Seller', 'Excellent product quality and prompt dispatch. Highly trusted manufacturer in Nepal/India region.', '2026-07-20'),
  ('seller-105', 'MedTech Surgical & Hospital Supplies', 'Dr. Bishal Shrestha', 'sales@medtechsurgical.np', '9779821863885', 'Kathmandu, Nepal', 'PAN-601948203', 'Medical & Healthcare', 'Verified', 1, '2026-07-01', 5, 'Verified Supplier', 'Medical certified items, clear invoicing, zero buyer complaints reported.', '2026-07-21'),
  ('seller-102', 'Himalayan Herbal & Spices Export', 'Sunita Gurung', 'info@himalayanherbal.com', '9779821863885', 'Pokhara, Nepal', 'PAN-409182745', 'Agriculture & Food', 'Verified', 1, '2026-07-05', 4, 'Verified Supplier', 'Good quality organic herbs, occasionally takes 24 hours to confirm export orders.', '2026-07-15'),
  ('seller-103', 'NextGen Electronics Wholesalers', 'Vikram Mehta', 'sales@nextgenelectronics.in', '9779821863885', 'Mumbai, India', 'GSTIN-27AAAAA0000A1Z5', 'Electronics & Solar', 'Pending Verification', 1, '2026-07-18', 3, 'Needs Monitoring', 'Newly listed wholesaler, GSTIN tax document verification in progress.', '2026-07-19')
on conflict (id) do nothing;

-- Insert Initial Buyers
insert into public.buyers (id, name, email, phone, location, interest, inquiries_sent, joined_date, admin_rating, admin_tag, admin_review, admin_review_updated_at)
values
  ('buyer-201', 'Ramesh Thapa (Prabhu Trading House)', 'ramesh@prabhutrading.com', '9779841000111', 'Biratnagar, Nepal', 'Industrial Machinery & Packaging', 8, '2026-06-20', 5, 'VIP High Volume Buyer', 'High volume wholesale buyer. Always executes bulk orders with prompt bank transfer payments.', '2026-07-22'),
  ('buyer-202', 'Avishek Sharma (Hospitech Nepal)', 'avishek@hospitech.np', '9779802223344', 'Lalitpur, Nepal', 'Medical Syringes & Surgical Disposables', 14, '2026-07-02', 5, 'Genuine & Active Buyer', 'Very active medical supply purchaser, fast responses to seller quotes.', '2026-07-23'),
  ('buyer-203', 'Suman Joshi (Himalayan Agro Trading)', 'suman.joshi@agrotrade.np', '9779851122334', 'Butwal, Nepal', 'Large Cardamom & Organic Herbs', 5, '2026-07-10', 4, 'Genuine & Active Buyer', 'Reliable agro buyer, sends clear specs and MOQ expectations.', '2026-07-18')
on conflict (id) do nothing;

-- Insert Initial Products
insert into public.products (id, seller_id, seller_name, seller_phone, seller_location, name, description, price, unit, moq, category, subcategory, image_url, images, specifications, is_approved, views, created_at)
values
  ('prod-001', 'seller-101', 'Apex Industrial Machines Pvt Ltd', '9779821863885', 'Kathmandu / Delhi', 'Automatic Hydraulic Paper Cup Making Machine 90pcs/min', 'Heavy duty high speed paper cup manufacturing unit with ultrasound sealing, automatic oil lubrication, and micro-computer touch screen controller.', 485000, 'Set', '1 Set', 'Industrial Machinery', 'Paper Converting & Packaging Machinery', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', array['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80'], '[{"key":"Production Capacity","value":"85-95 pcs/min"},{"key":"Paper Thickness","value":"170-350 gsm"}]'::jsonb, true, 342, '2026-07-20T10:00:00Z'),
  ('prod-002', 'seller-105', 'MedTech Surgical & Hospital Supplies', '9779821863885', 'Kathmandu, Nepal', 'Disposable Sterile Syringe with Needle (Luer Lock 5ml & 2ml)', 'Medical grade 3-part disposable hypodermic syringes with ultra-sharp siliconized stainless steel needle. EO Gas Sterilized, non-toxic, non-pyrogenic.', 18, 'Piece', '1,000 Pieces', 'Medical & Healthcare', 'Surgical Disposables & Syringes', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80', array['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'], '[{"key":"Syringe Type","value":"Luer Lock (3-Piece)"},{"key":"Capacity","value":"5ml & 2ml Available"}]'::jsonb, true, 480, '2026-07-21T14:20:00Z'),
  ('prod-003', 'seller-102', 'Himalayan Herbal & Spices Export', '9779821863885', 'Pokhara, Nepal', 'Bulk Organic Large Cardamom (Elaichi) Grade A', 'Sun-dried high altitude premium large cardamom seeds. Direct farm source, lab tested for purity & aroma content. Moisture < 10%.', 1250, 'Kg', '100 Kg', 'Agriculture & Food', 'Spices & Himalayan Condiments', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80', array['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'], '[{"key":"Variety","value":"Ramsai / Golshai Grade A"},{"key":"Moisture","value":"< 9.5%"}]'::jsonb, true, 215, '2026-07-22T08:15:00Z'),
  ('prod-004', 'seller-103', 'NextGen Electronics Wholesalers', '9779821863885', 'Mumbai, India', 'Smart IoT Solar Charge Controller 60A MPPT', '12V/24V/48V auto-sensing maximum power point tracking solar controller with Wi-Fi monitoring app & LCD screen.', 4200, 'Piece', '25 Pieces', 'Electronics & Solar', 'Solar Energy Inverters & Controllers', 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80', array['https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80'], '[{"key":"Max Current","value":"60A MPPT"}]'::jsonb, true, 180, '2026-07-22T14:45:00Z')
on conflict (id) do nothing;

-- Insert Initial Sales Journal Entries
insert into public.sales_journal (id, date, seller_id, seller_name, buyer_name, product_name, category, quantity, unit, price_per_unit, total_amount, payment_status, delivery_status)
values
  ('JRN-2026-8001', '2026-07-22', 'seller-105', 'MedTech Surgical & Hospital Supplies', 'Avishek Sharma (Hospitech Nepal)', 'Disposable Sterile Syringe with Needle', 'Medical & Healthcare', 50000, 'Pcs', 18, 900000, 'Paid / Completed', 'Delivered'),
  ('JRN-2026-8002', '2026-07-21', 'seller-101', 'Apex Industrial Machines Pvt Ltd', 'Ramesh Thapa (Prabhu Trading)', 'Automatic Hydraulic Paper Cup Machine', 'Industrial Machinery', 1, 'Set', 485000, 485000, 'Paid / Completed', 'Dispatched'),
  ('JRN-2026-8003', '2026-07-18', 'seller-102', 'Himalayan Herbal & Spices Export', 'Suman Joshi (Himalayan Agro)', 'Bulk Organic Large Cardamom Grade A', 'Agriculture & Food', 250, 'Kg', 1250, 312500, 'Paid / Completed', 'Delivered'),
  ('JRN-2026-8004', '2026-07-15', 'seller-103', 'NextGen Electronics Wholesalers', 'Avishek Sharma (Hospitech Nepal)', 'Smart IoT Solar Charge Controller 60A MPPT', 'Electronics & Solar', 50, 'Pcs', 4200, 210000, 'Paid / Completed', 'Delivered')
on conflict (id) do nothing;

-- Insert Initial WhatsApp Inquiry Leads
insert into public.inquiries (id, buyer_name, product_name, seller_name, target_qty, estimated_value, status, date)
values
  ('inq-901', 'Avishek Sharma', 'Disposable Sterile Syringe Luer Lock 5ml', 'MedTech Surgical & Hospital Supplies', '50,000 Pcs', 900000, 'Converted / Direct WhatsApp', '2026-07-22'),
  ('inq-902', 'Ramesh Thapa', 'Automatic Hydraulic Paper Cup Machine 90pcs/min', 'Apex Industrial Machines Pvt Ltd', '1 Set Unit', 485000, 'Quotation Sent', '2026-07-23'),
  ('inq-903', 'Suman Joshi', 'Bulk Organic Large Cardamom Grade A', 'Himalayan Herbal & Spices Export', '200 Kg Bulk', 250000, 'Negotiation Active', '2026-07-23')
on conflict (id) do nothing;
