import { useState } from 'react';
import { NavLink, Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Truck, Mail, FileText, Settings,
  LogOut, Menu, X, ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';
import { useEnquiries } from '@/hooks/useData';

export function AdminLayout() {
  const { session, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { enquiries } = useEnquiries();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const unreadCount = enquiries.filter((e) => !e.is_read).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-8 h-8 border-2 border-neutral-200 border-t-brand-red rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return <Navigate to="/admin" replace />;

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/trucks', icon: Truck, label: 'Trucks' },
    { to: '/admin/enquiries', icon: Mail, label: 'Enquiries', badge: unreadCount },
    { to: '/admin/content', icon: FileText, label: 'Content' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin');
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-brand-red flex items-center justify-center">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div className="leading-none">
            <span className="block text-base font-bold text-white tracking-tight">
              NIPPON<span className="text-brand-red">AUTO</span>
            </span>
            <span className="block text-[9px] text-neutral-500 tracking-widest uppercase mt-0.5">
              Admin Panel
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-red text-white'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </div>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold bg-white text-brand-red">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-800 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
        >
          <ExternalLink className="w-5 h-5" />
          View Website
        </a>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-neutral-900 flex-col fixed inset-y-0 left-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-64 bg-neutral-900 flex flex-col z-50 md:hidden animate-slide-down">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden bg-white border-b border-neutral-200 px-4 h-14 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-neutral-700"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-neutral-900 text-sm">Nippon Auto CMS</span>
          <div className="w-8" />
        </div>

        <main className="flex-1 p-4 md:p-8 max-w-6xl w-full mx-auto">
          <Outlet key={pathname} />
        </main>
      </div>
    </div>
  );
}
