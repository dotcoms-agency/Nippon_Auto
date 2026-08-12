import { MessageCircle } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useData';
import { useLanguage } from '@/i18n/LanguageContext';

interface LineButtonProps {
  variant?: 'full' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export function LineButton({ variant = 'full', size = 'md', className = '', label }: LineButtonProps) {
  const { settings } = useSiteSettings();
  const { t } = useLanguage();

  const lineUrl = settings?.line_url || 'https://line.me';
  const text = label || t('LINEで問い合わせ', 'Contact on LINE');

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const variantClasses = {
    full: 'bg-[#06C755] text-white hover:bg-[#05b04c]',
    outline: 'border-2 border-[#06C755] text-[#06b050] hover:bg-[#06C755] hover:text-white',
  };

  return (
    <a
      href={lineUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#06C755] focus-visible:ring-offset-2 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      <MessageCircle className="w-5 h-5" />
      {text}
    </a>
  );
}
