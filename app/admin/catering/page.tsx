'use client';

/**
 * app/admin/catering/page.tsx — Catering Bookings
 *
 * Interactive catering bookings management:
 *  - Filter by booking status
 *  - Update status inline (Pending, Confirmed, Completed, Cancelled)
 *  - Delete booking
 */

import { useState, useEffect, useCallback } from 'react';
import { CateringBooking, CateringStatus } from '@/types';

const STATUS_OPTIONS: { value: CateringStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'Pending', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  { value: 'completed', label: 'Completed', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-slate-700/50 text-slate-400 border-slate-700' },
];

export default function AdminCateringPage() {
  const [bookings, setBookings] = useState<CateringBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url =
        selectedStatus === 'all'
          ? '/api/admin/catering?limit=50'
          : `/api/admin/catering?status=${selectedStatus}&limit=50`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setBookings(data.data || []);
      } else {
        setError(data.message || 'Failed to load bookings.');
      }
    } catch {
      setError('Network error while loading bookings.');
    } finally {
      setLoading(false);
    }
  }, [selectedStatus]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  async function handleStatusChange(id: number, newStatus: CateringStatus) {
    setUpdatingId(id);
    try {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );

      const res = await fetch('/api/admin/catering', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.message || 'Failed to update booking status.');
        fetchBookings();
      }
    } catch {
      alert('Network error.');
      fetchBookings();
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this catering booking?')) return;
    try {
      const res = await fetch(`/api/admin/catering?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
      } else {
        alert(data.message || 'Failed to delete booking.');
      }
    } catch {
      alert('Network error.');
    }
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-xl font-bold tracking-tight">Event Catering Bookings</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Weddings, corporate feasts, and bulk catering reservations
          </p>
        </div>
        <button
          onClick={fetchBookings}
          className="text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          Refresh List
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedStatus('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
            selectedStatus === 'all'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All ({bookings.length})
        </button>
        {STATUS_OPTIONS.map((st) => (
          <button
            key={st.value}
            onClick={() => setSelectedStatus(st.value)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
              selectedStatus === st.value
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-950/50 border border-red-800 rounded-xl px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/40 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="px-3.5 sm:px-5 py-3">Booking #</th>
                <th className="px-3.5 sm:px-5 py-3">Client & Phone</th>
                <th className="px-3.5 sm:px-5 py-3">Package</th>
                <th className="px-3.5 sm:px-5 py-3">Guests</th>
                <th className="px-3.5 sm:px-5 py-3">Event Date & Venue</th>
                <th className="px-3.5 sm:px-5 py-3">Status</th>
                <th className="px-3.5 sm:px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-500">
                    Loading bookings...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-500">
                    No catering bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-xs text-red-400 whitespace-nowrap">
                      {b.booking_number}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-white font-medium">{b.client_name}</p>
                      <a
                        href={`tel:${b.phone}`}
                        className="text-xs text-slate-400 hover:text-slate-200 mt-0.5 inline-block font-mono"
                      >
                        {b.phone}
                      </a>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-slate-200 font-medium text-xs">
                        {b.menu_name}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-white whitespace-nowrap">
                      {b.guest_count} pax
                    </td>
                    <td className="px-5 py-4 max-w-xs text-xs">
                      <p className="text-slate-200 font-medium">
                        {b.event_date ? String(b.event_date).slice(0, 16).replace('T', ' ') : '—'}
                      </p>
                      <p className="text-slate-400 mt-0.5 truncate">{b.venue}</p>
                      {b.notes && (
                        <p className="text-slate-500 text-[11px] italic mt-0.5">
                          Note: {b.notes}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={b.status}
                        disabled={updatingId === b.id}
                        onChange={(e) =>
                          handleStatusChange(b.id, e.target.value as CateringStatus)
                        }
                        className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold bg-slate-950 focus:outline-none focus:ring-1 focus:ring-red-500 transition cursor-pointer ${
                          STATUS_OPTIONS.find((s) => s.value === b.status)?.color ||
                          'text-slate-300 border-slate-700'
                        }`}
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st.value} value={st.value} className="bg-slate-900 text-white">
                            {st.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="text-xs px-2.5 py-1 rounded-lg text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/60 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
