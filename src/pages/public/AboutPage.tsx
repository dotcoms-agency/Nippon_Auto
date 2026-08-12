import { ShieldCheck, Award, Globe2, Heart, ArrowRight, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useSiteContent, useSiteSettings } from '@/hooks/useData';
import { useContent, getSetting } from '@/i18n/useContent';
import { useSEO } from '@/hooks/useSEO';
import { LinkButton } from '@/components/ui/Button';
import { LineButton } from '@/components/ui/LineButton';

export function AboutPage() {
  const { lang, t } = useLanguage();
  const { content } = useSiteContent();
  const { settings } = useSiteSettings();
  const { getContent } = useContent();

  useSEO({
    title: lang === 'ja' ? '会社概要' : 'About Us',
    description: lang === 'ja'
      ? 'ニッポンオートは1995年創業のプレミアム日本製トラック専門ディーラーです。'
      : 'Nippon Auto is a premium Japanese truck dealer founded in 1995.',
  });

  const values = [
    { icon: ShieldCheck, title_key: 'values_quality_ja', title_fallback_ja: '品質第一', title_fallback_en: 'Quality First' },
    { icon: Award, title_key: 'values_trust_ja', title_fallback_ja: '信頼の関係', title_fallback_en: 'Trusted Relationships' },
    { icon: Globe2, title_key: 'values_expertise_ja', title_fallback_ja: '専門知識', title_fallback_en: 'Deep Expertise' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/32416035/pexels-photo-32416035.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800"
            alt="Japan"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 to-black/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-6">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold text-brand-red-light uppercase tracking-wider">
              {t('会社概要', 'About Us')}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 text-balance">
              {getContent(content, 'about_title', 'ニッポンオートについて', 'About Nippon Auto')}
            </h1>
            <p className="text-lg text-neutral-200 mt-6 leading-relaxed">
              {getContent(content, 'about_intro', 'ニッポンオートは、日本の卓越したトラック製造の伝統をお客様にお届けするプレミアムディーラーです。', 'Nippon Auto is a premium dealer bringing the tradition of Japanese truck excellence to our customers.')}
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">{t('私たちの物語', 'Our Story')}</h2>
          <p className="text-neutral-600 leading-relaxed text-lg mb-6">
            {getContent(content, 'about_story', '1995年の創業以来、ニッポンオートは日本最高のトラックメーカーから選び抜かれた車両を提供してきました。私たちの専門知識と品質へのこだわりは、お客様の信頼の基盤です。', 'Since our founding in 1995, Nippon Auto has provided carefully selected vehicles from Japan\'s finest truck manufacturers. Our expertise and commitment to quality form the foundation of customer trust.')}
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <div className="w-16 h-16 bg-brand-red flex items-center justify-center mx-auto mb-6">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">{t('ミッション', 'Our Mission')}</h2>
          <p className="text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            {getContent(content, 'about_mission', '私たちの使命は、日本の精密技術と信頼性を世界のお客様に届けることです。', 'Our mission is to deliver Japanese precision engineering and reliability to customers worldwide.')}
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
              {getContent(content, 'values_title', '私たちの価値観', 'Our Values')}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <div key={idx} className="text-center group">
                  <div className="w-16 h-16 bg-brand-red-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-red transition-colors">
                    <Icon className="w-8 h-8 text-brand-red group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    {lang === 'ja' ? value.title_fallback_ja : value.title_fallback_en}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    {getContent(content, value.title_key, value.title_fallback_ja, value.title_fallback_en)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Japanese expertise */}
      <section className="py-16 md:py-24 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">{t('日本の専門知識', 'Japanese Expertise')}</h2>
              <p className="text-neutral-400 leading-relaxed mb-4">
                {lang === 'ja'
                  ? 'いすゞ、日野、三菱ふそう、UDトラックス—日本を代表するトラックメーカーの製品を深く理解し、お客様に最適な車両をご提案します。'
                  : 'Isuzu, Hino, Mitsubishi Fuso, UD Trucks — we deeply understand the products of Japan\'s leading truck manufacturers and recommend the optimal vehicle for your needs.'}
              </p>
              <p className="text-neutral-400 leading-relaxed mb-6">
                {lang === 'ja'
                  ? '私たちの技術者は日本の厳格な品質基準に基づき、すべてのトラックを200項目以上の検査で徹底的にチェックしています。'
                  : 'Our technicians thoroughly inspect every truck against over 200 inspection points, based on Japan\'s rigorous quality standards.'}
              </p>
              <div className="flex flex-wrap gap-3">
                <LinkButton to="/trucks" variant="primary">
                  {t('在庫を見る', 'Browse Trucks')}
                  <ArrowRight className="w-4 h-4" />
                </LinkButton>
                <LineButton variant="outline" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-800 p-6 text-center">
                <span className="text-4xl font-bold text-brand-red-light block">30+</span>
                <span className="text-sm text-neutral-400">{t('年の実績', 'Years')}</span>
              </div>
              <div className="bg-neutral-800 p-6 text-center">
                <span className="text-4xl font-bold text-brand-red-light block">500+</span>
                <span className="text-sm text-neutral-400">{t('販売実績', 'Trucks Sold')}</span>
              </div>
              <div className="bg-neutral-800 p-6 text-center">
                <span className="text-4xl font-bold text-brand-red-light block">200+</span>
                <span className="text-sm text-neutral-400">{t('検査項目', 'Inspection Points')}</span>
              </div>
              <div className="bg-neutral-800 p-6 text-center">
                <span className="text-4xl font-bold text-brand-red-light block">4</span>
                <span className="text-sm text-neutral-400">{t('提携メーカー', 'Partner Brands')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-brand-red">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center text-white">
          <Heart className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-3">{t('信頼のパートナー', 'Your Trusted Partner')}</h2>
          <p className="text-white/90 mb-6 max-w-xl mx-auto">
            {t('ニッポンオートの専門チームが、お客様のビジネスをサポートします。', 'Our expert team is here to support your business.')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <LinkButton to="/contact" variant="secondary" size="lg">
              {t('お問い合わせ', 'Contact Us')}
            </LinkButton>
            <LineButton size="lg" />
          </div>
        </div>
      </section>
    </div>
  );
}
