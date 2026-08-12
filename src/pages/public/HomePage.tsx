import { FormEvent, useMemo, useState } from 'react';
import { ArrowUpRight, ChevronRight, CircleCheck, Headphones, HeartHandshake, Search, ShieldCheck, Truck, Wrench } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useSiteSettings, useTrucks } from '@/hooks/useData';
import { useSEO } from '@/hooks/useSEO';
import { formatJPY } from '@/lib/format';
import type { TruckWithImages } from '@/types';
import { EmptyState, SkeletonCard } from '@/components/ui/Loading';

const HERO_IMAGE = 'https://images.pexels.com/photos/38199714/pexels-photo-38199714.jpeg?auto=compress&cs=tinysrgb&w=2200&h=1400';
const FLEET_IMAGE = 'https://images.pexels.com/photos/35602229/pexels-photo-35602229.jpeg?auto=compress&cs=tinysrgb&w=2200&h=1100';
const CATEGORY_IMAGES = [
  'https://images.pexels.com/photos/4481325/pexels-photo-4481325.jpeg?auto=compress&cs=tinysrgb&w=900&h=1100',
  'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=900&h=1100',
  'https://images.pexels.com/photos/14206821/pexels-photo-14206821.jpeg?auto=compress&cs=tinysrgb&w=900&h=1100',
  'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=900&h=1100',
];

interface SearchFilters {
  make: string;
  model: string;
  year: string;
  price: string;
}

interface Category {
  title: string;
  query: string;
  image: string;
}

const categories: Category[] = [
  { title: 'Light Duty', query: 'light', image: CATEGORY_IMAGES[0] },
  { title: 'Medium Duty', query: 'medium', image: CATEGORY_IMAGES[1] },
  { title: 'Heavy Duty', query: 'heavy', image: CATEGORY_IMAGES[2] },
  { title: 'Commercial Vehicles', query: 'commercial', image: CATEGORY_IMAGES[3] },
];

const trustItems = [
  { icon: ShieldCheck, title: 'Japanese Quality', description: 'Rigorous inspections ensure top tier performance and reliability.' },
  { icon: CircleCheck, title: 'Verified Vehicles', description: 'Complete history and maintenance records provided.' },
  { icon: HeartHandshake, title: 'Transparent Process', description: 'Clear pricing with no hidden fees or surprise costs.' },
  { icon: Headphones, title: 'Professional Support', description: 'Expert assistance from selection to final delivery.' },
];

function getTruckImage(truck: TruckWithImages): string | undefined {
  const featuredImage = truck.truck_images?.find((image) => image.is_featured) || truck.truck_images?.[0];
  return featuredImage?.image_url;
}

