import { Link } from 'react-router-dom';
import { Truck, CheckCircle, Clock, XCircle, Mail, ArrowRight } from 'lucide-react';
import { useDashboardStats, useEnquiries } from '@/hooks/useData';
import { LoadingState } from '@/components/ui/Loading';

export function AdminDashboardPage() {
  const { stats, loading } = useDashboardStats();
  const { enquiries } = useEnquiries();

  if (loading) return <LoadingState message="Loading dashboard..." />;

  const statCards = [
    { label: 'Total Trucks', value: stats.total, icon: Truck, color: 'text-neutral-700', bg: 'bg-neutral-100', link: '/admin/trucks' },
    { label: 'Available', value: stats.available, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', link: '/admin/trucks' },
    { label: 'Reserved', value: stats.reserved, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', link: '/admin/trucks' },
    { label: 'Sold', value: stats.sold, icon: XCircle, color: 'text-neutral-500', bg: 'bg-neutral-100', link: '/admin/trucks' },
    { label: 'Total Enquiries', value: stats.totalEnquiries, icon: Mail, color: 'text-brand-red', bg: 'bg-brand-red-50', link: '/admin/enquiries' },
    { label: 'Unread Enquiries', value: stats.unreadEnquiries, icon: Mail, color: 'text-brand-red', bg: 'bg-brand-red-50', link: '/admin/enquiries' },
  ];

  const recentEnquiries = enquiries.slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">Overview of your dealership activity.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat, idx) => (
          <Link
            key={idx}
            to={stat.link}
            className="bg-white border border-neutral-200 p-5 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
            <span className="text-3xl font-bold text-neutral-900 block">{stat.value}</span>
          </Link>
        ))}
      </div>

      {/* Recent enquiries */}
      <div className="bg-white border border-neutral-200">
        <div className="flex items-center justify-between p-5 border-b border-neutral-100">
          <h2 className="font-bold text-neutral-900">Recent Enquiries</h2>
          <Link to="/admin/enquiries" className="text-sm font-semibold text-brand-red hover:gap-2 inline-flex items-center gap-1 transition-all">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentEnquiries.length > 0 ? (
          <div className="divide-y divide-neutral-100">
            {recentEnquiries.map((enquiry) => (
              <Link
                key={enquiry.id}
                to="/admin/enquiries"
                className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {!enquiry.is_read && <span className="w-2 h-2 bg-brand-red rounded-full flex-shrink-0" />}
                    <span className="font-semibold text-neutral-900 text-sm truncate">{enquiry.name}</span>
                  </div>
                  <p className="text-xs text-neutral-500 truncate">{enquiry.email}</p>
                  {enquiry.trucks && (
                    <p className="text-xs text-neutral-400 mt-1">
                      Re: {enquiry.trucks.make} {enquiry.trucks.model}
                    </p>
                  )}
                </div>
                <span className="text-xs text-neutral-400 flex-shrink-0 ml-3">
                  {new Date(enquiry.created_at).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-neutral-400">No enquiries yet.</div>
        )}
      </div>
    </div>
  );
}
