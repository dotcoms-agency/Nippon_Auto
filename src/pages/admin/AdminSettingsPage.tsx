import { useState, useEffect } from 'react';
import { Save, Loader2, Upload, Building2, Phone, Mail, MapPin, Clock, MessageCircle, Link2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';
import { LoadingState } from '@/components/ui/Loading';
import type { SiteSettings } from '@/types';

export function AdminSettingsPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<Partial<SiteSettings>>({});

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();
      const s = data as SiteSettings | null;
      setSettings(s);
      setForm(s || {});
      setLoading(false);
    }
    load();
  }, []);

  const handleChange = (field: keyof SiteSettings, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    if (settings) {
      const { error } = await supabase.from('site_settings').update(form).eq('id', settings.id);
      setSaving(false);
      if (error) {
        showToast('Failed to save settings', 'error');
      } else {
        showToast('Settings saved successfully', 'success');
      }
    } else {
      const { data, error } = await supabase.from('site_settings').insert(form).select('*').limit(1).maybeSingle();
      setSaving(false);
      if (error) {
        showToast('Failed to save settings', 'error');
      } else {
        setSettings(data as SiteSettings);
        showToast('Settings created successfully', 'success');
      }
    }
  };

  const handleLogoUpload = async (file: File) => {
    if (!settings) return;
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `logo-${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('truck-images').upload(fileName, file);
    if (uploadError) {
      showToast('Failed to upload logo', 'error');
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from('truck-images').getPublicUrl(fileName);
    handleChange('logo_url', urlData.publicUrl);
    await supabase.from('site_settings').update({ logo_url: urlData.publicUrl }).eq('id', settings.id);
    setUploading(false);
    showToast('Logo uploaded', 'success');
  };

  if (loading) return <LoadingState message="Loading settings..." />;

  const inputClass = 'w-full px-4 py-2.5 border border-neutral-200 text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red';
  const labelClass = 'block text-sm font-medium text-neutral-700 mb-1.5';
  const sectionClass = 'bg-white border border-neutral-200 p-5 md:p-6';

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
          <p className="text-sm text-neutral-500 mt-1">Company information and website configuration.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-red text-white text-sm font-semibold hover:bg-brand-red-dark transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Logo */}
        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-red" /> Company Logo
          </h2>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 border border-neutral-200 bg-neutral-50 flex items-center justify-center flex-shrink-0">
              {form.logo_url ? (
                <img src={form.logo_url} alt="Logo" className="w-full h-full object-contain p-2" />
              ) : (
                <span className="text-xs text-neutral-400">No logo</span>
              )}
            </div>
            <div>
              <label className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? 'Uploading...' : 'Upload Logo'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
                />
              </label>
              <p className="text-xs text-neutral-400 mt-2">PNG or JPG, recommended 240x80px</p>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-red" /> Company Information
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Company Name (English)</label>
              <input className={inputClass} value={form.company_name || ''} onChange={(e) => handleChange('company_name', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Company Name (Japanese)</label>
              <input className={inputClass} value={form.company_name_ja || ''} onChange={(e) => handleChange('company_name_ja', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-brand-red" /> Contact Information
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Phone</label>
              <input className={inputClass} value={form.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} placeholder="+81-3-1234-5678" />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input className={inputClass} value={form.email || ''} onChange={(e) => handleChange('email', e.target.value)} placeholder="info@nipponauto.jp" />
            </div>
            <div>
              <label className={labelClass}>Address (English)</label>
              <input className={inputClass} value={form.address || ''} onChange={(e) => handleChange('address', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Address (Japanese)</label>
              <input className={inputClass} value={form.address_ja || ''} onChange={(e) => handleChange('address_ja', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Business Hours (English)</label>
              <input className={inputClass} value={form.business_hours || ''} onChange={(e) => handleChange('business_hours', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Business Hours (Japanese)</label>
              <input className={inputClass} value={form.business_hours_ja || ''} onChange={(e) => handleChange('business_hours_ja', e.target.value)} />
            </div>
          </div>
        </div>

        {/* LINE & Social */}
        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-brand-red" /> LINE & Social Media
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>LINE URL</label>
              <input className={inputClass} value={form.line_url || ''} onChange={(e) => handleChange('line_url', e.target.value)} placeholder="https://line.me/ti/p/@..." />
            </div>
            <div>
              <label className={labelClass}>Facebook URL</label>
              <input className={inputClass} value={form.facebook_url || ''} onChange={(e) => handleChange('facebook_url', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Instagram URL</label>
              <input className={inputClass} value={form.instagram_url || ''} onChange={(e) => handleChange('instagram_url', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Twitter / X URL</label>
              <input className={inputClass} value={form.twitter_url || ''} onChange={(e) => handleChange('twitter_url', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>YouTube URL</label>
              <input className={inputClass} value={form.youtube_url || ''} onChange={(e) => handleChange('youtube_url', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Map */}
        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-red" /> Map Embed
          </h2>
          <div>
            <label className={labelClass}>Google Maps Embed URL</label>
            <textarea
              rows={3}
              className={inputClass}
              value={form.map_embed_url || ''}
              onChange={(e) => handleChange('map_embed_url', e.target.value)}
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
            <p className="text-xs text-neutral-400 mt-1">Paste the embed URL from Google Maps → Share → Embed a map.</p>
          </div>
        </div>

        {/* Save bar */}
        <div className="flex items-center justify-end gap-3 pb-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-red text-white text-sm font-semibold hover:bg-brand-red-dark transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
