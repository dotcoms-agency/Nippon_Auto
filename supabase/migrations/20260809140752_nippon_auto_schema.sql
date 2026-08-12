/*
# Nippon Auto — Complete Dealership Platform Schema

## Overview
Creates the full data model for a premium Japanese truck dealership with a bilingual
public website and a CMS admin dashboard.

## New Tables
1. `trucks` — Inventory of trucks with bilingual descriptions, specs, pricing, and status.
2. `truck_images` — Multiple images per truck with ordering and a featured flag.
3. `enquiries` — Customer contact form submissions, optionally tied to a truck.
4. `site_content` — Key-value bilingual editable content blocks for the public website.
5. `site_settings` — Single-row company settings (phone, email, address, LINE URL, socials).

## Authentication
- Uses Supabase Auth (auth.users). Admin accounts are created via Supabase Auth sign-up.
- RLS: public read for published trucks/images/content/settings; write restricted to authenticated.
- Enquiries: public can INSERT (customers submitting forms); only authenticated can SELECT/UPDATE/DELETE.

## Notes
- `slug` on trucks is unique and used for SEO-friendly URLs (/trucks/:slug).
- `site_settings` is managed as a single row at the application layer.
- All timestamps default to now().
*/

-- ============ trucks ============
CREATE TABLE IF NOT EXISTS trucks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  make text NOT NULL,
  model text NOT NULL,
  model_number text,
  year integer,
  price_jpy bigint,
  mileage text,
  engine text,
  fuel_type text,
  transmission text,
  dimensions text,
  load_capacity text,
  body_type text,
  drive_type text,
  video_url text,
  description_ja text,
  description_en text,
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available','reserved','sold')),
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE trucks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_trucks" ON trucks;
CREATE POLICY "public_read_trucks" ON trucks FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_trucks" ON trucks;
CREATE POLICY "auth_insert_trucks" ON trucks FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_trucks" ON trucks;
CREATE POLICY "auth_update_trucks" ON trucks FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_trucks" ON trucks;
CREATE POLICY "auth_delete_trucks" ON trucks FOR DELETE
  TO authenticated USING (true);

-- ============ truck_images ============
CREATE TABLE IF NOT EXISTS truck_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  truck_id uuid NOT NULL REFERENCES trucks(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text,
  is_featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE truck_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_truck_images" ON truck_images;
CREATE POLICY "public_read_truck_images" ON truck_images FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_truck_images" ON truck_images;
CREATE POLICY "auth_insert_truck_images" ON truck_images FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_truck_images" ON truck_images;
CREATE POLICY "auth_update_truck_images" ON truck_images FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_truck_images" ON truck_images;
CREATE POLICY "auth_delete_truck_images" ON truck_images FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_truck_images_truck_id ON truck_images(truck_id);

-- ============ enquiries ============
CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text,
  truck_id uuid REFERENCES trucks(id) ON DELETE SET NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Public can submit enquiries (contact form)
DROP POLICY IF EXISTS "public_insert_enquiries" ON enquiries;
CREATE POLICY "public_insert_enquiries" ON enquiries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Only authenticated (admin) can read/update/delete enquiries
DROP POLICY IF EXISTS "auth_select_enquiries" ON enquiries;
CREATE POLICY "auth_select_enquiries" ON enquiries FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_enquiries" ON enquiries;
CREATE POLICY "auth_update_enquiries" ON enquiries FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_enquiries" ON enquiries;
CREATE POLICY "auth_delete_enquiries" ON enquiries FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at DESC);

-- ============ site_content ============
-- Key-value bilingual content blocks for editable website text
CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value_ja text,
  value_en text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_content" ON site_content;
CREATE POLICY "public_read_site_content" ON site_content FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_site_content" ON site_content;
CREATE POLICY "auth_insert_site_content" ON site_content FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_site_content" ON site_content;
CREATE POLICY "auth_update_site_content" ON site_content FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_site_content" ON site_content;
CREATE POLICY "auth_delete_site_content" ON site_content FOR DELETE
  TO authenticated USING (true);

-- ============ site_settings ============
-- Company settings (managed as single row at app layer)
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL DEFAULT 'Nippon Auto',
  company_name_ja text NOT NULL DEFAULT 'ニッポンオート',
  logo_url text,
  phone text,
  email text,
  address text,
  address_ja text,
  business_hours text,
  business_hours_ja text,
  line_url text,
  facebook_url text,
  instagram_url text,
  twitter_url text,
  youtube_url text,
  map_embed_url text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_settings" ON site_settings;
CREATE POLICY "public_read_site_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_site_settings" ON site_settings;
CREATE POLICY "auth_insert_site_settings" ON site_settings FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_site_settings" ON site_settings;
CREATE POLICY "auth_update_site_settings" ON site_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_site_settings" ON site_settings;
CREATE POLICY "auth_delete_site_settings" ON site_settings FOR DELETE
  TO authenticated USING (true);

-- ============ updated_at triggers ============
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trucks_updated_at ON trucks;
CREATE TRIGGER trucks_updated_at BEFORE UPDATE ON trucks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS site_content_updated_at ON site_content;
CREATE TRIGGER site_content_updated_at BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS site_settings_updated_at ON site_settings;
CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============ Storage bucket for truck images ============
INSERT INTO storage.buckets (id, name, public)
VALUES ('truck-images', 'truck-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, authenticated write
DROP POLICY IF EXISTS "public_read_truck_images_storage" ON storage.objects;
CREATE POLICY "public_read_truck_images_storage" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'truck-images');

DROP POLICY IF EXISTS "auth_insert_truck_images_storage" ON storage.objects;
CREATE POLICY "auth_insert_truck_images_storage" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'truck-images');

DROP POLICY IF EXISTS "auth_update_truck_images_storage" ON storage.objects;
CREATE POLICY "auth_update_truck_images_storage" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'truck-images') WITH CHECK (bucket_id = 'truck-images');

DROP POLICY IF EXISTS "auth_delete_truck_images_storage" ON storage.objects;
CREATE POLICY "auth_delete_truck_images_storage" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'truck-images');
