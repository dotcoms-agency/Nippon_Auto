import { Truck, Wrench, Globe, DollarSign, ArrowRight, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useSiteContent } from '@/hooks/useData';
import { useContent } from '@/i18n/useContent';
import { useSEO } from '@/hooks/useSEO';
import { LinkButton } from '@/components/ui/Button';
import { LineButton } from '@/components/ui/LineButton';

export function ServicesPage() {
  const { lang, t } = useLanguage();
  const { content } = useSiteContent();
  const { getContent } = useContent();

  useSEO({
    title: lang === 'ja' ? 'サービス' : 'Services',
    description: lang === 'ja'
      ? 'トラック販売、点検・整備、輸出サポート、ファイナンス。ニッポンオートの総合サービス。'
      : 'Truck sales, inspection, maintenance, export support, and financing. Nippon Auto comprehensive services.',
  });

  const services = [
    { icon: Truck, title_key: 'service_1_title', desc_key: 'service_1_desc', fallback_title_ja: 'トラック販売', fallback_title_en: 'Truck Sales', fallback_desc_ja: '厳選された日本製トラックの販売。', fallback_desc_en: 'Sales of carefully selected Japanese trucks.' },
    { icon: Wrench, title_key: 'service_2_title', desc_key: 'service_2_desc', fallback_title_ja: '点検・整備', fallback_title_en: 'Inspection & Maintenance', fallback_desc_ja: '認定技術者による専門的な点検と整備。', fallback_desc_en: 'Professional inspection and maintenance.' },
    { icon: Globe, title_key: 'service_3_title', desc_key: 'service_3_desc', fallback_title_ja: '輸出サポート', fallback_title_en: 'Export Support', fallback_desc_ja: '海外向け輸出の完全サポート。', fallback_desc_en: 'Full support for export.' },
    { icon: DollarSign, title_key: 'service_4_title', desc_key: 'service_4_desc', fallback_title_ja: 'ファイナンス', fallback_title_en: 'Financing', fallback_desc_ja: '柔軟なファイナンスオプション。', fallback_desc_en: 'Flexible financing options.' },
  ];

  const features = lang === 'ja' ? [
    '200項目以上の厳格な品質検査',
    '認定技術者による整備',
    '正規部品のみ使用',
    '車検・登録手続きサポート',
    '輸出書類作成サポート',
    'アフターサポート体制',
  ] : [
    'Rigorous 200+ point quality inspection',
    'Maintenance by certified technicians',
    'Genuine parts only',
    'Inspection and registration support',
    'Export documentation support',
    'Comprehensive after-sales support',
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-neutral-900 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <span className="text-sm font-semibold text-brand-red-light uppercase tracking-wider">
            {t('サービス', 'Services')}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-3">
            {getContent(content, 'services_title', 'サービス', 'Our Services')}
          </h1>
          <p className="text-lg text-neutral-400 mt-4 max-w-2xl leading-relaxed">
            {getContent(content, 'services_intro', 'ニッポンオートは、トラックの販売から保守まで、総合的なサービスを提供します。', 'Nippon Auto offers comprehensive services from truck sales to maintenance.')}
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div key={idx} className="border border-neutral-200 p-8 hover:shadow-lg hover:border-brand-red transition-all group">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-brand-red-50 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-red transition-colors">
                      <Icon className="w-7 h-7 text-brand-red group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900 mb-2">
                        {getContent(content, service.title_key, service.fallback_title_ja, service.fallback_title_en)}
                      </h3>
                      <p className="text-neutral-500 leading-relaxed">
                        {getContent(content, service.desc_key, service.fallback_desc_ja, service.fallback_desc_en)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-neutral-900">
              {t('サービスの特徴', 'Service Features')}
            </h2>
            <p className="text-neutral-500 mt-3">
              {t('すべてのサービスに品質と信頼性を約束します。', 'We promise quality and reliability in every service.')}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white border border-neutral-200 p-4">
                <CheckCircle className="w-5 h-5 text-brand-red flex-shrink-0" />
                <span className="text-sm font-medium text-neutral-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-neutral-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-4">{t('サービスについて問い合わせ', 'Ask About Our Services')}</h2>
          <p className="text-neutral-400 mb-6">
            {t('お客様のニーズに合わせた最適なサービスをご提案します。', 'We will recommend the best service for your needs.')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <LinkButton to="/contact" size="lg">
              {t('お問い合わせ', 'Contact Us')}
              <ArrowRight className="w-5 h-5" />
            </LinkButton>
            <LineButton size="lg" />
          </div>
        </div>
      </section>
    </div>
  );
}
