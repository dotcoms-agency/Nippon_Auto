import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useSEO } from '@/hooks/useSEO';
import { LinkButton } from '@/components/ui/Button';

export function FAQPage() {
  const { lang, t } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  useSEO({ title: lang === 'ja' ? 'よくある質問' : 'FAQ' });

  const faqs = lang === 'ja' ? [
    { q: 'トラックの輸出は可能ですか？', a: 'はい、可能です。輸出の書類手続きから配送まで完全にサポートいたします。お気軽にお問い合わせください。' },
    { q: '支払い方法は何がありますか？', a: '銀行振込、クレジットカード決済に対応しています。また、ファイナンスオプションもご利用いただけます。' },
    { q: '車検は付いていますか？', a: '一部のトラックには車検が付いています。各トラックの詳細ページでご確認いただけます。' },
    { q: 'メンテナンスは提供していますか？', a: 'はい、認定技術者による点検・整備サービスを提供しています。' },
    { q: '海外から見学することはできますか？', a: 'はい、事前にお問い合わせいただければ見学の日程を調整いたします。' },
    { q: 'LINEで問い合わせできますか？', a: 'はい、LINEでお気軽にお問い合わせいただけます。LINEボタンからどうぞ。' },
  ] : [
    { q: 'Can you export trucks?', a: 'Yes, we can. We provide full support for export, from documentation to delivery. Please contact us for details.' },
    { q: 'What payment methods do you accept?', a: 'We accept bank transfer and credit card payments. Financing options are also available.' },
    { q: 'Do the trucks come with inspection?', a: 'Some trucks include inspection. Please check each truck\'s detail page for specific information.' },
    { q: 'Do you offer maintenance services?', a: 'Yes, we provide inspection and maintenance services by certified technicians.' },
    { q: 'Can I visit from overseas?', a: 'Yes, please contact us in advance to arrange a visit.' },
    { q: 'Can I enquire via LINE?', a: 'Yes, feel free to contact us through LINE. Use the LINE button to reach us.' },
  ];

  return (
    <div className="bg-white">
      <div className="bg-neutral-900 text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold">{t('よくある質問', 'FAQ')}</h1>
          <p className="text-neutral-400 mt-3">
            {t('よくある質問にお答えします。', 'Answers to frequently asked questions.')}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-neutral-200">
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
                aria-expanded={openIdx === idx}
              >
                <span className="font-semibold text-neutral-900">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-neutral-400 flex-shrink-0 transition-transform ${
                    openIdx === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIdx === idx && (
                <div className="px-5 pb-5 animate-slide-down">
                  <p className="text-neutral-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-neutral-500 mb-4">{t('他にご質問はありますか？', 'Have more questions?')}</p>
          <LinkButton to="/contact">{t('お問い合わせ', 'Contact Us')}</LinkButton>
        </div>
      </div>
    </div>
  );
}