function HomeTruckCard({ truck }: { truck: TruckWithImages }) {
  const { t } = useLanguage();
  const imageUrl = getTruckImage(truck);

  return (
    <Link to={`/trucks/${truck.slug}`} className="group rounded-md bg-white p-2.5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[1.35] overflow-hidden rounded-sm bg-neutral-100">
        {imageUrl ? (
          <img src={imageUrl} alt={`${truck.make} ${truck.model}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-neutral-400">{t('画像なし', 'No image')}</div>
        )}
      </div>
      <div className="px-1 pb-1 pt-3">
        <h3 className="truncate text-[11px] font-bold text-neutral-900">{truck.make} {truck.model}</h3>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold text-neutral-800">{formatJPY(truck.price_jpy)}</span>
          <span className="rounded-full border border-neutral-200 px-2 py-1 text-[9px] font-medium text-neutral-600 group-hover:border-brand-red group-hover:text-brand-red">{t('詳細', 'View Details')}</span>
        </div>
      </div>
    </Link>
  );
}

export function HomePage() {
  const { lang, t } = useLanguage();
  const { settings } = useSiteSettings();
  const { trucks, loading, error } = useTrucks();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<SearchFilters>({ make: '', model: '', year: '', price: '' });
  const heroImage = settings?.hero_image_url || HERO_IMAGE;
  const fleetImage = settings?.cta_image_url || FLEET_IMAGE;
  const featuredTrucks = useMemo(() => trucks.slice(0, 4), [trucks]);
  const makes = useMemo(() => Array.from(new Set(trucks.map((truck) => truck.make).filter(Boolean))), [trucks]);
  const models = useMemo(() => Array.from(new Set(trucks.map((truck) => truck.model).filter(Boolean))), [trucks]);

  useSEO({
    title: lang === 'ja' ? 'ニッポンオート | 日本製トラック' : 'Nippon Auto | Quality Japanese Trucks',
    description: lang === 'ja' ? '厳選された日本製トラックを世界へお届けします。' : 'Quality Japanese trucks built to move your business forward.',
    image: heroImage,
  });

  const updateFilter = (key: keyof SearchFilters, value: string): void => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const terms = Object.values(filters).filter(Boolean).join(' ');
    navigate(terms ? `/trucks?search=${encodeURIComponent(terms)}` : '/trucks');
  };

  return (
    <div className="bg-white text-neutral-950">
      <section className="relative min-h-[380px] overflow-visible bg-neutral-900 md:min-h-[500px]">
        <img src={heroImage} alt="Japanese truck at a port" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/10" />
        <div className="relative mx-auto flex min-h-[380px] max-w-[1320px] items-center px-5 pb-20 pt-14 md:min-h-[500px] md:px-10 md:pb-24">
          <div className="max-w-[580px] text-white">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white/85">Japanese Trucks • Premium Quality</p>
            <h1 className="max-w-xl text-4xl font-extrabold leading-[0.98] tracking-[-0.04em] md:text-6xl">Quality Japanese Trucks<br />Built to Move Business.</h1>
            <p className="mt-5 max-w-md text-xs leading-5 text-white/80 md:text-sm">Explore carefully selected Japanese trucks built for performance, reliability, and long-term value.</p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link to="/trucks" className="inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-3 text-[10px] font-bold uppercase tracking-wide text-white transition hover:bg-brand-red-dark">{t('トラックを見る', 'Explore Trucks')}<ArrowUpRight className="h-3.5 w-3.5" /></Link>
              <Link to="/contact" className="inline-flex items-center rounded-full border border-white/70 px-5 py-3 text-[10px] font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-neutral-900">{t('お問い合わせ', 'Contact Us')}</Link>
            </div>
          </div>
        </div>

        <form onSubmit={submitSearch} className="absolute bottom-0 left-1/2 z-10 grid w-[calc(100%-32px)] max-w-[1160px] -translate-x-1/2 translate-y-1/2 grid-cols-2 gap-2 rounded-xl bg-white p-4 shadow-xl md:grid-cols-[1fr_1fr_1fr_1fr_auto] md:gap-3 md:p-5">
          {[
            { key: 'make' as const, label: 'MAKE', placeholder: 'All Makes', options: makes },
            { key: 'model' as const, label: 'MODEL', placeholder: 'All Models', options: models },
            { key: 'year' as const, label: 'YEAR', placeholder: 'Any Year', options: ['2025', '2024', '2023', '2022', '2021'] },
            { key: 'price' as const, label: 'PRICE', placeholder: 'Any Price', options: ['Under ¥5M', '¥5M - ¥10M', 'Over ¥10M'] },
          ].map((field) => (
            <label key={field.key} className="min-w-0">
              <span className="mb-1 block text-[8px] font-bold uppercase tracking-wider text-neutral-500">{field.label}</span>
              <select value={filters[field.key]} onChange={(event) => updateFilter(field.key, event.target.value)} className="w-full border-0 border-b border-neutral-200 bg-white px-0 pb-2 text-[11px] text-neutral-700 outline-none focus:border-brand-red">
                <option value="">{field.placeholder}</option>
                {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
          ))}
          <button type="submit" className="col-span-2 inline-flex items-center justify-center gap-2 rounded-full bg-brand-red px-5 py-3 text-[10px] font-bold uppercase tracking-wide text-white transition hover:bg-brand-red-dark md:col-span-1">{t('検索', 'Search Trucks')}<Search className="h-3.5 w-3.5" /></button>
        </form>
      </section>

      <section className="mx-auto max-w-[1320px] px-5 pb-14 pt-24 md:px-10 md:pb-20 md:pt-28">
        <h2 className="text-2xl font-bold tracking-[-0.03em] md:text-3xl">Truck Categories</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {categories.map((category) => (
            <Link key={category.title} to={`/trucks?search=${category.query}`} className="group relative aspect-[0.75] overflow-hidden rounded-md bg-neutral-200">
              <img src={category.image} alt={category.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
              <span className="absolute left-4 top-4 max-w-[110px] text-lg font-bold leading-[1.05] text-white md:text-xl">{category.title}</span>
              <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-900 transition group-hover:bg-brand-red group-hover:text-white"><ArrowUpRight className="h-4 w-4" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-neutral-50 px-5 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-[1320px]">
          <div className="mb-7 flex items-end justify-between"><h2 className="text-2xl font-bold tracking-[-0.03em] md:text-3xl">Featured Trucks</h2><Link to="/trucks" className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-brand-red">View All<ChevronRight className="h-3.5 w-3.5" /></Link></div>
          {loading ? <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">{Array.from({ length: 4 }, (_, index) => <SkeletonCard key={index} />)}</div> : error ? <div className="rounded-md border border-neutral-200 bg-white py-14 text-center text-sm text-neutral-500">{t('在庫を読み込めませんでした。', 'Unable to load inventory right now.')}</div> : featuredTrucks.length > 0 ? <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">{featuredTrucks.map((truck) => <HomeTruckCard key={truck.id} truck={truck} />)}</div> : <EmptyState title={t('新しいトラックが近日公開', 'New trucks coming soon')} message={t('新しい在庫を準備中です。', 'We are currently preparing new inventory.')} />}
        </div>
      </section>

      <section className="bg-neutral-950 px-5 py-10 text-white md:px-10 md:py-12">
        <div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-8 md:grid-cols-4 md:gap-10">
          {trustItems.map((item) => { const Icon = item.icon; return <div key={item.title} className="border-l border-neutral-800 pl-4 md:pl-6"><Icon className="h-5 w-5 text-brand-red" strokeWidth={1.7} /><h3 className="mt-4 text-[11px] font-bold md:text-xs">{item.title}</h3><p className="mt-2 text-[9px] leading-4 text-neutral-400 md:text-[10px]">{item.description}</p></div>; })}
        </div>
      </section>

      <section className="relative min-h-[300px] overflow-hidden bg-neutral-900 md:min-h-[360px]">
        <img src={fleetImage} alt="Fleet of commercial trucks" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        <div className="relative mx-auto flex min-h-[300px] max-w-[1320px] items-center px-5 py-14 text-white md:min-h-[360px] md:px-10"><div><div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-brand-red"><Wrench className="h-3.5 w-3.5" />Premium Fleet Solutions</div><h2 className="max-w-xl text-3xl font-extrabold leading-[1.02] tracking-[-0.04em] md:text-5xl">Upgrade Your Fleet with<br />Confidence</h2><p className="mt-4 text-xs text-white/80">Discover premium commercial vehicles tailored to your business needs.</p><Link to="/trucks" className="mt-6 inline-flex rounded-full bg-brand-red px-5 py-3 text-[10px] font-bold uppercase tracking-wide text-white transition hover:bg-brand-red-dark">Browse Inventory</Link></div></div>
      </section>
    </div>
  );
}
