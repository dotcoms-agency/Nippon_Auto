import { useLanguage } from '@/i18n/LanguageContext';
import { useSiteSettings } from '@/hooks/useData';
import { useSEO } from '@/hooks/useSEO';

export function PrivacyPage() {
  const { lang, t } = useLanguage();
  const { settings } = useSiteSettings();
  useSEO({ title: lang === 'ja' ? 'プライバシーポリシー' : 'Privacy Policy' });

  const companyName = lang === 'ja'
    ? settings?.company_name_ja || 'ニッポンオート'
    : settings?.company_name || 'Nippon Auto';

  const content = lang === 'ja' ? [
    {
      title: 'プライバシーポリシー',
      body: `${companyName}（以下「当社」）は、お客様の個人情報の重要性を認識し、その保護に努めます。本プライバシーポリシーは、当社が収集する個人情報の取り扱いについて説明します。`,
    },
    {
      title: '収集する情報',
      body: '当社は、お問い合わせフォームを通じて、お名前、メールアドレス、電話番号、およびメッセージを収集します。これらの情報は、お客様からのお問い合わせに対応するために使用されます。',
    },
    {
      title: '情報の利用目的',
      body: '収集した個人情報は、お問い合わせへの返答、トラックのご案内、サービスの提供および改善の目的でのみ使用します。',
    },
    {
      title: '情報の保護',
      body: '当社は、お客様の個人情報を安全に保管し、不正アクセス、紛失、改ざんから保護するための適切な技術的・組織的措置を講じています。',
    },
    {
      title: '第三者への提供',
      body: '当社は、お客様の同意なしに個人情報を第三者に提供することはありません。ただし、法令に基づく要請がある場合を除きます。',
    },
    {
      title: 'お問い合わせ',
      body: `プライバシーに関するお問い合わせは、${settings?.email || '当社のメール'}までご連絡ください。`,
    },
  ] : [
    {
      title: 'Privacy Policy',
      body: `${companyName} ("we") recognizes the importance of your personal information and is committed to protecting it. This Privacy Policy explains how we handle the personal information we collect.`,
    },
    {
      title: 'Information We Collect',
      body: 'We collect your name, email address, phone number, and message through our enquiry form. This information is used to respond to your enquiries.',
    },
    {
      title: 'Purpose of Use',
      body: 'The personal information we collect is used solely to respond to enquiries, provide truck information, and deliver and improve our services.',
    },
    {
      title: 'Information Protection',
      body: 'We store your personal information securely and take appropriate technical and organizational measures to protect it from unauthorized access, loss, and alteration.',
    },
    {
      title: 'Third-Party Disclosure',
      body: 'We do not share your personal information with third parties without your consent, except where required by law.',
    },
    {
      title: 'Contact',
      body: `For privacy-related enquiries, please contact us at ${settings?.email || 'our email'}.`,
    },
  ];

  return (
    <div className="bg-white">
      <div className="bg-neutral-900 text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold">
            {lang === 'ja' ? 'プライバシーポリシー' : 'Privacy Policy'}
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
