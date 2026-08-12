import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Upload, Star, Trash2, X, GripVertical, Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';
import { useTruckImages } from '@/hooks/useData';
import { slugify } from '@/lib/format';
import type { Truck, TruckStatus, TruckImage } from '@/types';

interface FormData {
  slug: string;
  make: string;
  model: string;
  model_number: string;
  year: string;
  price_jpy: string;
  mileage: string;
  engine: string;
  fuel_type: string;
  transmission: string;
  dimensions: string;
  load_capacity: string;
  body_type: string;
  drive_type: string;
  video_url: string;
  description_ja: string;
  description_en: string;
  status: TruckStatus;
  published: boolean;
}

const emptyForm: FormData = {
  slug: '',
  make: '',
  model: '',
  model_number: '',
  year: '',
  price_jpy: '',
  mileage: '',
  engine: '',
  fuel_type: '',
  transmission: '',
  dimensions: '',
  load_capacity: '',
  body_type: '',
  drive_type: '',
  video_url: '',
  description_ja: '',
  description_en: '',
  status: 'available',
  published: true,
};

export function AdminTruckFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { images, refetch: refetchImages } = useTruckImages(id);

  const [form, setForm] = useState<FormData>(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savedTruckId, setSavedTruckId] = useState<string | null>(id || null);

  useEffect(() => {
    if (!isEdit || !id) return;
    async function load() {
      const { data, error } = await supabase
        .from('trucks')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) {
        showToast('Failed to load truck', 'error');
        navigate('/admin/trucks');
        return;
      }
      if (!data) {
        showToast('Truck not found', 'error');
        navigate('/admin/trucks');
        return;
      }
      const truck = data as Truck;
      setForm({
        slug: truck.slug,
        make: truck.make,
        model: truck.model,
        model_number: truck.model_number || '',
        year: truck.year?.toString() || '',
        price_jpy: truck.price_jpy?.toString() || '',
        mileage: truck.mileage || '',
        engine: truck.engine || '',
        fuel_type: truck.fuel_type || '',
        transmission: truck.transmission || '',
        dimensions: truck.dimensions || '',
        load_capacity: truck.load_capacity || '',
        body_type: truck.body_type || '',
        drive_type: truck.drive_type || '',
        video_url: truck.video_url || '',
        description_ja: truck.description_ja || '',
        description_en: truck.description_en || '',
        status: truck.status,
        published: truck.published,
      });
      setLoading(false);
    }
    load();
  }, [id, isEdit, navigate, showToast]);

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.make.trim() || !form.model.trim()) {
      showToast('Make and Model are required', 'error');
      return;
    }

    const slug = form.slug.trim() || slugify(`${form.make}-${form.model}-${form.year}`);

    const payload = {
      slug,
      make: form.make.trim(),
      model: form.model.trim(),
      model_number: form.model_number.trim() || null,
      year: form.year ? parseInt(form.year) : null,
      price_jpy: form.price_jpy ? parseInt(form.price_jpy) : null,
      mileage: form.mileage.trim() || null,
      engine: form.engine.trim() || null,
      fuel_type: form.fuel_type.trim() || null,
      transmission: form.transmission.trim() || null,
      dimensions: form.dimensions.trim() || null,
      load_capacity: form.load_capacity.trim() || null,
      body_type: form.body_type.trim() || null,
      drive_type: form.drive_type.trim() || null,
      video_url: form.video_url.trim() || null,
      description_ja: form.description_ja.trim() || null,
      description_en: form.description_en.trim() || null,
      status: form.status,
      published: form.published,
    };

    setSaving(true);
    if (isEdit && id) {
      const { error } = await supabase.from('trucks').update(payload).eq('id', id);
      setSaving(false);
      if (error) {
        showToast(error.message.includes('duplicate') ? 'Slug already exists. Use a unique slug.' : 'Failed to save truck', 'error');
      } else {
        showToast('Truck updated successfully', 'success');
      }
    } else {
      const { data, error } = await supabase.from('trucks').insert(payload).select('id').maybeSingle();
      setSaving(false);
      if (error) {
        showToast(error.message.includes('duplicate') ? 'Slug already exists. Use a unique slug.' : 'Failed to create truck', 'error');
      } else if (data) {
        showToast('Truck created successfully', 'success');
        navigate(`/admin/trucks/${data.id}/edit`);
      }
    }
  };

  // ============ Image upload ============

  const handleImageUpload = async (files: FileList) => {
    if (!savedTruckId) {
      showToast('Save the truck first before uploading images', 'error');
      return;
    }
    setUploading(true);
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      const fileExt = file.name.split('.').pop();
      const fileName = `${savedTruckId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('truck-images')
        .upload(fileName, file);
      if (uploadError) {
        showToast(`Failed to upload ${file.name}`, 'error');
        continue;
      }
      const { data: urlData } = supabase.storage.from('truck-images').getPublicUrl(fileName);
      const { error: dbError } = await supabase.from('truck_images').insert({
        truck_id: savedTruckId,
        image_url: urlData.publicUrl,
        alt_text: `${form.make} ${form.model}`,
        is_featured: false,
        sort_order: images.length,
      });
      if (dbError) {
        showToast('Failed to save image record', 'error');
      }
    }
    setUploading(false);
    refetchImages();
    showToast('Images uploaded', 'success');
  };

  const setFeaturedImage = async (imageId: string) => {
    // Unset all featured for this truck, then set the target
    await supabase.from('truck_images').update({ is_featured: false }).eq('truck_id', savedTruckId);
    await supabase.from('truck_images').update({ is_featured: true }).eq('id', imageId);
    refetchImages();
    showToast('Featured image updated', 'success');
  };

  const deleteImage = async (image: TruckImage) => {
    // Try to remove from storage (extract path from URL)
    const url = new URL(image.image_url);
    const pathParts = url.pathname.split('/');
    const storagePath = pathParts.slice(pathParts.indexOf('truck-images') + 1).join('/');
    if (storagePath) {
      await supabase.storage.from('truck-images').remove([storagePath]);
    }
    await supabase.from('truck_images').delete().eq('id', image.id);
    refetchImages();
    showToast('Image deleted', 'success');
  };

  const replaceImage = async (image: TruckImage, file: File) => {
    if (!savedTruckId) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error');
      return;
    }
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${savedTruckId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('truck-images')
      .upload(fileName, file);
    if (uploadError) {
      setUploading(false);
      showToast('Failed to upload replacement image. Original image kept.', 'error');
      return;
    }
    const { data: urlData } = supabase.storage.from('truck-images').getPublicUrl(fileName);
    const { error: dbError } = await supabase
      .from('truck_images')
      .update({ image_url: urlData.publicUrl })
      .eq('id', image.id);
    if (dbError) {
      await supabase.storage.from('truck-images').remove([fileName]);
      setUploading(false);
      showToast('Failed to update image record. Original image kept.', 'error');
      return;
    }
    // Remove old image from storage after successful replacement
    try {
      const oldUrl = new URL(image.image_url);
      const oldPathParts = oldUrl.pathname.split('/');
      const oldStoragePath = oldPathParts.slice(oldPathParts.indexOf('truck-images') + 1).join('/');
      if (oldStoragePath) {
        await supabase.storage.from('truck-images').remove([oldStoragePath]);
      }
    } catch {
      // If URL parsing fails, leave old file — no broken records
    }
    setUploading(false);
    refetchImages();
    showToast('Image replaced successfully', 'success');
  };

  const moveImage = async (image: TruckImage, direction: 'up' | 'down') => {
    const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((i) => i.id === image.id);
    if (direction === 'up' && idx > 0) {
      const prev = sorted[idx - 1];
      await Promise.all([
        supabase.from('truck_images').update({ sort_order: prev.sort_order }).eq('id', image.id),
        supabase.from('truck_images').update({ sort_order: image.sort_order }).eq('id', prev.id),
      ]);
    } else if (direction === 'down' && idx < sorted.length - 1) {
      const next = sorted[idx + 1];
      await Promise.all([
        supabase.from('truck_images').update({ sort_order: next.sort_order }).eq('id', image.id),
        supabase.from('truck_images').update({ sort_order: image.sort_order }).eq('id', next.id),
      ]);
    }
    refetchImages();
  };

  const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  const inputClass = 'w-full px-4 py-2.5 border border-neutral-200 text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red';
  const labelClass = 'block text-sm font-medium text-neutral-700 mb-1.5';
  const sectionClass = 'bg-white border border-neutral-200 p-5 md:p-6';

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/admin/trucks')}
          className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-neutral-900">
            {isEdit ? 'Edit Truck' : 'Add New Truck'}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {isEdit ? `${form.make} ${form.model}` : 'Create a new truck listing'}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-red text-white text-sm font-semibold hover:bg-brand-red-dark transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Truck'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Basic Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Make *</label>
              <input className={inputClass} value={form.make} onChange={(e) => handleChange('make', e.target.value)} placeholder="e.g. Isuzu" />
            </div>
            <div>
              <label className={labelClass}>Model *</label>
              <input className={inputClass} value={form.model} onChange={(e) => handleChange('model', e.target.value)} placeholder="e.g. Forward" />
            </div>
            <div>
              <label className={labelClass}>Model Number</label>
              <input className={inputClass} value={form.model_number} onChange={(e) => handleChange('model_number', e.target.value)} placeholder="e.g. FRR90Q" />
            </div>
            <div>
              <label className={labelClass}>Year</label>
              <input className={inputClass} type="number" value={form.year} onChange={(e) => handleChange('year', e.target.value)} placeholder="e.g. 2022" />
            </div>
            <div>
              <label className={labelClass}>Price (JPY)</label>
              <input className={inputClass} type="number" value={form.price_jpy} onChange={(e) => handleChange('price_jpy', e.target.value)} placeholder="e.g. 4800000" />
            </div>
            <div>
              <label className={labelClass}>Mileage</label>
              <input className={inputClass} value={form.mileage} onChange={(e) => handleChange('mileage', e.target.value)} placeholder="e.g. 45,000 km" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>URL Slug</label>
              <input className={inputClass} value={form.slug} onChange={(e) => handleChange('slug', e.target.value)} placeholder="auto-generated from make-model-year" />
              <p className="text-xs text-neutral-400 mt-1">Leave empty to auto-generate. Used in the URL: /trucks/&lt;slug&gt;</p>
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Technical Specifications</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Engine</label>
              <input className={inputClass} value={form.engine} onChange={(e) => handleChange('engine', e.target.value)} placeholder="e.g. 6.0L 6HH1 Diesel" />
            </div>
            <div>
              <label className={labelClass}>Fuel Type</label>
              <input className={inputClass} value={form.fuel_type} onChange={(e) => handleChange('fuel_type', e.target.value)} placeholder="e.g. Diesel" />
            </div>
            <div>
              <label className={labelClass}>Transmission</label>
              <input className={inputClass} value={form.transmission} onChange={(e) => handleChange('transmission', e.target.value)} placeholder="e.g. 6-speed Manual" />
            </div>
            <div>
              <label className={labelClass}>Dimensions</label>
              <input className={inputClass} value={form.dimensions} onChange={(e) => handleChange('dimensions', e.target.value)} placeholder="e.g. 7,990 x 2,490 x 2,780 mm" />
            </div>
          </div>
        </div>

        {/* Truck Specifications */}
        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Truck Specifications</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Load Capacity</label>
              <input className={inputClass} value={form.load_capacity} onChange={(e) => handleChange('load_capacity', e.target.value)} placeholder="e.g. 5,000 kg" />
            </div>
            <div>
              <label className={labelClass}>Body Type</label>
              <input className={inputClass} value={form.body_type} onChange={(e) => handleChange('body_type', e.target.value)} placeholder="e.g. Flatbed" />
            </div>
            <div>
              <label className={labelClass}>Drive Type</label>
              <input className={inputClass} value={form.drive_type} onChange={(e) => handleChange('drive_type', e.target.value)} placeholder="e.g. 4x2" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Bilingual Content</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Description (Japanese)</label>
              <textarea
                rows={4}
                className={inputClass}
                value={form.description_ja}
                onChange={(e) => handleChange('description_ja', e.target.value)}
                placeholder="日本語の説明を入力してください..."
              />
            </div>
            <div>
              <label className={labelClass}>Description (English)</label>
              <textarea
                rows={4}
                className={inputClass}
                value={form.description_en}
                onChange={(e) => handleChange('description_en', e.target.value)}
                placeholder="Enter English description..."
              />
            </div>
          </div>
        </div>

        {/* Media: Images */}
        {isEdit && (
          <div className={sectionClass}>
            <h2 className="text-lg font-bold text-neutral-900 mb-4">Images</h2>

            {/* Upload area */}
            <label className="block border-2 border-dashed border-neutral-300 p-8 text-center cursor-pointer hover:border-brand-red transition-colors mb-4">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
              />
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
                  <span className="text-sm text-neutral-500">Uploading...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-neutral-400" />
                  <span className="text-sm font-medium text-neutral-700">Click to upload images</span>
                  <span className="text-xs text-neutral-400">PNG, JPG, WebP accepted</span>
                </div>
              )}
            </label>

            {/* Image list */}
            {sortedImages.length > 0 ? (
              <div className="space-y-2">
                {sortedImages.map((image, idx) => (
                  <div key={image.id} className="flex items-center gap-3 bg-neutral-50 border border-neutral-200 p-2">
                    <img src={image.image_url} alt={image.alt_text || ''} className="w-16 h-16 object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      {image.is_featured && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-red mb-1">
                          <Star className="w-3 h-3" fill="currentColor" /> Featured
                        </span>
                      )}
                      <p className="text-xs text-neutral-400 truncate">{image.image_url}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveImage(image, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 text-neutral-400 hover:text-neutral-700 disabled:opacity-30"
                        aria-label="Move up"
                      >
                        <GripVertical className="w-4 h-4 rotate-180" />
                      </button>
                      <button
                        onClick={() => moveImage(image, 'down')}
                        disabled={idx === sortedImages.length - 1}
                        className="p-1.5 text-neutral-400 hover:text-neutral-700 disabled:opacity-30"
                        aria-label="Move down"
                      >
                        <GripVertical className="w-4 h-4" />
                      </button>
                      {!image.is_featured && (
                        <button
                          onClick={() => setFeaturedImage(image.id)}
                          className="p-1.5 text-neutral-400 hover:text-brand-red"
                          title="Set as featured"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => document.getElementById(`replace-${image.id}`)?.click()}
                        className="p-1.5 text-neutral-400 hover:text-blue-600"
                        title="Replace image"
                        disabled={uploading}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <input
                        id={`replace-${image.id}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) replaceImage(image, f);
                          e.target.value = '';
                        }}
                      />
                      <button
                        onClick={() => deleteImage(image)}
                        className="p-1.5 text-neutral-400 hover:text-red-600"
                        title="Delete image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-400 text-center py-4">No images uploaded yet.</p>
            )}
          </div>
        )}

        {/* Video */}
        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Video (Optional)</h2>
          <div>
            <label className={labelClass}>YouTube URL</label>
            <input className={inputClass} value={form.video_url} onChange={(e) => handleChange('video_url', e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
            <p className="text-xs text-neutral-400 mt-1">Leave empty if no video. YouTube links are automatically embedded.</p>
          </div>
        </div>

        {/* Status */}
        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Status</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Availability</label>
              <select
                className={inputClass}
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value as TruckStatus)}
              >
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Published</label>
              <div className="flex items-center gap-3 py-2.5">
                <button
                  type="button"
                  onClick={() => handleChange('published', !form.published)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${form.published ? 'bg-brand-red' : 'bg-neutral-300'}`}
                  aria-label="Toggle published"
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${form.published ? 'translate-x-6' : ''}`} />
                </button>
                <span className="text-sm text-neutral-600">
                  {form.published ? 'Visible on website' : 'Hidden from website'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom save bar */}
        <div className="flex items-center justify-end gap-3 pb-4">
          <button
            onClick={() => navigate('/admin/trucks')}
            className="px-5 py-2.5 border border-neutral-200 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-red text-white text-sm font-semibold hover:bg-brand-red-dark transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : isEdit ? 'Update Truck' : 'Create Truck'}
          </button>
        </div>
      </div>
    </div>
  );
}
