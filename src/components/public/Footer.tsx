import { Link } from 'react-router-dom';
import { Truck, Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Youtube, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useSiteSettings, useSiteContent } from '@/hooks/useData';
import { useContent } from '@/i18n/useContent';

export function Footer() {
  const { lang, t } = useLanguage();
  const { settings } = useSiteSettings();
  const { content } = useSiteContent();
  const { getContent } = useContent();

  const companyName = lang === 'ja'
    ? settings?.company_name_ja || 'ニッポンオート'
    : settings?.company_name || 'Nippon Auto';

  const address = lang === 'ja'
    ? settings?.address_ja || settings?.address
    : settings?.address;

  const businessHours = lang === 'ja'
    ? settings?.business_hours_ja || settings?.business_hours
    : settings?.business_hours;

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-brand-red flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                NIPPON<span className="text-brand-red">AUTO</span>
              </span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              {getContent(content, 'footer_description',
                'プレミアム日本製トラックの専門ディーラー。品質と信頼を全世界にお届けします。',
                'Your trusted dealer for premium Japanese trucks. Delivering quality and reliability worldwide.')}
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-6">
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings?.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors" aria-label="Twitter">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {settings?.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors" aria-label="YouTube">
                  <Youtube className="w-5 h-5" />
                </a>
              )}
              {settings?.line_url && (
                <a href={settings.line_url} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-[#06C755] transition-colors" aria-label="LINE">
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t('メニュー', 'Navigation')}
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-brand-red-light transition-colors">{t('ホーム', 'Home')}</Link></li>
              <li><Link to="/trucks" className="hover:text-brand-red-light transition-colors">{t('トラック一覧', 'Truck Inventory')}</Link></li>
              <li><Link to="/about" className="hover:text-brand-red-light transition-colors">{t('会社概要', 'About Us')}</Link></li>
              <li><Link to="/services" className="hover:text-brand-red-light transition-colors">{t('サービス', 'Services')}</Link></li>
              <li><Link to="/contact" className="hover:text-brand-red-light transition-colors">{t('お問い合わせ', 'Contact')}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t('法的事項', 'Legal')}
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/faq" className="hover:text-brand-red-light transition-colors">{t('よくある質問', 'FAQ')}</Link></li>
              <li><Link to="/privacy" className="hover:text-brand-red-light transition-colors">{t('プライバシーポリシー', 'Privacy Policy')}</Link></li>
              <li><Link to="/terms" className="hover:text-brand-red-light transition-colors">{t('利用規約', 'Terms & Conditions')}</Link></li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t('連絡先', 'Contact')}
            </h3>
            <ul className="space-y-3 text-sm">
              {settings?.phone && (
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                  <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">{settings.phone}</a>
                </li>
              )}
              {settings?.email && (
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                  <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">{settings.email}</a>
                </li>
              )}
              {address && (
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                  <span>{address}</span>
                </li>
              )}
              {businessHours && (
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                  <span>{businessHours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <p>&copy; {new Date().getFullYear()} {companyName}. {t('全著作権所有。', 'All rights reserved.')}</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-neutral-300 transition-colors">{t('プライバシー', 'Privacy')}</Link>
            <Link to="/terms" className="hover:text-neutral-300 transition-colors">{t('利用規約', 'Terms')}</Link>
            <Link to="/admin" className="hover:text-neutral-300 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
