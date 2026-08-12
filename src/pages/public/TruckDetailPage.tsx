import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, ZoomIn, X, Gauge, Fuel, Cog,
  Ruler, Package, Car, Settings2, Calendar, Tag, MessageCircle,
  Mail, ArrowRight, Play,
} from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useTruck, useRelatedTrucks } from '@/hooks/useData';
import { useSEO } from '@/hooks/useSEO';
import { formatJPY, getYouTubeEmbedUrl } from '@/lib/format';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LinkButton, Button } from '@/components/ui/Button';
import { LineButton } from '@/components/ui/LineButton';
import { LoadingState, EmptyState } from '@/components/ui/Loading';
import { TruckCard } from '@/components/TruckCard';

export function TruckDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { lang, t } = useLanguage();
  const { truck, loading, error } = useTruck(slug);
  const { trucks: related } = useRelatedTrucks(truck?.id, 3);

  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const description = lang === 'ja' ? truck?.description_ja : truck?.description_en;
  const images = truck?.truck_images || [];
  const sortedImages = [...images].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    return a.sort_order - b.sort_order;
  });

  const videoEmbedUrl = truck?.video_url ? getYouTubeEmbedUrl(truck.video_url) : null;

  useSEO({
    title: truck ? `${truck.make} ${truck.model} ${truck.year || ''}` : 'Truck Details',
    description: description || undefined,
    image: sortedImages[0]?.image_url,
  });

  if (loading) return <LoadingState message={t('トラック情報を読み込み中...', 'Loading truck details...')} />;
  if (error) return <LoadingState message={t('エラーが発生しました', 'An error occurred')} />;
  if (!truck) return <Navigate to="/404" replace />;

  const specs = [
    { icon: Calendar, label: t('年式', 'Year'), value: truck.year?.toString() },
    { icon: Gauge, label: t('走行距離', 'Mileage'), value: truck.mileage },
    { icon: Settings2, label: t('エンジン', 'Engine'), value: truck.engine },
    { icon: Fuel, label: t('燃料', 'Fuel Type'), value: truck.fuel_type },
    { icon: Cog, label: t('ミッション', 'Transmission'), value: truck.transmission },
    { icon: Ruler, label: t('寸法', 'Dimensions'), value: truck.dimensions },
    { icon: Package, label: t('積載量', 'Load Capacity'), value: truck.load_capacity },
    { icon: Car, label: t('ボディ', 'Body Type'), value: truck.body_type },
    { icon: Tag, label: t('駆動方式', 'Drive Type'), value: truck.drive_type },
  ].filter((s) => s.value);

  const navigateImage = (dir: number) => {
    setActiveImage((prev) => {
      const next = prev + dir;
      if (next < 0) return sortedImages.length - 1;
      if (next >= sortedImages.length) return 0;
      return next;
    });
  };

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-neutral-50 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <nav className="text-xs text-neutral-500 flex items-center gap-1.5 flex-wrap">
            <Link to="/" className="hover:text-brand-red">Nippon Auto</Link>
            <span>/</span>
            <Link to="/trucks" className="hover:text-brand-red">{t('トラック', 'Trucks')}</Link>
            <span>/</span>
            <span className="text-neutral-900">{truck.make} {truck.model}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div>
            <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden group">
              {sortedImages[activeImage] ? (
                <img
                  src={sortedImages[activeImage].image_url}
                  alt={`${truck.make} ${truck.model}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-300">
                  <span>{t('画像なし', 'No image')}</span>
                </div>
              )}

              {sortedImages.length > 1 && (
                <>
                  <button
                    onClick={() => navigateImage(-1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
                    aria-label={t('前の画像', 'Previous image')}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigateImage(1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
                    aria-label={t('次の画像', 'Next image')}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 hover:bg-white flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
                aria-label={t('拡大表示', 'Zoom image')}
              >
                <ZoomIn className="w-5 h-5" />
              </button>

              <div className="absolute top-3 left-3">
                <StatusBadge status={truck.status} />
              </div>
            </div>

            {/* Thumbnails */}
            {sortedImages.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {sortedImages.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 overflow-hidden border-2 transition-all ${
                      idx === activeImage ? 'border-brand-red' : 'border-transparent hover:border-neutral-300'
                    }`}
                  >
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-baseline justify-between gap-3 mb-2">
              <span className="text-sm font-semibold uppercase tracking-wider text-brand-red">{truck.make}</span>
              {truck.model_number && (
                <span className="text-xs text-neutral-400">{t('型番', 'Model No.')} {truck.model_number}</span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">
              {truck.model}
            </h1>

            <div className="flex items-center gap-3 mt-3 text-sm text-neutral-500">
              <span>{truck.year}</span>
              <span className="w-1 h-1 bg-neutral-300 rounded-full" />
              <span>{truck.mileage}</span>
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-100">
              <span className="text-sm text-neutral-400 block">{t('価格', 'Price')}</span>
              <span className="text-4xl font-bold text-neutral-900">{formatJPY(truck.price_jpy)}</span>
            </div>

            {/* Key specs */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-neutral-100">
              {specs.slice(0, 4).map((spec, idx) => {
                const Icon = spec.icon;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-neutral-600" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs text-neutral-400 block">{spec.label}</span>
                      <span className="text-sm font-semibold text-neutral-900 truncate block">{spec.value}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTAs */}
            <div className="mt-8 space-y-3">
              <LinkButton to={`/contact?truck=${truck.slug}`} size="lg" className="w-full">
                <Mail className="w-5 h-5" />
                {t('このトラックについて問い合わせ', 'Enquire About This Truck')}
              </LinkButton>
              <LineButton size="lg" className="w-full" />
            </div>
          </div>
        </div>

        {/* Detailed specs */}
        <div className="mt-12 md:mt-16">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">{t('詳細スペック', 'Detailed Specifications')}</h2>
          <div className="border border-neutral-200 overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {specs.map((spec, idx) => {
                  const Icon = spec.icon;
                  return (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-neutral-50' : 'bg-white'}>
                      <td className="py-3.5 px-4 md:px-6 w-1/2">
                        <div className="flex items-center gap-2.5 text-neutral-500">
                          <Icon className="w-4 h-4" />
                          {spec.label}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 md:px-6 font-semibold text-neutral-900">{spec.value}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Description */}
        {description && (
          <div className="mt-12 md:mt-16">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">{t('説明', 'Description')}</h2>
            <p className="text-neutral-600 leading-relaxed whitespace-pre-line">{description}</p>
          </div>
        )}

        {/* Video */}
        {videoEmbedUrl && (
          <div className="mt-12 md:mt-16">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">{t('動画', 'Video')}</h2>
            {!showVideo ? (
              <button
                onClick={() => setShowVideo(true)}
                className="relative w-full aspect-video bg-neutral-900 flex items-center justify-center group overflow-hidden"
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                <div className="relative flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-brand-red group-hover:scale-110 transition-transform rounded-full flex items-center justify-center">
                    <Play className="w-7 h-7 text-white ml-1" fill="white" />
                  </div>
                  <span className="text-white font-semibold">{t('動画を再生', 'Play Video')}</span>
                </div>
              </button>
            ) : (
              <div className="aspect-video">
                <iframe
                  src={videoEmbedUrl}
                  title={`${truck.make} ${truck.model} video`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-12 md:mt-16 bg-neutral-900 text-white p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            {t('このトラックに興味がありますか？', 'Interested in this truck?')}
          </h2>
          <p className="text-neutral-400 mb-6 max-w-xl mx-auto">
            {t('お気軽にお問い合わせください。専門スタッフが対応いたします。', 'Get in touch with us. Our expert staff is ready to assist you.')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <LinkButton to={`/contact?truck=${truck.slug}`} variant="primary" size="lg">
              <Mail className="w-5 h-5" />
              {t('お問い合わせ', 'Enquire Now')}
            </LinkButton>
            <LineButton size="lg" />
          </div>
        </div>

        {/* Related trucks */}
        {related.length > 0 && (
          <div className="mt-16 md:mt-20">
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-2xl font-bold text-neutral-900">{t('その他のトラック', 'Other Trucks')}</h2>
              <Link to="/trucks" className="text-sm font-semibold text-brand-red hover:gap-2 inline-flex items-center gap-1 transition-all">
                {t('すべて見る', 'View All')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((t) => (
                <TruckCard key={t.id} truck={t} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && sortedImages[activeImage] && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center text-white hover:text-brand-red-light transition-colors"
            onClick={() => setLightboxOpen(false)}
            aria-label={t('閉じる', 'Close')}
          >
            <X className="w-8 h-8" />
          </button>

          {sortedImages.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white hover:text-brand-red-light transition-colors"
                onClick={(e) => { e.stopPropagation(); navigateImage(-1); }}
                aria-label={t('前の画像', 'Previous image')}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white hover:text-brand-red-light transition-colors"
                onClick={(e) => { e.stopPropagation(); navigateImage(1); }}
                aria-label={t('次の画像', 'Next image')}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          <img
            src={sortedImages[activeImage].image_url}
            alt={`${truck.make} ${truck.model}`}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {activeImage + 1} / {sortedImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
