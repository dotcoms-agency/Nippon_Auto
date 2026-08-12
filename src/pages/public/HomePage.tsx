import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Wrench, Globe, DollarSign, Truck, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useSiteContent, useSiteSettings, useTrucks } from '@/hooks/useData';
import { useContent, getSetting } from '@/i18n/useContent';
import { useSEO } from '@/hooks/useSEO';
import { LinkButton } from '@/components/ui/Button';
import { LineButton } from '@/components/ui/LineButton';
import { TruckCard } from '@/components/TruckCard';
import { LoadingState, SkeletonCard, EmptyState } from '@/components/ui/Loading';

export function HomePage() {
  const { lang, t } = useLanguage();
  const { content } = useSiteContent();
  const { settings } = useSiteSettings();
  const { trucks, loading } = useTrucks();
  const { getContent } = useContent();

  const heroImg = 'https://images.pexels.com/photos/38199714/pexels-photo-38199714.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080';

  useSEO({
    title: lang === 'ja' ? 'ニッポンオート - プレミアム日本製トラック' : 'Premium Japanese Truck Dealership',
    description: lang === 'ja'
      ? 'いすゞ、日野、三菱ふそう、UDトラックス。プレミアム日本製トラックの専門ディーラー。'
      : 'Isuzu, Hino, Mitsubishi Fuso, UD Trucks. Your trusted dealer for premium Japanese trucks.',
    image: heroImg,
  });

  const featuredTrucks = trucks.slice(0, 6);

  const whyItems = [
    { icon: ShieldCheck, key: 'why_1', key_title: 'why_1_title', key_desc: 'why_1_desc' },
    { icon: Wrench, key: 'why_2', key_title: 'why_2_title', key_desc: 'why_2_desc' },
    { icon: Globe, key: 'why_3', key_title: 'why_3_title', key_desc: 'why_3_desc' },
    { icon: DollarSign, key: 'why_4', key_title: 'why_4_title', key_desc: 'why_4_desc' },
  ];

  const services = [
    { icon: Truck, title_key: 'service_1_title', desc_key: 'service_1_desc' },
    { icon: Wrench, title_key: 'service_2_title', desc_key: 'service_2_desc' },
    { icon: Globe, title_key: 'service_3_title', desc_key: 'service_3_desc' },
    { icon: DollarSign, title_key: 'service_4_title', desc_key: 'service_4_desc' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[600px] md:min-h-[680px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Japanese trucks"
            className="w-full h-full object-cover"
            priority="true"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 w-full py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-brand-red/90 px-3 py-1.5 mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-white rounded-full" />
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                {t('プレミアム日本製トラック', 'Premium Japanese Trucks')}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance animate-fade-in-up">
              {getContent(content, 'hero_title', '日本の_precision、トラックの卓越性', 'Japanese Precision. Trucking Excellence.')}
            </h1>

            <p className="text-lg md:text-xl text-neutral-200 mt-6 max-w-xl leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              {getContent(content, 'hero_subtitle', 'プレミアム日本製トラックの専門ディーラー。品質と信頼の結晶。', 'Your trusted dealer for premium Japanese trucks. Where quality meets reliability.')}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <LinkButton to="/trucks" size="lg">
                {getContent(content, 'hero_cta_primary', '在庫を見る', 'Browse Inventory')}
                <ArrowRight className="w-5 h-5" />
              </LinkButton>
              <LinkButton to="/contact" variant="outline" size="lg" className="!border-white !text-white hover:!bg-white hover:!text-neutral-900">
                {getContent(content, 'hero_cta_secondary', 'お問い合わせ', 'Contact Us')}
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* Featured trucks */}
      <section className="py-16 md:py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-sm font-semibold text-brand-red uppercase tracking-wider">
                {t('注目のトラック', 'Featured Trucks')}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mt-2">
                {t('最新在庫', 'Latest Inventory')}
              </h2>
            </div>
            <Link to="/trucks" className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-brand-red hover:gap-2 transition-all">
              {t('すべて見る', 'View All')}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : featuredTrucks.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredTrucks.map((truck) => (
                  <TruckCard key={truck.id} truck={truck} />
                ))}
              </div>
              <div className="mt-10 text-center md:hidden">
                <LinkButton to="/trucks" variant="outline">
                  {t('すべて見る', 'View All Trucks')}
                </LinkButton>
              </div>
            </>
          ) : (
            <EmptyState
              title={t('新しいトラックが近日公開', 'New trucks coming soon')}
              message={t('只今、新しい在庫を準備中です。しばらくお待ちください。', 'We are currently preparing new inventory. Please check back soon.')}
            />
          )}
        </div>
      </section>

      {/* Company intro */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <span className="text-sm font-semibold text-brand-red uppercase tracking-wider">
                {t('会社概要', 'About Us')}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mt-2 mb-6">
                {getContent(content, 'about_title', 'ニッポンオートについて', 'About Nippon Auto')}
              </h2>
              <p className="text-neutral-600 leading-relaxed mb-4">
                {getContent(content, 'about_intro', 'ニッポンオートは、日本の卓越したトラック製造の伝統をお客様にお届けするプレミアムディーラーです。', 'Nippon Auto is a premium dealer bringing the tradition of Japanese truck excellence to our customers.')}
              </p>
              <p className="text-neutral-600 leading-relaxed mb-6">
                {getContent(content, 'about_story', '1995年の創業以来、ニッポンオートは日本最高のトラックメーカーから選び抜かれた車両を提供してきました。', 'Since our founding in 1995, Nippon Auto has provided carefully selected vehicles from Japan\'s finest truck manufacturers.')}
              </p>
              <LinkButton to="/about" variant="outline">
                {t('詳細を見る', 'Learn More')}
                <ArrowRight className="w-4 h-4" />
              </LinkButton>
            </div>

            <div className="relative">
              <img
                src="https://images.pexels.com/photos/4895416/pexels-photo-4895416.jpeg?auto=compress&cs=tinysrgb&w=940&h=700"
                alt="Nippon Auto dealership"
                className="w-full h-[400px] object-cover"
                loading="lazy"
              />
              <div className="absolute -bottom-6 -left-6 bg-brand-red text-white p-6 hidden md:block">
                <span className="text-4xl font-bold block">30+</span>
                <span className="text-sm">{t('年の実績', 'Years of Excellence')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-16 md:py-24 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-sm font-semibold text-brand-red-light uppercase tracking-wider">
              {t('私たちの強み', 'Our Strengths')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              {getContent(content, 'why_title', 'なぜニッポンオートなのか', 'Why Choose Nippon Auto')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-neutral-800 p-6 border border-neutral-700 hover:border-brand-red transition-colors group"
                >
                  <div className="w-12 h-12 bg-brand-red/20 flex items-center justify-center mb-4 group-hover:bg-brand-red transition-colors">
                    <Icon className="w-6 h-6 text-brand-red-light group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {getContent(content, item.key_title, '', '')}
                  </h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    {getContent(content, item.key_desc, '', '')}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-sm font-semibold text-brand-red uppercase tracking-wider">
              {t('サービス', 'Services')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mt-2">
              {getContent(content, 'services_title', 'サービス', 'Our Services')}
            </h2>
            <p className="text-neutral-600 mt-4">
              {getContent(content, 'services_intro', 'ニッポンオートは、トラックの販売から保守まで、総合的なサービスを提供します。', 'Nippon Auto offers comprehensive services from truck sales to maintenance.')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div key={idx} className="border border-neutral-200 p-6 hover:shadow-lg hover:border-brand-red transition-all group">
                  <div className="w-12 h-12 bg-brand-red-50 flex items-center justify-center mb-4 group-hover:bg-brand-red transition-colors">
                    <Icon className="w-6 h-6 text-brand-red group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    {getContent(content, service.title_key, '', '')}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    {getContent(content, service.desc_key, '', '')}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <LinkButton to="/services" variant="outline">
              {t('すべてのサービスを見る', 'View All Services')}
              <ArrowRight className="w-4 h-4" />
            </LinkButton>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/6563903/pexels-photo-6563903.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800"
            alt="Truck on highway"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-red-dark/90 to-brand-red/70" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white text-balance">
            {getContent(content, 'cta_title', '理想的なトラックを見つけましょう', 'Find Your Perfect Truck')}
          </h2>
          <p className="text-lg text-white/90 mt-6 max-w-2xl mx-auto">
            {getContent(content, 'cta_desc', 'ニッポンオートの専門チームが、お客様のニーズに最適なトラックをご提案します。', 'Our expert team will help you find the truck that best fits your needs.')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <LinkButton to="/trucks" variant="secondary" size="lg">
              {t('在庫を見る', 'Browse Trucks')}
              <ArrowRight className="w-5 h-5" />
            </LinkButton>
            <LineButton size="lg" />
          </div>
        </div>
      </section>

      {/* Contact / LINE section */}
      <section className="py-16 md:py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
                {getContent(content, 'contact_line_title', 'LINEでのお問い合わせ', 'Contact via LINE')}
              </h2>
              <p className="text-neutral-600 leading-relaxed mb-6">
                {getContent(content, 'contact_line_desc', 'LINEでもお気軽にお問い合わせいただけます。', 'Feel free to contact us through LINE.')}
              </p>
              <div className="flex flex-wrap gap-3">
                <LineButton size="lg" />
                <LinkButton to="/contact" variant="outline" size="lg">
                  {t('その他のお問い合わせ', 'Other Inquiries')}
                </LinkButton>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 p-8">
              <div className="grid grid-cols-2 gap-4">
                {settings?.phone && (
                  <div className="border-l-2 border-brand-red pl-4">
                    <span className="text-xs text-neutral-400 uppercase tracking-wider">{t('電話', 'Phone')}</span>
                    <p className="text-sm font-semibold text-neutral-900 mt-1">{settings.phone}</p>
                  </div>
                )}
                {settings?.email && (
                  <div className="border-l-2 border-brand-red pl-4">
                    <span className="text-xs text-neutral-400 uppercase tracking-wider">{t('メール', 'Email')}</span>
                    <p className="text-sm font-semibold text-neutral-900 mt-1 break-all">{settings.email}</p>
                  </div>
                )}
                {settings?.address && (
                  <div className="border-l-2 border-brand-red pl-4 col-span-2">
                    <span className="text-xs text-neutral-400 uppercase tracking-wider">{t('住所', 'Address')}</span>
                    <p className="text-sm font-semibold text-neutral-900 mt-1">
                      {lang === 'ja' ? settings.address_ja || settings.address : settings.address}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
