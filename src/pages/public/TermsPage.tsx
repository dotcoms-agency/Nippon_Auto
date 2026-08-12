import { useLanguage } from '@/i18n/LanguageContext';
import { useSiteSettings } from '@/hooks/useData';
import { useSEO } from '@/hooks/useSEO';

export function TermsPage() {
  const { lang } = useLanguage();
  const { settings } = useSiteSettings();
  useSEO({ title: lang === 'ja' ? '利用規約' : 'Terms & Conditions' });

  const companyName = lang === 'ja'
    ? settings?.company_name_ja || 'ニッポンオート'
    : settings?.company_name || 'Nippon Auto';

  const content = lang === 'ja' ? [
    { title: '利用規約', body: `これらの利用規約は、${companyName}（以下「当社」）のウェブサイトおよびサービスの利用に適用されます。` },
    { title: 'サービスの利用', body: '当社のウェブサイトは、日本製トラックの情報提供およびお問い合わせを目的としています。不正な利用を禁じます。' },
    { title: '商品情報', body: '当社はウェブサイト上のトラック情報の正確性に努めていますが、誤りが含まれる可能性があります。価格や仕様は予告なく変更される場合があります。' },
    { title: '免責事項', body: '当社は、ウェブサイトの利用により生じた損害について責任を負いません。すべての取引は別途契約に基づきます。' },
    { title: '知的財産', body: 'ウェブサイト上のすべてのコンテンツは当社またはそのライセンサーの財産であり、無断転載を禁じます。' },
    { title: '規約の変更', body: '当社は、事前の通知なく利用規約を変更する場合があります。最新の規約は本ページでご確認ください。' },
  ] : [
    { title: 'Terms & Conditions', body: `These Terms & Conditions apply to your use of the ${companyName} website and services.` },
    { title: 'Use of Service', body: 'Our website is intended for information about Japanese trucks and for making enquiries. Misuse is prohibited.' },
    { title: 'Product Information', body: 'We strive for accuracy in our truck listings, but errors may occur. Prices and specifications are subject to change without notice.' },
    { title: 'Disclaimer', body: 'We are not liable for any damages arising from the use of this website. All transactions are governed by separate agreements.' },
    { title: 'Intellectual Property', body: 'All content on this website is the property of our company or its licensors. Unauthorized reproduction is prohibited.' },
    { title: 'Changes to Terms', body: 'We may update these Terms without prior notice. Please check this page for the latest terms.' },
  ];

  return (
    <div className="bg-white">
      <div className="bg-neutral-900 text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold">
            {lang === 'ja' ? '利用規約' : 'Terms & Conditions'}
          </h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="space-y-8">
          {content.map((section, idx) => (
            <div key={idx}>
              <h2 className="text-xl font-bold text-neutral-900 mb-3">{section.title}</h2>
              <p className="text-neutral-600 leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
