export type TruckStatus = 'available' | 'reserved' | 'sold';

export interface Truck {
  id: string;
  slug: string;
  make: string;
  model: string;
  model_number: string | null;
  year: number | null;
  price_jpy: number | null;
  mileage: string | null;
  engine: string | null;
  fuel_type: string | null;
  transmission: string | null;
  dimensions: string | null;
  load_capacity: string | null;
  body_type: string | null;
  drive_type: string | null;
  video_url: string | null;
  description_ja: string | null;
  description_en: string | null;
  status: TruckStatus;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TruckImage {
  id: string;
  truck_id: string;
  image_url: string;
  alt_text: string | null;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface TruckWithImages extends Truck {
  truck_images: TruckImage[];
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  truck_id: string | null;
  is_read: boolean;
  created_at: string;
  trucks?: Pick<Truck, 'id' | 'make' | 'model' | 'year' | 'slug'> | null;
}

export interface SiteContent {
  id: string;
  key: string;
  value_ja: string | null;
  value_en: string | null;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  company_name: string;
  company_name_ja: string;
  logo_url: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  address_ja: string | null;
  business_hours: string | null;
  business_hours_ja: string | null;
  line_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  youtube_url: string | null;
  map_embed_url: string | null;
  hero_image_url: string | null;
  about_image_url: string | null;
  cta_image_url: string | null;
  updated_at: string;
}
