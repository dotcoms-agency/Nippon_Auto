import type { TruckStatus } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';

interface StatusBadgeProps {
  status: TruckStatus;
  size?: 'sm' | 'md';
}

const statusConfig = {
  available: {
    classes: 'bg-green-50 text-green-700 border-green-200',
    ja: '販売中',
    en: 'Available',
  },
  reserved: {
    classes: 'bg-amber-50 text-amber-700 border-amber-200',
    ja: '予約済み',
    en: 'Reserved',
  },
  sold: {
    classes: 'bg-neutral-100 text-neutral-500 border-neutral-200',
    ja: '販売済み',
    en: 'Sold',
  },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const { lang } = useLanguage();
  const config = statusConfig[status];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-semibold uppercase tracking-wide border ${config.classes} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'available' ? 'bg-green-500' : status === 'reserved' ? 'bg-amber-500' : 'bg-neutral-400'}`} />
      {lang === 'ja' ? config.ja : config.en}
    </span>
  );
}
