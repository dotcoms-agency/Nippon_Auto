import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/auth/AuthContext';
import { LanguageProvider } from '@/i18n/LanguageContext';
import { ToastProvider } from '@/components/ui/Toast';

// Public layout + pages
import { PublicLayout } from '@/components/public/PublicLayout';
import { HomePage } from '@/pages/public/HomePage';
import { InventoryPage } from '@/pages/public/InventoryPage';
import { TruckDetailPage } from '@/pages/public/TruckDetailPage';
import { AboutPage } from '@/pages/public/AboutPage';
import { ServicesPage } from '@/pages/public/ServicesPage';
import { ContactPage } from '@/pages/public/ContactPage';
import { FAQPage } from '@/pages/public/FAQPage';
import { PrivacyPage } from '@/pages/public/PrivacyPage';
import { TermsPage } from '@/pages/public/TermsPage';
import { NotFoundPage } from '@/pages/public/NotFoundPage';

// Admin
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminLayout } from '@/pages/admin/AdminLayout';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminTrucksPage } from '@/pages/admin/AdminTrucksPage';
import { AdminTruckFormPage } from '@/pages/admin/AdminTruckFormPage';
import { AdminEnquiriesPage } from '@/pages/admin/AdminEnquiriesPage';
import { AdminContentPage } from '@/pages/admin/AdminContentPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Public website */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/trucks" element={<InventoryPage />} />
                <Route path="/trucks/:slug" element={<TruckDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
              </Route>

              {/* Admin */}
              <Route path="/admin" element={<AdminLoginPage />} />
              <Route path="/admin/*" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="trucks" element={<AdminTrucksPage />} />
                <Route path="trucks/new" element={<AdminTruckFormPage />} />
                <Route path="trucks/:id/edit" element={<AdminTruckFormPage />} />
                <Route path="enquiries" element={<AdminEnquiriesPage />} />
                <Route path="content" element={<AdminContentPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>

              {/* 404 */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
