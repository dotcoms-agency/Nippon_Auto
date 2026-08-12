import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Truck, TruckImage, TruckWithImages, Enquiry, SiteContent, SiteSettings } from '@/types';

// ============ Trucks ============

export function useTrucks() {
  const [trucks, setTrucks] = useState<TruckWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from('trucks')
        .select('*, truck_images(*)')
        .eq('published', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });
      if (cancelled) return;
      if (error) {
        setError(error.message);
      } else {
        setTrucks((data || []) as TruckWithImages[]);
      }
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return { trucks, loading, error };
}

export function useTruck(slug: string | undefined) {
  const [truck, setTruck] = useState<TruckWithImages | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from('trucks')
        .select('*, truck_images(*)')
        .eq('slug', slug)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        setError(error.message);
      } else {
        setTruck(data as TruckWithImages | null);
      }
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [slug]);

  return { truck, loading, error };
}

export function useRelatedTrucks(currentId: string | undefined, limit = 3) {
  const [trucks, setTrucks] = useState<TruckWithImages[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    async function load() {
      const { data } = await supabase
        .from('trucks')
        .select('*, truck_images(*)')
        .eq('published', true)
        .neq('id', currentId)
        .order('sort_order', { ascending: true })
        .limit(limit);
      if (cancelled) return;
      setTrucks((data || []) as TruckWithImages[]);
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [currentId, limit]);

  return { trucks, loading };
}

// ============ Site Content ============

export function useSiteContent() {
  const [content, setContent] = useState<Record<string, SiteContent>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data } = await supabase.from('site_content').select('*');
      if (cancelled) return;
      const map: Record<string, SiteContent> = {};
      (data || []).forEach((item) => {
        map[item.key] = item as SiteContent;
      });
      setContent(map);
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return { content, loading };
}

// ============ Site Settings ============

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .maybeSingle();
      if (cancelled) return;
      setSettings(data as SiteSettings | null);
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return { settings, loading };
}

// ============ Enquiry Submission ============

export async function submitEnquiry(data: {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  truck_id?: string;
}): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from('enquiries').insert({
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    message: data.message || null,
    truck_id: data.truck_id || null,
  });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ============ Admin: All Trucks (including unpublished) ============

export function useAdminTrucks() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('trucks')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) {
      setError(error.message);
    } else {
      setTrucks((data || []) as Truck[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { trucks, loading, error, refetch };
}

// ============ Admin: Truck images ============

export function useTruckImages(truckId: string | undefined) {
  const [images, setImages] = useState<TruckImage[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!truckId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from('truck_images')
      .select('*')
      .eq('truck_id', truckId)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    setImages((data || []) as TruckImage[]);
    setLoading(false);
  }, [truckId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { images, loading, refetch };
}

// ============ Admin: Enquiries ============

export function useEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('enquiries')
      .select('*, trucks:truck_id(id, make, model, year, slug)')
      .order('created_at', { ascending: false });
    if (error) {
      setError(error.message);
    } else {
      setEnquiries((data || []) as Enquiry[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { enquiries, loading, error, refetch };
}

// ============ Admin: Dashboard stats ============

export function useDashboardStats() {
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    reserved: 0,
    sold: 0,
    totalEnquiries: 0,
    unreadEnquiries: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [trucksRes, enquiriesRes] = await Promise.all([
        supabase.from('trucks').select('status'),
        supabase.from('enquiries').select('is_read'),
      ]);
      const trucks = (trucksRes.data || []) as Pick<Truck, 'status'>[];
      const enquiries = (enquiriesRes.data || []) as Pick<Enquiry, 'is_read'>[];
      setStats({
        total: trucks.length,
        available: trucks.filter((t) => t.status === 'available').length,
        reserved: trucks.filter((t) => t.status === 'reserved').length,
        sold: trucks.filter((t) => t.status === 'sold').length,
        totalEnquiries: enquiries.length,
        unreadEnquiries: enquiries.filter((e) => !e.is_read).length,
      });
      setLoading(false);
    }
    load();
  }, []);

  return { stats, loading };
}
