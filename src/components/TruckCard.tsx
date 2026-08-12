import { Link } from 'react-router-dom';
import { ChevronRight, Gauge, Fuel, Settings, Cog } from 'lucide-react';
import type { TruckWithImages } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { formatJPY } from '@/lib/format';
import { StatusBadge } from '@/components/ui/StatusBadge';

export function TruckCard({ truck }: { truck: TruckWithImages }) {
  const { lang, t } = useLanguage();
  const images = truck.truck_images || [];
  const featuredImage = images.find((img) => img.is_featured) || images[0];
  const imageUrl = featuredImage?.image_url;

  const specs = [
    { icon: Gauge, label: t('走行距離', 'Mileage'), value: truck.mileage || '—' },
    { icon: Cog, label: t('エンジン', 'Engine'), value: truck.engine || '—' },
    { icon: Fuel, label: t('燃料', 'Fuel'), value: truck.fuel_type || '—' },
    { icon: Settings, label: t('ミッション', 'Transmission'), value: truck.transmission || '—' },
  ];

  return (
    <Link
      to={`/trucks/${truck.slug}`}
      className="group block bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${truck.make} ${truck.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300">
            <span className="text-sm">{t('画像なし', 'No image')}</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <StatusBadge status={truck.status} size="sm" />
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-red">
            {truck.make}
          </span>
          <span className="text-xs text-neutral-400 font-medium">{truck.year || '—'}</span>
        </div>

        <h3 className="text-lg font-bold text-neutral-900 mb-3 group-hover:text-brand-red transition-colors leading-snug">
          {truck.model}
          {truck.model_number && (
            <span className="text-sm font-normal text-neutral-500 ml-1.5">{truck.model_number}</span>
          )}
        </h3>

        {/* Compact spec grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 pb-4 border-b border-neutral-100">
          {specs.map((spec, idx) => {
            const Icon = spec.icon;
            return (
              <div key={idx} className="flex items-center gap-1.5 text-xs">
                <Icon className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                <span className="text-neutral-500">{spec.value}</span>
              </div>
            );
          })}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
              {t('価格', 'Price')}
            </span>
            <span className="text-xl font-bold text-neutral-900">
              {formatJPY(truck.price_jpy)}
            </span>
          </div>
          <span className="inline-flex items-center text-sm font-semibold text-brand-red group-hover:gap-2 transition-all">
            {t('詳細を見る', 'View Details')}
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
