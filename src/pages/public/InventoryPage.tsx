import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Truck as TruckIcon } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useTrucks } from '@/hooks/useData';
import { useSEO } from '@/hooks/useSEO';
import { TruckCard } from '@/components/TruckCard';
import { LoadingState, SkeletonCard, EmptyState } from '@/components/ui/Loading';

export function InventoryPage() {
  const { lang, t } = useLanguage();
  const { trucks, loading, error } = useTrucks();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    setQuery(searchParams.get('search') || '');
  }, [searchParams]);

  useSEO({
    title: lang === 'ja' ? 'トラック一覧' : 'Truck Inventory',
    description: lang === 'ja'
      ? 'ニッポンオートのトラック在庫一覧。いすゞ、日野、三菱ふそう、UDトラックス。'
      : 'Browse our full inventory of premium Japanese trucks from Isuzu, Hino, Mitsubishi Fuso, and UD Trucks.',
  });

  const filtered = useMemo(() => {
    if (!query.trim()) return trucks;
    const q = query.toLowerCase().trim();
    return trucks.filter((truck) => {
      const searchText = `${truck.make} ${truck.model} ${truck.model_number || ''} ${truck.year || ''} ${truck.body_type || ''} ${truck.fuel_type || ''}`.toLowerCase();
      return searchText.includes(q);
    });
  }, [trucks, query]);

  return (
    <div>
      {/* Page header */}
      <div className="bg-neutral-900 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <nav className="text-xs text-neutral-400 mb-3">
            <span>Nippon Auto</span> <span className="mx-1">/</span>{' '}
            <span className="text-white">{t('トラック', 'Trucks')}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold">{t('トラック在庫', 'Truck Inventory')}</h1>
          <p className="text-neutral-400 mt-3 max-w-2xl">
            {t('厳選されたプレミアム日本製トラックをご覧ください。', 'Browse our carefully selected premium Japanese trucks.')}
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div className="sticky top-16 md:top-20 z-30 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSearchParams(e.target.value ? { search: e.target.value } : {}); }}
              placeholder={t('トラックを検索...', 'Search trucks...')}
              className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
            />
          </div>
        </div>
      </div>

      {/* Truck grid */}
      <div className="py-10 md:py-16 bg-neutral-50 min-h-[400px]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <LoadingState message={t('データを読み込めませんでした', 'Unable to load data')} />
          ) : filtered.length > 0 ? (
            <>
              <p className="text-sm text-neutral-500 mb-6">
                {filtered.length} {t('件のトラック', 'trucks found')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((truck) => (
                  <TruckCard key={truck.id} truck={truck} />
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              title={t('新しいトラックが近日公開', 'New trucks coming soon')}
              message={t('只今、新しい在庫を準備中です。しばらくお待ちください。', 'We are currently preparing new inventory. Please check back soon.')}
              icon={<TruckIcon className="w-12 h-12 text-neutral-300" />}
            />
          )}
        </div>
      </div>
    </div>
  );
}
