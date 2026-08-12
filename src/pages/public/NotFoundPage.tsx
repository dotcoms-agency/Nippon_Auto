import { Link } from 'react-router-dom';
import { Truck, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useSEO } from '@/hooks/useSEO';

export function NotFoundPage() {
  const { t } = useLanguage();
  useSEO({ title: '404 - Page Not Found' });

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-neutral-50">
      <div className="max-w-md mx-auto text-center px-4 py-20">
        <div className="w-20 h-20 bg-brand-red flex items-center justify-center mx-auto mb-8">
          <Truck className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-6xl font-bold text-neutral-900 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-neutral-700 mb-3">
          {t('ページが見つかりません', 'Page Not Found')}
        </h2>
        <p className="text-neutral-500 mb-8">
          {t('お探しのページは存在しないか、移動された可能性があります。', 'The page you are looking for does not exist or may have been moved.')}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red text-white font-semibold hover:bg-brand-red-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('ホームに戻る', 'Back to Home')}
        </Link>
      </div>
    </div>
  );
}
