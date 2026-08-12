import { Link } from 'react-router-dom';
import { ChevronRight, Gauge } from 'lucide-react';
import type { TruckWithImages } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { formatJPY } from '@/lib/format';
import { StatusBadge } from '@/components/ui/StatusBadge';

export function TruckCard({ truck }: { truck: TruckWithImages }) {
  const { lang, t } = useLanguage();
  const images = truck.truck_images || [];
  const featuredImage = images.find((img) => img.is_featured) || images[0];
  const imageUrl = featuredImage?.image_url;
  const description = lang === 'ja' ? truck.description_ja : truck.description_en;

  return (
    <Link
      to={`/trucks/${truck.slug}`}
      className="group block bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
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

      <div className="p-5">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-red">
            {truck.make}
          </span>
          <span className="text-xs text-neutral-400">{truck.year}</span>
        </div>

        <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-brand-red transition-colors">
          {truck.model}
          {truck.model_number && (
            <span className="text-sm font-normal text-neutral-500 ml-1.5">{truck.model_number}</span>
          )}
        </h3>

        {description && (
          <p className="text-sm text-neutral-500 line-clamp-2 mb-3">{description}</p>
        )}

        <div className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
          <Gauge className="w-4 h-4" />
          <span>{truck.mileage || '—'}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
          <div>
            <span className="text-xs text-neutral-400 block">{t('価格', 'Price')}</span>
            <span className="text-lg font-bold text-neutral-900">
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
