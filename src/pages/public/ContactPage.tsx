import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useSiteContent, useSiteSettings, useTrucks, submitEnquiry } from '@/hooks/useData';
import { useContent } from '@/i18n/useContent';
import { useSEO } from '@/hooks/useSEO';
import { useToast } from '@/components/ui/Toast';
import { LineButton } from '@/components/ui/LineButton';
import { Button } from '@/components/ui/Button';

export function ContactPage() {
  const { lang, t } = useLanguage();
  const { content } = useSiteContent();
  const { settings } = useSiteSettings();
  const { trucks } = useTrucks();
  const { getContent } = useContent();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();

  const truckSlug = searchParams.get('truck');
  const selectedTruck = trucks.find((tr) => tr.slug === truckSlug);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [truckId, setTruckId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useSEO({
    title: lang === 'ja' ? 'お問い合わせ' : 'Contact Us',
    description: lang === 'ja'
      ? 'ニッポンオートへのお問い合わせ。電話、メール、LINEでお気軽にどうぞ。'
      : 'Contact Nippon Auto. Reach us by phone, email, or LINE.',
  });

  useEffect(() => {
    if (selectedTruck) {
      setTruckId(selectedTruck.id);
      setForm((prev) => ({
        ...prev,
        message: lang === 'ja'
          ? `${selectedTruck.make} ${selectedTruck.model} (${selectedTruck.year})についてのお問い合わせです。`
          : `I am interested in the ${selectedTruck.make} ${selectedTruck.model} (${selectedTruck.year}).`,
      }));
    }
  }, [selectedTruck, lang]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      showToast(t('名前とメールアドレスは必須です', 'Name and email are required'), 'error');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      showToast(t('有効なメールアドレスを入力してください', 'Please enter a valid email address'), 'error');
      return;
    }

    setSubmitting(true);
    const result = await submitEnquiry({
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      message: form.message || undefined,
      truck_id: truckId || undefined,
    });
    setSubmitting(false);

    if (result.success) {
      setSubmitted(true);
      showToast(t('お問い合わせを送信しました', 'Enquiry sent successfully'), 'success');
    } else {
      showToast(t('送信に失敗しました。もう一度お試しください。', 'Failed to send. Please try again.'), 'error');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-neutral-50 py-20">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="w-16 h-16 bg-green-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-3">
            {t('お問い合わせありがとうございます', 'Thank You for Your Enquiry')}
          </h1>
          <p className="text-neutral-500 mb-8">
            {t('お問い合わせを受け付けました。担当者より折り返しご連絡いたします。', 'We have received your enquiry. Our team will get back to you shortly.')}
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-red text-white font-semibold hover:bg-brand-red-dark transition-colors">
              {t('ホームに戻る', 'Back to Home')}
            </Link>
            <LineButton variant="outline" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-neutral-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <span className="text-sm font-semibold text-brand-red-light uppercase tracking-wider">
            {t('お問い合わせ', 'Contact')}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-3">
            {getContent(content, 'contact_title', 'お問い合わせ', 'Contact Us')}
          </h1>
          <p className="text-lg text-neutral-400 mt-4 max-w-2xl">
            {getContent(content, 'contact_intro', 'トラックについてご質問がございましたら、お気軽にお問い合わせください。', 'Have questions about our trucks? Feel free to reach out to us.')}
          </p>
        </div>
      </section>

      <div className="py-12 md:py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact info */}
            <div className="space-y-4">
              {/* LINE */}
              <div className="bg-white border border-neutral-200 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#06C755]/10 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-[#06C755]" />
                  </div>
                  <h3 className="font-semibold text-neutral-900">
                    {getContent(content, 'contact_line_title', 'LINEでのお問い合わせ', 'Contact via LINE')}
                  </h3>
                </div>
                <p className="text-sm text-neutral-500 mb-4">
                  {getContent(content, 'contact_line_desc', 'LINEでもお気軽にお問い合わせいただけます。', 'Feel free to contact us through LINE.')}
                </p>
                <LineButton size="sm" className="w-full" />
              </div>

              {/* Phone */}
              {settings?.phone && (
                <a href={`tel:${settings.phone}`} className="block bg-white border border-neutral-200 p-6 hover:border-brand-red transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-red-50 flex items-center justify-center group-hover:bg-brand-red transition-colors">
                      <Phone className="w-5 h-5 text-brand-red group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <span className="text-xs text-neutral-400 block">{t('電話', 'Phone')}</span>
                      <span className="font-semibold text-neutral-900">{settings.phone}</span>
                    </div>
                  </div>
                </a>
              )}

              {/* Email */}
              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="block bg-white border border-neutral-200 p-6 hover:border-brand-red transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-red-50 flex items-center justify-center group-hover:bg-brand-red transition-colors">
                      <Mail className="w-5 h-5 text-brand-red group-hover:text-white transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs text-neutral-400 block">{t('メール', 'Email')}</span>
                      <span className="font-semibold text-neutral-900 break-all">{settings.email}</span>
                    </div>
                  </div>
                </a>
              )}

              {/* Address */}
              {settings?.address && (
                <div className="bg-white border border-neutral-200 p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-brand-red-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-brand-red" />
                    </div>
                    <div>
                      <span className="text-xs text-neutral-400 block">{t('住所', 'Address')}</span>
                      <span className="font-semibold text-neutral-900">
                        {lang === 'ja' ? settings.address_ja || settings.address : settings.address}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Business hours */}
              {settings?.business_hours && (
                <div className="bg-white border border-neutral-200 p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-brand-red-50 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-brand-red" />
                    </div>
                    <div>
                      <span className="text-xs text-neutral-400 block">{t('営業時間', 'Business Hours')}</span>
                      <span className="font-semibold text-neutral-900">
                        {lang === 'ja' ? settings.business_hours_ja || settings.business_hours : settings.business_hours}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 p-6 md:p-8">
                <h2 className="text-xl font-bold text-neutral-900 mb-6">{t('お問い合わせフォーム', 'Enquiry Form')}</h2>

                {selectedTruck && (
                  <div className="mb-6 p-4 bg-brand-red-50 border border-brand-red-100">
                    <p className="text-sm text-neutral-700">
                      {t('お問い合わせ対象', 'Enquiring about')}: <span className="font-semibold">{selectedTruck.make} {selectedTruck.model} ({selectedTruck.year})</span>
                    </p>
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      {getContent(content, 'contact_form_name', 'お名前', 'Name')} <span className="text-brand-red">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-neutral-200 text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                        {getContent(content, 'contact_form_email', 'メールアドレス', 'Email')} <span className="text-brand-red">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-2.5 border border-neutral-200 text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                        {getContent(content, 'contact_form_phone', '電話番号', 'Phone')}
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-2.5 border border-neutral-200 text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                      />
                    </div>
                  </div>

                  {!selectedTruck && trucks.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                        {t('対象トラック', 'Truck of Interest')}
                      </label>
                      <select
                        value={truckId}
                        onChange={(e) => setTruckId(e.target.value)}
                        className="w-full px-4 py-2.5 border border-neutral-200 text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red bg-white"
                      >
                        <option value="">{t('選択してください', 'Select a truck (optional)')}</option>
                        {trucks.map((truck) => (
                          <option key={truck.id} value={truck.id}>
                            {truck.make} {truck.model} ({truck.year})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      {getContent(content, 'contact_form_message', 'メッセージ', 'Message')}
                    </label>
                    <textarea
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-2.5 border border-neutral-200 text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red resize-y"
                    />
                  </div>

                  <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t('送信中...', 'Sending...')}
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {getContent(content, 'contact_form_submit', '送信する', 'Send Message')}
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* Map */}
              {settings?.map_embed_url && (
                <div className="mt-6 bg-white border border-neutral-200 p-2">
                  <iframe
                    src={settings.map_embed_url}
                    title="Nippon Auto location"
                    className="w-full h-64 border-0"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
