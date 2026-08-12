import { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';
import { LoadingState } from '@/components/ui/Loading';
import type { SiteContent } from '@/types';

interface ContentGroup {
  label: string;
  keys: { key: string; label: string }[];
}

const contentGroups: ContentGroup[] = [
  {
    label: 'Homepage Hero',
    keys: [
      { key: 'hero_title', label: 'Hero Title' },
      { key: 'hero_subtitle', label: 'Hero Subtitle' },
      { key: 'hero_cta_primary', label: 'Primary CTA Button' },
      { key: 'hero_cta_secondary', label: 'Secondary CTA Button' },
    ],
  },
  {
    label: 'About Section',
    keys: [
      { key: 'about_title', label: 'About Title' },
      { key: 'about_intro', label: 'About Introduction' },
      { key: 'about_story', label: 'About Story' },
      { key: 'about_mission', label: 'Mission Statement' },
      { key: 'values_title', label: 'Values Title' },
      { key: 'values_quality_ja', label: 'Value: Quality' },
      { key: 'values_trust_ja', label: 'Value: Trust' },
      { key: 'values_expertise_ja', label: 'Value: Expertise' },
    ],
  },
  {
    label: 'Why Choose Us',
    keys: [
      { key: 'why_title', label: 'Section Title' },
      { key: 'why_1_title', label: 'Item 1 Title' },
      { key: 'why_1_desc', label: 'Item 1 Description' },
      { key: 'why_2_title', label: 'Item 2 Title' },
      { key: 'why_2_desc', label: 'Item 2 Description' },
      { key: 'why_3_title', label: 'Item 3 Title' },
      { key: 'why_3_desc', label: 'Item 3 Description' },
      { key: 'why_4_title', label: 'Item 4 Title' },
      { key: 'why_4_desc', label: 'Item 4 Description' },
    ],
  },
  {
    label: 'Services',
    keys: [
      { key: 'services_title', label: 'Services Title' },
      { key: 'services_intro', label: 'Services Intro' },
      { key: 'service_1_title', label: 'Service 1 Title' },
      { key: 'service_1_desc', label: 'Service 1 Description' },
      { key: 'service_2_title', label: 'Service 2 Title' },
      { key: 'service_2_desc', label: 'Service 2 Description' },
      { key: 'service_3_title', label: 'Service 3 Title' },
      { key: 'service_3_desc', label: 'Service 3 Description' },
      { key: 'service_4_title', label: 'Service 4 Title' },
      { key: 'service_4_desc', label: 'Service 4 Description' },
    ],
  },
  {
    label: 'Contact Section',
    keys: [
      { key: 'contact_title', label: 'Contact Title' },
      { key: 'contact_intro', label: 'Contact Intro' },
      { key: 'contact_line_title', label: 'LINE Title' },
      { key: 'contact_line_desc', label: 'LINE Description' },
    ],
  },
  {
    label: 'CTA Section',
    keys: [
      { key: 'cta_title', label: 'CTA Title' },
      { key: 'cta_desc', label: 'CTA Description' },
    ],
  },
];

export function AdminContentPage() {
  const { showToast } = useToast();
  const [contentMap, setContentMap] = useState<Record<string, SiteContent>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Record<string, { ja: string; en: string }>>({});

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('site_content').select('*');
      const map: Record<string, SiteContent> = {};
      (data || []).forEach((item) => {
        map[(item as SiteContent).key] = item as SiteContent;
      });
      setContentMap(map);
      setLoading(false);
    }
    load();
  }, []);

  const getEditingValue = (key: string) => {
    if (editing[key]) return editing[key];
    const content = contentMap[key];
    return {
      ja: content?.value_ja || '',
      en: content?.value_en || '',
    };
  };

  const handleChange = (key: string, lang: 'ja' | 'en', value: string) => {
    setEditing((prev) => ({
      ...prev,
      [key]: { ...getEditingValue(key), [lang]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    for (const [key, values] of Object.entries(editing)) {
      const existing = contentMap[key];
      if (existing) {
        await supabase
          .from('site_content')
          .update({ value_ja: values.ja, value_en: values.en })
          .eq('id', existing.id);
      } else {
        await supabase.from('site_content').insert({
          key,
          value_ja: values.ja,
          value_en: values.en,
        });
      }
    }
    setSaving(false);
    setEditing({});
    showToast('Content saved successfully', 'success');

    // Reload
    const { data } = await supabase.from('site_content').select('*');
    const map: Record<string, SiteContent> = {};
    (data || []).forEach((item) => {
      map[(item as SiteContent).key] = item as SiteContent;
    });
    setContentMap(map);
  };

  if (loading) return <LoadingState message="Loading content..." />;

  const hasChanges = Object.keys(editing).length > 0;
  const inputClass = 'w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red';

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Website Content</h1>
          <p className="text-sm text-neutral-500 mt-1">Edit bilingual text shown across the public website.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-red text-white text-sm font-semibold hover:bg-brand-red-dark transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        {contentGroups.map((group) => (
          <div key={group.label} className="bg-white border border-neutral-200 p-5 md:p-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-4">{group.label}</h2>
            <div className="space-y-4">
              {group.keys.map((field) => {
                const value = getEditingValue(field.key);
                const isLong = field.label.includes('Description') || field.label.includes('Story') || field.label.includes('Intro') || field.label.includes('Subtitle') || field.label.includes('Mission');
                return (
                  <div key={field.key} className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 mb-1">
                        {field.label} <span className="text-brand-red">(JA)</span>
                      </label>
                      {isLong ? (
                        <textarea
                          rows={3}
                          className={inputClass}
                          value={value.ja}
                          onChange={(e) => handleChange(field.key, 'ja', e.target.value)}
                        />
                      ) : (
                        <input
                          className={inputClass}
                          value={value.ja}
                          onChange={(e) => handleChange(field.key, 'ja', e.target.value)}
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 mb-1">
                        {field.label} <span className="text-brand-red">(EN)</span>
                      </label>
                      {isLong ? (
                        <textarea
                          rows={3}
                          className={inputClass}
                          value={value.en}
                          onChange={(e) => handleChange(field.key, 'en', e.target.value)}
                        />
                      ) : (
                        <input
                          className={inputClass}
                          value={value.en}
                          onChange={(e) => handleChange(field.key, 'en', e.target.value)}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {hasChanges && (
        <div className="sticky bottom-4 mt-6 bg-white border border-neutral-200 shadow-lg p-4 flex items-center justify-between">
          <span className="text-sm text-neutral-600">
            {Object.keys(editing).length} unsaved {Object.keys(editing).length === 1 ? 'change' : 'changes'}
          </span>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-red text-white text-sm font-semibold hover:bg-brand-red-dark transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save All'}
          </button>
        </div>
      )}
    </div>
  );
}
