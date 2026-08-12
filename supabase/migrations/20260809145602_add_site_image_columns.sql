/*
# CMS-managed site images

Adds three image URL columns to site_settings so the admin can
upload replacement images for the homepage hero, about section,
and CTA background without editing code.

Also seeds the footer_description content keys in site_content
so the footer description becomes CMS-editable.
*/

ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS hero_image_url text,
  ADD COLUMN IF NOT EXISTS about_image_url text,
  ADD COLUMN IF NOT EXISTS cta_image_url text;

INSERT INTO site_content (key, value_ja, value_en) VALUES
  ('footer_description',
   'プレミアム日本製トラックの専門ディーラー。品質と信頼を全世界にお届けします。',
   'Your trusted dealer for premium Japanese trucks. Delivering quality and reliability worldwide.')
ON CONFLICT (key) DO NOTHING;
