-- =====================================================================
-- WSNEPAL B2B MARKETPLACE & ERP — COMPLETE SUPABASE POSTGRESQL SCHEMA
-- Version: 2.0 (Professional Rewrite)
-- 
-- Run this ENTIRE script in Supabase Dashboard → SQL Editor → New Query
-- Safe to re-run: uses IF NOT EXISTS and ON CONFLICT DO NOTHING
--
-- Includes:
--   1. Tables (sellers, buyers, products, sales_journal, inquiries, company_product_sales)
--   2. Analytics View
--   3. Performance Indexes
--   4. Row Level Security (RLS) Policies
--   5. Storage Bucket for Product Images
--   6. Initial Seed Data
-- =====================================================================


-- =====================================================================
-- STEP 0: ENABLE REQUIRED EXTENSIONS
-- =====================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- =====================================================================
-- STEP 1: CREATE TABLES
-- =====================================================================

-- -----------------------------------------------------------------
-- 1A. SELLERS (Registered Manufacturers & Wholesalers)
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sellers (
  id                      TEXT PRIMARY KEY,
  company_name            TEXT NOT NULL,
  contact_person          TEXT,
  email                   TEXT,
  phone                   TEXT DEFAULT '9779821863885',
  location                TEXT DEFAULT 'Nepal',
  pan_gst                 TEXT DEFAULT 'N/A',
  category                TEXT DEFAULT 'General Wholesaler',
  status                  TEXT DEFAULT 'Pending Verification'
                          CHECK (status IN ('Verified', 'Pending Verification')),
  total_products          INTEGER DEFAULT 0,
  joined_date             DATE DEFAULT CURRENT_DATE,
  -- Admin-only confidential review fields
  admin_rating            INTEGER DEFAULT 5 CHECK (admin_rating BETWEEN 1 AND 5),
  admin_tag               TEXT DEFAULT 'Verified Supplier',
  admin_review            TEXT,
  admin_review_updated_at DATE DEFAULT CURRENT_DATE,
  created_at              TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- -----------------------------------------------------------------
-- 1B. BUYERS (Registered Wholesale Buyers)
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.buyers (
  id                      TEXT PRIMARY KEY,
  name                    TEXT NOT NULL,
  email                   TEXT,
  phone                   TEXT DEFAULT '9779821863885',
  location                TEXT DEFAULT 'Nepal',
  interest                TEXT DEFAULT 'General Sourcing',
  inquiries_sent          INTEGER DEFAULT 0,
  joined_date             DATE DEFAULT CURRENT_DATE,
  -- Admin-only confidential review fields
  admin_rating            INTEGER DEFAULT 5 CHECK (admin_rating BETWEEN 1 AND 5),
  admin_tag               TEXT DEFAULT 'Genuine & Active Buyer',
  admin_review            TEXT,
  admin_review_updated_at DATE DEFAULT CURRENT_DATE,
  created_at              TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- -----------------------------------------------------------------
-- 1C. PRODUCTS (Master Wholesale Catalog)
--     seller_id is nullable FK to sellers — allows products from
--     unregistered sellers or when seller is deleted
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id                TEXT PRIMARY KEY,
  seller_id         TEXT REFERENCES public.sellers(id) ON DELETE SET NULL,
  seller_name       TEXT,
  seller_phone      TEXT DEFAULT '9779821863885',
  seller_location   TEXT DEFAULT 'Nepal',
  name              TEXT NOT NULL,
  description       TEXT,
  price             NUMERIC(12,2) NOT NULL DEFAULT 0,
  unit              TEXT DEFAULT 'Piece',
  moq               TEXT DEFAULT '1 Piece',
  category          TEXT NOT NULL,
  subcategory       TEXT,
  image_url         TEXT,
  images            TEXT[],                           -- Array of image URLs
  specifications    JSONB DEFAULT '[]'::JSONB,        -- [{key, value}, ...]
  is_approved       BOOLEAN DEFAULT FALSE,
  views             INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- -----------------------------------------------------------------
-- 1D. SALES JOURNAL (Seller Wholesale Sales Ledger & Shipment Tracking)
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sales_journal (
  id                      TEXT PRIMARY KEY,
  date                    DATE DEFAULT CURRENT_DATE,
  seller_id               TEXT REFERENCES public.sellers(id) ON DELETE SET NULL,
  seller_name             TEXT NOT NULL,
  buyer_name              TEXT NOT NULL,
  product_name            TEXT NOT NULL,
  category                TEXT DEFAULT 'General',
  quantity                NUMERIC(10,2) DEFAULT 1,
  unit                    TEXT DEFAULT 'Pcs',
  price_per_unit          NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_amount            NUMERIC(12,2) NOT NULL DEFAULT 0,
  payment_status          TEXT DEFAULT 'Paid / Completed',
  delivery_status         TEXT DEFAULT 'Dispatched',
  -- Shipment tracking fields
  shipment_status         TEXT DEFAULT 'Dispatched',
  current_location        TEXT DEFAULT 'Central Logistics Hub',
  estimated_delivery_days TEXT DEFAULT '2-3 Days',
  tracking_number         TEXT DEFAULT 'WS-SHIP-9821',
  courier_partner         TEXT DEFAULT 'Express Cargo Nepal',
  created_at              TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Migration: add shipment columns if table already existed without them
ALTER TABLE public.sales_journal ADD COLUMN IF NOT EXISTS shipment_status         TEXT DEFAULT 'Dispatched';
ALTER TABLE public.sales_journal ADD COLUMN IF NOT EXISTS current_location        TEXT DEFAULT 'Central Logistics Hub';
ALTER TABLE public.sales_journal ADD COLUMN IF NOT EXISTS estimated_delivery_days TEXT DEFAULT '2-3 Days';
ALTER TABLE public.sales_journal ADD COLUMN IF NOT EXISTS tracking_number         TEXT DEFAULT 'WS-SHIP-9821';
ALTER TABLE public.sales_journal ADD COLUMN IF NOT EXISTS courier_partner         TEXT DEFAULT 'Express Cargo Nepal';

-- -----------------------------------------------------------------
-- 1E. INQUIRIES (WhatsApp Trade Sourcing Leads)
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inquiries (
  id               TEXT PRIMARY KEY,
  buyer_name       TEXT NOT NULL,
  product_name     TEXT NOT NULL,
  seller_name      TEXT NOT NULL,
  target_qty       TEXT DEFAULT '1 Unit',
  estimated_value  NUMERIC(12,2) DEFAULT 0,
  status           TEXT DEFAULT 'Converted / Direct WhatsApp',
  date             DATE DEFAULT CURRENT_DATE,
  created_at       TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- -----------------------------------------------------------------
-- 1F. COMPANY PRODUCT SALES (Aggregated Sales Analytics)
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.company_product_sales (
  id                TEXT PRIMARY KEY,
  seller_id         TEXT REFERENCES public.sellers(id) ON DELETE SET NULL,
  seller_name       TEXT NOT NULL,
  product_name      TEXT NOT NULL,
  category          TEXT DEFAULT 'General',
  total_units_sold  NUMERIC(12,2) DEFAULT 0,
  unit              TEXT DEFAULT 'Pcs',
  price_per_unit    NUMERIC(12,2) DEFAULT 0,
  total_revenue_rs  NUMERIC(14,2) DEFAULT 0,
  orders_count      INTEGER DEFAULT 0,
  last_sale_date    DATE DEFAULT CURRENT_DATE,
  created_at        TIMESTAMPTZ DEFAULT timezone('utc', now())
);


-- =====================================================================
-- STEP 2: ANALYTICS VIEW
-- =====================================================================
CREATE OR REPLACE VIEW public.vw_company_product_sales_analytics AS
SELECT
  j.seller_id,
  j.seller_name,
  s.contact_person,
  s.phone          AS seller_phone,
  s.location       AS seller_location,
  s.status         AS seller_status,
  s.admin_rating,
  s.admin_tag,
  s.admin_review,
  j.product_name,
  j.category,
  SUM(j.quantity)       AS total_units_sold,
  MAX(j.unit)           AS unit,
  AVG(j.price_per_unit) AS avg_price_per_unit,
  SUM(j.total_amount)   AS total_revenue_rs,
  COUNT(j.id)           AS orders_count,
  MAX(j.date)           AS last_sale_date
FROM public.sales_journal j
LEFT JOIN public.sellers s ON j.seller_id = s.id
GROUP BY
  j.seller_id, j.seller_name,
  s.contact_person, s.phone, s.location, s.status,
  s.admin_rating, s.admin_tag, s.admin_review,
  j.product_name, j.category;


-- =====================================================================
-- STEP 3: PERFORMANCE INDEXES
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_products_category  ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_approved  ON public.products(is_approved);
CREATE INDEX IF NOT EXISTS idx_products_seller    ON public.products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_created   ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_journal_seller     ON public.sales_journal(seller_id);
CREATE INDEX IF NOT EXISTS idx_journal_date       ON public.sales_journal(date DESC);
CREATE INDEX IF NOT EXISTS idx_sellers_status     ON public.sellers(status);
CREATE INDEX IF NOT EXISTS idx_sellers_email      ON public.sellers(email);
CREATE INDEX IF NOT EXISTS idx_buyers_email       ON public.buyers(email);
CREATE INDEX IF NOT EXISTS idx_cps_seller         ON public.company_product_sales(seller_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_date     ON public.inquiries(date DESC);


-- =====================================================================
-- STEP 4: ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

-- Enable RLS on all tables
ALTER TABLE public.sellers              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyers               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_journal        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_product_sales ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (safe cleanup for re-runs)
DO $$ 
DECLARE
  _tbl TEXT;
  _pol RECORD;
BEGIN
  FOR _tbl IN SELECT unnest(ARRAY[
    'sellers', 'buyers', 'products', 'sales_journal', 'inquiries', 'company_product_sales'
  ])
  LOOP
    FOR _pol IN 
      SELECT policyname FROM pg_policies WHERE tablename = _tbl AND schemaname = 'public'
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', _pol.policyname, _tbl);
    END LOOP;
  END LOOP;
END $$;

-- PUBLIC READ: anyone can read all tables (anon key)
CREATE POLICY "public_read_sellers"     ON public.sellers              FOR SELECT USING (true);
CREATE POLICY "public_read_buyers"      ON public.buyers               FOR SELECT USING (true);
CREATE POLICY "public_read_products"    ON public.products             FOR SELECT USING (true);
CREATE POLICY "public_read_journal"     ON public.sales_journal        FOR SELECT USING (true);
CREATE POLICY "public_read_inquiries"   ON public.inquiries            FOR SELECT USING (true);
CREATE POLICY "public_read_cps"         ON public.company_product_sales FOR SELECT USING (true);

-- INSERT: anyone can insert (app handles auth logic)
CREATE POLICY "public_insert_sellers"   ON public.sellers              FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_buyers"    ON public.buyers               FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_products"  ON public.products             FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_journal"   ON public.sales_journal        FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_inquiries" ON public.inquiries            FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_cps"       ON public.company_product_sales FOR INSERT WITH CHECK (true);

-- UPDATE: anyone can update
CREATE POLICY "public_update_sellers"   ON public.sellers              FOR UPDATE USING (true);
CREATE POLICY "public_update_buyers"    ON public.buyers               FOR UPDATE USING (true);
CREATE POLICY "public_update_products"  ON public.products             FOR UPDATE USING (true);
CREATE POLICY "public_update_journal"   ON public.sales_journal        FOR UPDATE USING (true);
CREATE POLICY "public_update_inquiries" ON public.inquiries            FOR UPDATE USING (true);
CREATE POLICY "public_update_cps"       ON public.company_product_sales FOR UPDATE USING (true);

-- DELETE: anyone can delete
CREATE POLICY "public_delete_sellers"   ON public.sellers              FOR DELETE USING (true);
CREATE POLICY "public_delete_buyers"    ON public.buyers               FOR DELETE USING (true);
CREATE POLICY "public_delete_products"  ON public.products             FOR DELETE USING (true);
CREATE POLICY "public_delete_journal"   ON public.sales_journal        FOR DELETE USING (true);
CREATE POLICY "public_delete_inquiries" ON public.inquiries            FOR DELETE USING (true);
CREATE POLICY "public_delete_cps"       ON public.company_product_sales FOR DELETE USING (true);


-- =====================================================================
-- STEP 5: STORAGE BUCKET FOR PRODUCT IMAGES
-- =====================================================================

-- Create 'product-images' public bucket (max 10MB, images only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  10485760,   -- 10 MB max file size
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Drop existing storage policies for clean re-run
DO $$
DECLARE
  _pol RECORD;
BEGIN
  FOR _pol IN 
    SELECT policyname FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage'
    AND policyname LIKE '%product%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', _pol.policyname);
  END LOOP;
END $$;

-- Storage: anyone can READ images (public bucket)
CREATE POLICY "product_images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Storage: anyone can UPLOAD images (anon key upload)
CREATE POLICY "product_images_public_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images');

-- Storage: anyone can UPDATE images
CREATE POLICY "product_images_public_update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images');

-- Storage: anyone can DELETE images
CREATE POLICY "product_images_public_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images');


-- =====================================================================
-- STEP 6: INITIAL SEED DATA
-- =====================================================================

-- -----------------------------------------------------------------
-- 6A. Seed Sellers
-- -----------------------------------------------------------------
INSERT INTO public.sellers (
  id, company_name, contact_person, email, phone, location,
  pan_gst, category, status, total_products, joined_date,
  admin_rating, admin_tag, admin_review, admin_review_updated_at
) VALUES
  (
    'seller-101',
    'Apex Industrial Machines Pvt Ltd',
    'Rajesh Kumar Agarwal',
    'contact@apexindustrial.com',
    '9779821863885',
    'Kathmandu / Delhi',
    'PAN-300492811',
    'Industrial Machinery',
    'Verified',
    2,
    '2026-06-15',
    5,
    'Highly Reliable / Top Seller',
    'Excellent product quality and prompt dispatch. Highly trusted manufacturer in Nepal/India region.',
    '2026-07-20'
  ),
  (
    'seller-105',
    'MedTech Surgical & Hospital Supplies',
    'Dr. Bishal Shrestha',
    'sales@medtechsurgical.np',
    '9779821863885',
    'Kathmandu, Nepal',
    'PAN-601948203',
    'Medical & Healthcare',
    'Verified',
    1,
    '2026-07-01',
    5,
    'Verified Supplier',
    'Medical certified items, clear invoicing, zero buyer complaints reported.',
    '2026-07-21'
  ),
  (
    'seller-102',
    'Himalayan Herbal & Spices Export',
    'Sunita Gurung',
    'info@himalayanherbal.com',
    '9779821863885',
    'Pokhara, Nepal',
    'PAN-409182745',
    'Agriculture & Food',
    'Verified',
    1,
    '2026-07-05',
    4,
    'Verified Supplier',
    'Good quality organic herbs, occasionally takes 24 hours to confirm export orders.',
    '2026-07-15'
  ),
  (
    'seller-103',
    'NextGen Electronics Wholesalers',
    'Vikram Mehta',
    'sales@nextgenelectronics.in',
    '9779821863885',
    'Mumbai, India',
    'GSTIN-27AAAAA0000A1Z5',
    'Electronics & Solar',
    'Pending Verification',
    1,
    '2026-07-18',
    3,
    'Needs Monitoring',
    'Newly listed wholesaler, GSTIN tax document verification in progress.',
    '2026-07-19'
  )
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------
-- 6B. Seed Buyers
-- -----------------------------------------------------------------
INSERT INTO public.buyers (
  id, name, email, phone, location, interest,
  inquiries_sent, joined_date,
  admin_rating, admin_tag, admin_review, admin_review_updated_at
) VALUES
  (
    'buyer-201',
    'Ramesh Thapa (Prabhu Trading House)',
    'ramesh@prabhutrading.com',
    '9779841000111',
    'Biratnagar, Nepal',
    'Industrial Machinery & Packaging',
    8,
    '2026-06-20',
    5,
    'VIP High Volume Buyer',
    'High volume wholesale buyer. Always executes bulk orders with prompt bank transfer payments.',
    '2026-07-22'
  ),
  (
    'buyer-202',
    'Avishek Sharma (Hospitech Nepal)',
    'avishek@hospitech.np',
    '9779802223344',
    'Lalitpur, Nepal',
    'Medical Syringes & Surgical Disposables',
    14,
    '2026-07-02',
    5,
    'Genuine & Active Buyer',
    'Very active medical supply purchaser, fast responses to seller quotes.',
    '2026-07-23'
  ),
  (
    'buyer-203',
    'Suman Joshi (Himalayan Agro Trading)',
    'suman.joshi@agrotrade.np',
    '9779851122334',
    'Butwal, Nepal',
    'Large Cardamom & Organic Herbs',
    5,
    '2026-07-10',
    4,
    'Genuine & Active Buyer',
    'Reliable agro buyer, sends clear specs and MOQ expectations.',
    '2026-07-18'
  )
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------
-- 6C. Seed Products
-- -----------------------------------------------------------------
INSERT INTO public.products (
  id, seller_id, seller_name, seller_phone, seller_location,
  name, description, price, unit, moq,
  category, subcategory, image_url, images, specifications,
  is_approved, views, created_at
) VALUES
  (
    'prod-001',
    'seller-101',
    'Apex Industrial Machines Pvt Ltd',
    '9779821863885',
    'Kathmandu / Delhi',
    'Automatic Hydraulic Paper Cup Making Machine 90pcs/min',
    'Heavy duty high speed paper cup manufacturing unit with ultrasound sealing, automatic oil lubrication, and micro-computer touch screen controller.',
    485000, 'Set', '1 Set',
    'Industrial Machinery',
    'Paper Converting & Packaging Machinery',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80'
    ],
    '[{"key":"Production Capacity","value":"85-95 pcs/min"},{"key":"Paper Thickness","value":"170-350 gsm"},{"key":"Power Rating","value":"3.5 kW (3 Phase)"},{"key":"Cup Size Range","value":"2 oz - 16 oz"}]'::JSONB,
    true, 342, '2026-07-20T10:00:00Z'
  ),
  (
    'prod-002',
    'seller-105',
    'MedTech Surgical & Hospital Supplies',
    '9779821863885',
    'Kathmandu, Nepal',
    'Disposable Sterile Syringe with Needle (Luer Lock 5ml & 2ml)',
    'Medical grade 3-part disposable hypodermic syringes with ultra-sharp siliconized stainless steel needle. EO Gas Sterilized, non-toxic, non-pyrogenic.',
    18, 'Piece', '1,000 Pieces',
    'Medical & Healthcare',
    'Surgical Disposables & Syringes',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80'
    ],
    '[{"key":"Syringe Type","value":"Luer Lock (3-Piece)"},{"key":"Capacity","value":"5ml & 2ml Available"},{"key":"Needle Gauge","value":"21G x 1.5 Inch"},{"key":"Material","value":"Medical Grade Polypropylene"},{"key":"Sterilization","value":"EO Gas Sterilized (ISO 13485)"}]'::JSONB,
    true, 480, '2026-07-21T14:20:00Z'
  ),
  (
    'prod-003',
    'seller-102',
    'Himalayan Herbal & Spices Export',
    '9779821863885',
    'Pokhara, Nepal',
    'Bulk Organic Large Cardamom (Elaichi) Grade A',
    'Sun-dried high altitude premium large cardamom seeds. Direct farm source, lab tested for purity & aroma content. Moisture < 10%.',
    1250, 'Kg', '100 Kg',
    'Agriculture & Food',
    'Spices & Himalayan Condiments',
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'
    ],
    '[{"key":"Variety","value":"Ramsai / Golshai Grade A"},{"key":"Moisture Level","value":"< 9.5%"},{"key":"Origin","value":"Ilam / Sankhuwasabha, Nepal"}]'::JSONB,
    true, 215, '2026-07-22T08:15:00Z'
  ),
  (
    'prod-004',
    'seller-103',
    'NextGen Electronics Wholesalers',
    '9779821863885',
    'Mumbai, India',
    'Smart IoT Solar Charge Controller 60A MPPT',
    '12V/24V/48V auto-sensing maximum power point tracking solar controller with Wi-Fi monitoring app & LCD screen.',
    4200, 'Piece', '25 Pieces',
    'Electronics & Solar',
    'Solar Energy Inverters & Controllers',
    'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80'
    ],
    '[{"key":"Max Current","value":"60A MPPT"},{"key":"System Voltage","value":"12V / 24V / 48V Auto"},{"key":"Efficiency","value":"98.5%"}]'::JSONB,
    true, 180, '2026-07-22T14:45:00Z'
  )
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------
-- 6D. Seed Sales Journal Entries
-- -----------------------------------------------------------------
INSERT INTO public.sales_journal (
  id, date, seller_id, seller_name, buyer_name,
  product_name, category, quantity, unit,
  price_per_unit, total_amount, payment_status, delivery_status
) VALUES
  (
    'JRN-2026-8001', '2026-07-22',
    'seller-105', 'MedTech Surgical & Hospital Supplies',
    'Avishek Sharma (Hospitech Nepal)',
    'Disposable Sterile Syringe with Needle',
    'Medical & Healthcare',
    50000, 'Pcs', 18, 900000,
    'Paid / Completed', 'Delivered'
  ),
  (
    'JRN-2026-8002', '2026-07-21',
    'seller-101', 'Apex Industrial Machines Pvt Ltd',
    'Ramesh Thapa (Prabhu Trading)',
    'Automatic Hydraulic Paper Cup Machine',
    'Industrial Machinery',
    1, 'Set', 485000, 485000,
    'Paid / Completed', 'Dispatched'
  ),
  (
    'JRN-2026-8003', '2026-07-18',
    'seller-102', 'Himalayan Herbal & Spices Export',
    'Suman Joshi (Himalayan Agro)',
    'Bulk Organic Large Cardamom Grade A',
    'Agriculture & Food',
    250, 'Kg', 1250, 312500,
    'Paid / Completed', 'Delivered'
  ),
  (
    'JRN-2026-8004', '2026-07-15',
    'seller-103', 'NextGen Electronics Wholesalers',
    'Avishek Sharma (Hospitech Nepal)',
    'Smart IoT Solar Charge Controller 60A MPPT',
    'Electronics & Solar',
    50, 'Pcs', 4200, 210000,
    'Paid / Completed', 'Delivered'
  )
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------
-- 6E. Seed WhatsApp Inquiry Leads
-- -----------------------------------------------------------------
INSERT INTO public.inquiries (
  id, buyer_name, product_name, seller_name,
  target_qty, estimated_value, status, date
) VALUES
  (
    'inq-901',
    'Avishek Sharma',
    'Disposable Sterile Syringe Luer Lock 5ml',
    'MedTech Surgical & Hospital Supplies',
    '50,000 Pcs', 900000,
    'Converted / Direct WhatsApp', '2026-07-22'
  ),
  (
    'inq-902',
    'Ramesh Thapa',
    'Automatic Hydraulic Paper Cup Machine 90pcs/min',
    'Apex Industrial Machines Pvt Ltd',
    '1 Set Unit', 485000,
    'Quotation Sent', '2026-07-23'
  ),
  (
    'inq-903',
    'Suman Joshi',
    'Bulk Organic Large Cardamom Grade A',
    'Himalayan Herbal & Spices Export',
    '200 Kg Bulk', 250000,
    'Negotiation Active', '2026-07-23'
  )
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------
-- 6F. Seed Company Product Sales Aggregates
-- -----------------------------------------------------------------
INSERT INTO public.company_product_sales (
  id, seller_id, seller_name, product_name, category,
  total_units_sold, unit, price_per_unit,
  total_revenue_rs, orders_count, last_sale_date
) VALUES
  (
    'cps-001', 'seller-105',
    'MedTech Surgical & Hospital Supplies',
    'Disposable Sterile Syringe with Needle',
    'Medical & Healthcare',
    50000, 'Pcs', 18, 900000, 1, '2026-07-22'
  ),
  (
    'cps-002', 'seller-101',
    'Apex Industrial Machines Pvt Ltd',
    'Automatic Hydraulic Paper Cup Machine',
    'Industrial Machinery',
    1, 'Set', 485000, 485000, 1, '2026-07-21'
  ),
  (
    'cps-003', 'seller-102',
    'Himalayan Herbal & Spices Export',
    'Bulk Organic Large Cardamom Grade A',
    'Agriculture & Food',
    250, 'Kg', 1250, 312500, 1, '2026-07-18'
  ),
  (
    'cps-004', 'seller-103',
    'NextGen Electronics Wholesalers',
    'Smart IoT Solar Charge Controller 60A MPPT',
    'Electronics & Solar',
    50, 'Pcs', 4200, 210000, 1, '2026-07-15'
  )
ON CONFLICT (id) DO NOTHING;


-- =====================================================================
-- ✅ DONE! All tables, policies, storage bucket, and seed data created.
-- 
-- NEXT STEPS:
--   1. Copy your Anon Public Key from: Project Settings → API
--   2. Paste it in your app's .env file as VITE_SUPABASE_ANON_KEY
--   3. Or paste it in the Supabase Settings modal in the app
--   4. Click "Test Supabase Connection" to verify everything works
-- =====================================================================
