import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Truck, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useSiteSettings } from '@/hooks/useData';

export function Header() {
  const { lang, setLang, t } = useLanguage();
  const { settings } = useSiteSettings();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navItems = [
    { to: '/', ja: 'ホーム', en: 'Home' },
    { to: '/trucks', ja: 'トラック', en: 'Trucks' },
    { to: '/about', ja: '会社概要', en: 'About' },
    { to: '/services', ja: 'サービス', en: 'Services' },
    { to: '/contact', ja: 'お問い合わせ', en: 'Contact' },
  ];

  return (
    <>
      {/* Top bar */}
      <div className="bg-neutral-900 text-white text-xs hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-9">
          <div className="flex items-center gap-4">
            {settings?.phone && (
              <a href={`tel:${settings.phone}`} className="flex items-center gap-1.5 hover:text-brand-red-light transition-colors">
                <Phone className="w-3 h-3" />
                {settings.phone}
              </a>
            )}
          </div>
          <div className="flex items-center gap-4">
            {settings?.business_hours && (
              <span className="text-neutral-400">
                {lang === 'ja' ? settings.business_hours_ja || settings.business_hours : settings.business_hours}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-[1320px] mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt="Nippon Auto" className="h-8 md:h-10 w-auto" />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center bg-brand-red">
                    <Truck className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="leading-none">
                    <span className="block text-lg md:text-xl font-bold tracking-tight whitespace-nowrap text-neutral-900">
                      Nippon<span className="text-brand-red">&nbsp;Auto</span>
                    </span>
                    <span className="hidden md:block text-[10px] tracking-widest uppercase mt-0.5 text-neutral-400">
                      Premium Japanese Trucks
                    </span>
                  </div>
                </div>
              )}
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `px-4 py-2 text-sm font-medium transition-colors ${
                      isActive ? 'text-brand-red' : 'text-neutral-700 hover:text-brand-red'
                    }`
                  }
                >
                  {lang === 'ja' ? item.ja : item.en}
                </NavLink>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Language toggle */}
              <div className="flex items-center border border-neutral-200 text-xs font-semibold">
                <button
                  onClick={() => setLang('ja')}
                  className={`px-2.5 py-1.5 transition-colors ${
                    lang === 'ja' ? 'bg-brand-red text-white' : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                  aria-label="Switch to Japanese"
                >
                  日本語
                </button>
                <span className="text-neutral-300">|</span>
                <button
                  onClick={() => setLang('en')}
                  className={`px-2.5 py-1.5 transition-colors ${
                    lang === 'en' ? 'bg-brand-red text-white' : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                  aria-label="Switch to English"
                >
                  EN
                </button>
              </div>

              {/* Contact CTA */}
              <a
                href={settings?.line_url || '/contact'}
                target={settings?.line_url ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all bg-neutral-900 text-white hover:bg-neutral-800"
              >
                <MessageCircle className="w-4 h-4" />
                {t('お問い合わせ', 'Contact')}
              </a>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 -mr-2 transition-colors text-neutral-700 hover:text-brand-red"
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-neutral-100 bg-white animate-slide-down">
            <nav className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `block px-4 py-3 text-base font-medium border-l-2 transition-colors ${
                      isActive
                        ? 'border-brand-red text-brand-red bg-brand-red-50'
                        : 'border-transparent text-neutral-700 hover:bg-neutral-50'
                    }`
                  }
                >
                  {lang === 'ja' ? item.ja : item.en}
                </NavLink>
              ))}
              <div className="pt-3 px-4">
                <a
                  href={settings?.line_url || '/contact'}
                  target={settings?.line_url ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 text-sm font-semibold bg-brand-red text-white hover:bg-brand-red-dark transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  {t('お問い合わせ', 'Contact')}
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
