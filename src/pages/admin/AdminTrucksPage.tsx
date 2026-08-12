import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Copy, Eye, EyeOff, Truck as TruckIcon } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useAdminTrucks } from '@/hooks/useData';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatJPY, slugify } from '@/lib/format';
import { LoadingState, EmptyState } from '@/components/ui/Loading';
import type { Truck } from '@/types';

export function AdminTrucksPage() {
  const { trucks, loading, refetch } = useAdminTrucks();
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Truck | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim()) return trucks;
    const q = query.toLowerCase().trim();
    return trucks.filter((t) =>
      `${t.make} ${t.model} ${t.model_number || ''} ${t.year || ''}`.toLowerCase().includes(q)
    );
  }, [trucks, query]);

  const togglePublish = async (truck: Truck) => {
    const { error } = await supabase
      .from('trucks')
      .update({ published: !truck.published })
      .eq('id', truck.id);
    if (error) {
      showToast('Failed to update publish status', 'error');
    } else {
      showToast(`Truck ${!truck.published ? 'published' : 'unpublished'}`, 'success');
      refetch();
    }
  };

  const duplicateTruck = async (truck: Truck) => {
    const newSlug = `${truck.slug}-copy-${Date.now().toString().slice(-4)}`;
    const { error } = await supabase.from('trucks').insert({
      slug: newSlug,
      make: truck.make,
      model: `${truck.model} (Copy)`,
      model_number: truck.model_number,
      year: truck.year,
      price_jpy: truck.price_jpy,
      mileage: truck.mileage,
      engine: truck.engine,
      fuel_type: truck.fuel_type,
      transmission: truck.transmission,
      dimensions: truck.dimensions,
      load_capacity: truck.load_capacity,
      body_type: truck.body_type,
      drive_type: truck.drive_type,
      video_url: truck.video_url,
      description_ja: truck.description_ja,
      description_en: truck.description_en,
      status: 'available',
      published: false,
    });
    if (error) {
      showToast('Failed to duplicate truck', 'error');
    } else {
      showToast('Truck duplicated (unpublished)', 'success');
      refetch();
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase.from('trucks').delete().eq('id', deleteTarget.id);
    setDeleting(false);
    if (error) {
      showToast('Failed to delete truck', 'error');
    } else {
      showToast('Truck deleted', 'success');
      setDeleteTarget(null);
      refetch();
    }
  };

  if (loading) return <LoadingState message="Loading trucks..." />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Trucks</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage your truck inventory.</p>
        </div>
        <Link
          to="/admin/trucks/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-red text-white text-sm font-semibold hover:bg-brand-red-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Truck
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search trucks..."
          className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red bg-white"
        />
      </div>

      {/* Truck list */}
      {filtered.length > 0 ? (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white border border-neutral-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Truck</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Year</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Published</th>
                  <th className="text-right py-3 px-4 font-semibold text-neutral-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((truck) => (
                  <tr key={truck.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-neutral-900">{truck.make} {truck.model}</div>
                      <div className="text-xs text-neutral-400">{truck.model_number || '—'}</div>
                    </td>
                    <td className="py-3 px-4 text-neutral-600">{truck.year || '—'}</td>
                    <td className="py-3 px-4 text-neutral-600">{formatJPY(truck.price_jpy)}</td>
                    <td className="py-3 px-4"><StatusBadge status={truck.status} size="sm" /></td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => togglePublish(truck)}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold ${truck.published ? 'text-green-600' : 'text-neutral-400'}`}
                      >
                        {truck.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        {truck.published ? 'Live' : 'Hidden'}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/admin/trucks/${truck.id}/edit`}
                          className="p-2 text-neutral-500 hover:text-brand-red hover:bg-neutral-100 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => duplicateTruck(truck)}
                          className="p-2 text-neutral-500 hover:text-blue-600 hover:bg-neutral-100 transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(truck)}
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
            {filtered.map((truck) => (
              <div key={truck.id} className="bg-white border border-neutral-200 p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-neutral-900 truncate">{truck.make} {truck.model}</div>
                    <div className="text-xs text-neutral-400">{truck.year} • {formatJPY(truck.price_jpy)}</div>
                  </div>
                  <StatusBadge status={truck.status} size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => togglePublish(truck)}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold ${truck.published ? 'text-green-600' : 'text-neutral-400'}`}
                  >
                    {truck.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    {truck.published ? 'Live' : 'Hidden'}
                  </button>
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/admin/trucks/${truck.id}/edit`}
                      className="p-2 text-neutral-500 hover:text-brand-red transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => duplicateTruck(truck)}
                      className="p-2 text-neutral-500 hover:text-blue-600 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(truck)}
                      className="p-2 text-neutral-500 hover:text-red-600 transition-colors"
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
          title="No trucks yet"
          message="Add your first truck to start building your inventory."
          action={
            <Link
              to="/admin/trucks/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-red text-white text-sm font-semibold hover:bg-brand-red-dark transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Truck
            </Link>
          }
        />
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4" onClick={() => setDeleteTarget(null)}>
          <div className="bg-white max-w-md w-full p-6 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 bg-red-50 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Delete this truck?</h3>
            <p className="text-sm text-neutral-500 mb-6">
              You are about to delete <span className="font-semibold text-neutral-700">{deleteTarget.make} {deleteTarget.model}</span>. This will also delete all associated images. This action cannot be undone.
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
