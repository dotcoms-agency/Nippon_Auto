import { useLanguage } from '@/i18n/LanguageContext';
import type { SiteContent, SiteSettings } from '@/types';

interface ContentMap {
  [key: string]: SiteContent;
}

export function useContent() {
  const { lang } = useLanguage();

  const getContent = (contentMap: ContentMap | undefined, key: string, fallbackJa: string, fallbackEn: string): string => {
    if (!contentMap || !contentMap[key]) {
      return lang === 'ja' ? fallbackJa : fallbackEn;
    }
    const content = contentMap[key];
    const value = lang === 'ja' ? content.value_ja : content.value_en;
    return value || (lang === 'ja' ? fallbackEn : fallbackJa);
  };

  return { getContent };
}

export function getSetting(settings: SiteSettings | null, field: keyof SiteSettings, lang: 'ja' | 'en'): string {
  if (!settings) return '';
  const jaField = `${field as string}_ja` as keyof SiteSettings;
  // @ts-expect-error — dynamic field access for bilingual settings
  const jaValue = settings[jaField];
  const value = settings[field];
  if (lang === 'ja' && jaValue) return String(jaValue);
  if (value) return String(value);
  if (jaValue) return String(jaValue);
  return '';
}
