import { useState } from 'react';
import { Mail, Trash2, Check, CheckCheck, X, Calendar, Truck as TruckIcon } from 'lucide-react';
import { useEnquiries } from '@/hooks/useData';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';
import { LoadingState, EmptyState } from '@/components/ui/Loading';
import type { Enquiry } from '@/types';

export function AdminEnquiriesPage() {
  const { enquiries, loading, refetch } = useEnquiries();
  const { showToast } = useToast();
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Enquiry | null>(null);
  const [deleting, setDeleting] = useState(false);

  const markAsRead = async (enquiry: Enquiry) => {
    if (enquiry.is_read) return;
    const { error } = await supabase.from('enquiries').update({ is_read: true }).eq('id', enquiry.id);
    if (error) {
      showToast('Failed to mark as read', 'error');
    } else {
      refetch();
    }
  };

  const openEnquiry = (enquiry: Enquiry) => {
    setSelected(enquiry);
    if (!enquiry.is_read) markAsRead(enquiry);
  };

  const toggleRead = async (enquiry: Enquiry) => {
    const { error } = await supabase.from('enquiries').update({ is_read: !enquiry.is_read }).eq('id', enquiry.id);
    if (error) {
      showToast('Failed to update', 'error');
    } else {
      refetch();
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase.from('enquiries').delete().eq('id', deleteTarget.id);
    setDeleting(false);
    if (error) {
      showToast('Failed to delete enquiry', 'error');
    } else {
      showToast('Enquiry deleted', 'success');
      setDeleteTarget(null);
      if (selected?.id === deleteTarget.id) setSelected(null);
      refetch();
    }
  };

  if (loading) return <LoadingState message="Loading enquiries..." />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Enquiries</h1>
        <p className="text-sm text-neutral-500 mt-1">Customer contact form submissions.</p>
      </div>

      {enquiries.length > 0 ? (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white border border-neutral-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Truck</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-neutral-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {enquiries.map((enquiry) => (
                  <tr
                    key={enquiry.id}
                    className={`hover:bg-neutral-50 transition-colors cursor-pointer ${!enquiry.is_read ? 'bg-brand-red-50/30' : ''}`}
                    onClick={() => openEnquiry(enquiry)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {!enquiry.is_read && <span className="w-2 h-2 bg-brand-red rounded-full flex-shrink-0" />}
                        <span className="font-semibold text-neutral-900">{enquiry.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-neutral-600">{enquiry.email}</td>
                    <td className="py-3 px-4 text-neutral-500 text-xs">
                      {enquiry.trucks ? `${enquiry.trucks.make} ${enquiry.trucks.model}` : '—'}
                    </td>
                    <td className="py-3 px-4 text-neutral-400 text-xs">
                      {new Date(enquiry.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-semibold ${enquiry.is_read ? 'text-neutral-400' : 'text-brand-red'}`}>
                        {enquiry.is_read ? 'Read' : 'Unread'}
                      </span>
                    </td>
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleRead(enquiry)}
                          className="p-2 text-neutral-500 hover:text-brand-red hover:bg-neutral-100 transition-colors"
                          title={enquiry.is_read ? 'Mark as unread' : 'Mark as read'}
                        >
                          {enquiry.is_read ? <Mail className="w-4 h-4" /> : <CheckCheck className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setDeleteTarget(enquiry)}
                          className="p-2 text-neutral-500 hover:text-red-600 hover:bg-neutral-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {enquiries.map((enquiry) => (
              <div
                key={enquiry.id}
                className={`bg-white border p-4 ${!enquiry.is_read ? 'border-brand-red-200' : 'border-neutral-200'}`}
                onClick={() => openEnquiry(enquiry)}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {!enquiry.is_read && <span className="w-2 h-2 bg-brand-red rounded-full flex-shrink-0" />}
                      <span className="font-semibold text-neutral-900 truncate">{enquiry.name}</span>
                    </div>
                    <p className="text-xs text-neutral-500 truncate mt-0.5">{enquiry.email}</p>
                  </div>
                  <span className={`text-xs font-semibold flex-shrink-0 ${enquiry.is_read ? 'text-neutral-400' : 'text-brand-red'}`}>
                    {enquiry.is_read ? 'Read' : 'Unread'}
                  </span>
                </div>
                {enquiry.trucks && (
                  <p className="text-xs text-neutral-400 mb-2">{enquiry.trucks.make} {enquiry.trucks.model}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-400">{new Date(enquiry.created_at).toLocaleDateString()}</span>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => toggleRead(enquiry)}
                      className="p-1.5 text-neutral-500 hover:text-brand-red"
                    >
                      {enquiry.is_read ? <Mail className="w-4 h-4" /> : <CheckCheck className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setDeleteTarget(enquiry)}
                      className="p-1.5 text-neutral-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          title="No enquiries yet"
          message="Customer enquiries will appear here."
          icon={<Mail className="w-12 h-12 text-neutral-300" />}
        />
      )}

      {/* Enquiry detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setSelected(null)}>
          <div
            className="bg-white w-full sm:max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-neutral-200 sticky top-0 bg-white">
              <h3 className="font-bold text-neutral-900">Enquiry Details</h3>
              <button onClick={() => setSelected(null)} className="p-1 text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <span className="text-xs text-neutral-400 uppercase tracking-wider">Name</span>
                <p className="font-semibold text-neutral-900 mt-1">{selected.name}</p>
              </div>
              <div>
                <span className="text-xs text-neutral-400 uppercase tracking-wider">Email</span>
                <a href={`mailto:${selected.email}`} className="block text-brand-red mt-1 hover:underline">{selected.email}</a>
              </div>
              {selected.phone && (
                <div>
                  <span className="text-xs text-neutral-400 uppercase tracking-wider">Phone</span>
                  <p className="text-neutral-900 mt-1">{selected.phone}</p>
                </div>
              )}
              {selected.trucks && (
                <div>
                  <span className="text-xs text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                    <TruckIcon className="w-3 h-3" /> Truck
                  </span>
                  <p className="text-neutral-900 mt-1">{selected.trucks.make} {selected.trucks.model} ({selected.trucks.year})</p>
                </div>
              )}
              <div>
                <span className="text-xs text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Date
                </span>
                <p className="text-neutral-900 mt-1">{new Date(selected.created_at).toLocaleString()}</p>
              </div>
              {selected.message && (
                <div>
                  <span className="text-xs text-neutral-400 uppercase tracking-wider">Message</span>
                  <p className="text-neutral-700 mt-1 whitespace-pre-line bg-neutral-50 p-3 border border-neutral-100">{selected.message}</p>
                </div>
              )}
              <div className="flex gap-3 pt-4 border-t border-neutral-100">
                <a
                  href={`mailto:${selected.email}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-red text-white text-sm font-semibold hover:bg-brand-red-dark transition-colors"
                >
                  <Mail className="w-4 h-4" /> Reply
                </a>
                <button
                  onClick={() => { toggleRead(selected); setSelected(null); }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-neutral-200 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  {selected.is_read ? 'Mark unread' : 'Mark read'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4" onClick={() => setDeleteTarget(null)}>
          <div className="bg-white max-w-md w-full p-6 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 bg-red-50 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Delete this enquiry?</h3>
            <p className="text-sm text-neutral-500 mb-6">
              Enquiry from <span className="font-semibold text-neutral-700">{deleteTarget.name}</span> will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 border border-neutral-200 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
