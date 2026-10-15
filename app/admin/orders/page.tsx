'use client';

/**
 * app/admin/orders/page.tsx — Orders Management
 *
 * Interactive orders dashboard with:
 *  - Real-time status filtering
 *  - Inline status updates (calls PATCH /api/admin/orders)
 *  - Customer contact details & delivery notes
 *  - Pagination controls
 */

import { useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus } from '@/types';

const STATUS_OPTIONS: { value: OrderStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'Pending', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  { value: 'preparing', label: 'Preparing', color: 'bg-violet-500/15 text-violet-400 border-violet-500/30' },
  { value: 'out_for_delivery', label: 'Out for Delivery', color: 'bg-pink-500/15 text-pink-400 border-pink-500/30' },
  { value: 'delivered', label: 'Delivered', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-slate-700/50 text-slate-400 border-slate-700' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url =
        selectedStatus === 'all'
          ? `/api/admin/orders?page=${page}&limit=20`
          : `/api/admin/orders?status=${selectedStatus}&page=${page}&limit=20`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data || []);
      } else {
        setError(data.message || 'Failed to load orders.');
      }
    } catch {
      setError('Network error while loading orders.');
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  async function handleStatusChange(orderId: number, newStatus: OrderStatus) {
    setUpdatingId(orderId);
    try {
      // Optimistic update
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (viewingOrder && viewingOrder.id === orderId) {
        setViewingOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }

      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.message || 'Failed to update order status.');
        fetchOrders(); // Rollback
      }
    } catch {
      alert('Network error updating status.');
      fetchOrders();
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-xl font-bold tracking-tight">Customer Orders</h2>
          <p className="text-slate-400 text-sm mt-0.5">Manage, track, and dispatch daily tiffin orders</p>
        </div>
        <button
          onClick={fetchOrders}
          className="text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Orders
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => { setSelectedStatus('all'); setPage(1); }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
            selectedStatus === 'all'
              ? 'bg-[#af0202] text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All Orders
        </button>
        {STATUS_OPTIONS.map((st) => (
          <button
            key={st.value}
            onClick={() => { setSelectedStatus(st.value); setPage(1); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
              selectedStatus === st.value
                ? 'bg-[#af0202] text-white shadow-md'
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
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/40 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="px-3.5 sm:px-4 py-3">Order Ref</th>
                <th className="px-3.5 sm:px-4 py-3">Customer</th>
                <th className="px-3.5 sm:px-4 py-3">Ordered Items</th>
                <th className="px-3.5 sm:px-4 py-3">Delivery Address</th>
                <th className="px-3.5 sm:px-4 py-3">Date & Plan</th>
                <th className="px-3.5 sm:px-4 py-3">Amount</th>
                <th className="px-3.5 sm:px-4 py-3">Status</th>
                <th className="px-3.5 sm:px-4 py-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-slate-500">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-slate-500">
                    No orders matching this filter.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/20 transition-colors">
                    {/* Order Ref */}
                    <td className="px-3.5 sm:px-4 py-3 whitespace-nowrap">
                      <span className="font-mono font-bold text-xs text-red-400 block">
                        {o.order_number}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {o.created_at ? String(o.created_at).slice(0, 10) : ''}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="px-3.5 sm:px-4 py-3 whitespace-nowrap">
                      <p className="text-white font-medium text-xs">{o.customer_name}</p>
                      <a
                        href={`tel:${o.phone}`}
                        className="text-xs text-slate-400 hover:text-red-400 mt-0.5 inline-block font-mono transition"
                      >
                        {o.phone}
                      </a>
                    </td>

                    {/* Ordered Items Preview */}
                    <td className="px-3.5 sm:px-4 py-3 max-w-[220px]">
                      {o.items && o.items.length > 0 ? (
                        <div className="space-y-1">
                          <div className="flex flex-wrap gap-1">
                            {o.items.slice(0, 2).map((item, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 border border-slate-700/60 text-slate-200"
                              >
                                <span className="text-amber-400 font-bold">{item.quantity}×</span>
                                <span className="truncate max-w-[120px]">{item.item_name}</span>
                              </span>
                            ))}
                            {o.items.length > 2 && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400">
                                +{o.items.length - 2} more
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => setViewingOrder(o)}
                            className="text-[11px] text-red-400 hover:text-red-300 font-medium cursor-pointer inline-flex items-center gap-1 pt-0.5"
                          >
                            View all items &rarr;
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic">No items details</span>
                      )}
                    </td>

                    {/* Delivery Address */}
                    <td className="px-3.5 sm:px-4 py-3 max-w-[160px]">
                      <p className="text-slate-300 text-xs line-clamp-2">{o.address}</p>
                      {o.notes && (
                        <p className="text-slate-500 text-[11px] mt-0.5 italic truncate">
                          Note: {o.notes}
                        </p>
                      )}
                    </td>

                    {/* Date & Plan */}
                    <td className="px-3.5 sm:px-4 py-3 text-xs whitespace-nowrap">
                      <p className="text-slate-200 font-medium text-xs">
                        {o.delivery_date ? String(o.delivery_date).slice(0, 10) : '—'}
                      </p>
                      <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700/50">
                        {o.plan_days && o.plan_days > 1 ? `${o.plan_days}-Day Plan` : 'Single Order'}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-3.5 sm:px-4 py-3 font-bold text-white tabular-nums whitespace-nowrap text-xs">
                      Tk {o.total}
                    </td>

                    {/* Status Select */}
                    <td className="px-3.5 sm:px-4 py-3 whitespace-nowrap">
                      <select
                        value={o.status}
                        disabled={updatingId === o.id}
                        onChange={(e) =>
                          handleStatusChange(o.id, e.target.value as OrderStatus)
                        }
                        className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold bg-slate-950 focus:outline-none focus:ring-1 focus:ring-red-500 transition cursor-pointer ${
                          STATUS_OPTIONS.find((s) => s.value === o.status)?.color ||
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

                    {/* Action Button */}
                    <td className="px-3.5 sm:px-4 py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setViewingOrder(o)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium transition cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Page {page}</span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-white disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>
            <button
              disabled={orders.length < 20}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-white disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ── Order Details Modal ─────────────────────────────────────────── */}
      {viewingOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
          onClick={() => setViewingOrder(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl my-auto max-h-[94vh] flex flex-col text-white relative animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3 sm:pb-4 shrink-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Order Details</h3>
                  <span className="font-mono text-[11px] sm:text-xs px-2 py-0.5 rounded-full bg-red-950/60 border border-red-800/80 text-red-400 font-bold truncate">
                    {viewingOrder.order_number}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">
                  Placed {viewingOrder.created_at ? new Date(viewingOrder.created_at).toLocaleString() : 'N/A'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setViewingOrder(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer shrink-0"
                aria-label="Close details"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto custom-scrollbar flex-1 py-3 space-y-4 pr-1">
              {/* Customer & Delivery Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-slate-950/50 border border-slate-800/80 rounded-xl p-3 sm:p-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Customer Info</span>
                  <p className="text-white font-medium text-xs sm:text-sm">{viewingOrder.customer_name}</p>
                  <p className="text-slate-300">
                    Phone:{' '}
                    <a href={`tel:${viewingOrder.phone}`} className="font-mono text-red-400 hover:underline">
                      {viewingOrder.phone}
                    </a>
                  </p>
                  <p className="text-slate-300 break-words">
                    Address: <span className="text-slate-200">{viewingOrder.address}</span>
                  </p>
                </div>

                <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-800/80 pt-2.5 sm:pt-0 sm:pl-4">
                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Delivery Schedule</span>
                  <p className="text-slate-300">
                    Date: <span className="font-semibold text-white">{viewingOrder.delivery_date ? String(viewingOrder.delivery_date).slice(0, 10) : 'N/A'}</span>
                  </p>
                  <p className="text-slate-300">
                    Plan: <span className="font-semibold text-emerald-400">{viewingOrder.plan_days && viewingOrder.plan_days > 1 ? `${viewingOrder.plan_days}-Day Plan` : 'Single Order (1 Day)'}</span>
                  </p>
                  {viewingOrder.notes && (
                    <p className="text-slate-300 break-words">
                      Note: <span className="italic text-slate-400">{viewingOrder.notes}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Ordered Dishes Section */}
              <div>
                <h4 className="text-[11px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Dishes in this order</span>
                  <span className="text-slate-400 lowercase font-normal">
                    {viewingOrder.items ? `${viewingOrder.items.length} dish(es)` : ''}
                  </span>
                </h4>

                {/* Mobile View: Dish Cards (compact & touch friendly) */}
                <div className="sm:hidden border border-slate-800 rounded-xl divide-y divide-slate-800/60 bg-slate-950/40">
                  {viewingOrder.items && viewingOrder.items.length > 0 ? (
                    viewingOrder.items.map((item, idx) => (
                      <div key={idx} className="p-3 space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-white text-xs leading-tight">{item.item_name}</p>
                          <span className="font-bold text-white text-xs tabular-nums whitespace-nowrap">Tk {item.line_total}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                item.tier === 'premium'
                                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                  : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                              }`}
                            >
                              {item.tier || 'standard'}
                            </span>
                            <span>Qty: <strong className="text-amber-400">{item.quantity}</strong></span>
                          </div>
                          <span>Tk {item.unit_price} × {item.plan_days ? `${item.plan_days}d` : '1d'}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="p-4 text-center text-slate-500 text-xs italic">No items found</p>
                  )}
                </div>

                {/* Tablet & Desktop View: Structured Table */}
                <div className="hidden sm:block border border-slate-800 rounded-xl overflow-x-auto custom-scrollbar bg-slate-950/40">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-800/60 border-b border-slate-800 text-slate-400 font-semibold">
                        <th className="px-3.5 py-2.5">Item Name</th>
                        <th className="px-3.5 py-2.5">Tier</th>
                        <th className="px-3.5 py-2.5 text-center">Qty</th>
                        <th className="px-3.5 py-2.5 text-center">Plan</th>
                        <th className="px-3.5 py-2.5 text-right">Price</th>
                        <th className="px-3.5 py-2.5 text-right">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {viewingOrder.items && viewingOrder.items.length > 0 ? (
                        viewingOrder.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/20">
                            <td className="px-3.5 py-2.5 font-medium text-white">{item.item_name}</td>
                            <td className="px-3.5 py-2.5">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                  item.tier === 'premium'
                                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                    : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                                }`}
                              >
                                {item.tier || 'standard'}
                              </span>
                            </td>
                            <td className="px-3.5 py-2.5 text-center font-bold text-amber-400">
                              {item.quantity}
                            </td>
                            <td className="px-3.5 py-2.5 text-center text-slate-400">
                              {item.plan_days ? `${item.plan_days}d` : '1d'}
                            </td>
                            <td className="px-3.5 py-2.5 text-right text-slate-300 tabular-nums">
                              Tk {item.unit_price}
                            </td>
                            <td className="px-3.5 py-2.5 text-right font-bold text-white tabular-nums">
                              Tk {item.line_total}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-3.5 py-4 text-center text-slate-500 italic">
                            No item line records found for this order.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Summary & Status Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pt-3 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-xs">Status:</span>
                  <select
                    value={viewingOrder.status}
                    disabled={updatingId === viewingOrder.id}
                    onChange={(e) =>
                      handleStatusChange(viewingOrder.id, e.target.value as OrderStatus)
                    }
                    className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold bg-slate-950 focus:outline-none focus:ring-1 focus:ring-red-500 transition cursor-pointer ${
                      STATUS_OPTIONS.find((s) => s.value === viewingOrder.status)?.color ||
                      'text-slate-300 border-slate-700'
                    }`}
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st.value} value={st.value} className="bg-slate-900 text-white">
                        {st.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between sm:justify-end gap-6 text-slate-400">
                    <span>Subtotal:</span>
                    <span className="text-slate-200 tabular-nums font-mono">Tk {viewingOrder.subtotal}</span>
                  </div>
                  <div className="flex justify-between sm:justify-end gap-6 text-slate-400">
                    <span>Delivery Fee:</span>
                    <span className="text-emerald-400 tabular-nums font-mono">
                      {viewingOrder.delivery_fee ? `Tk ${viewingOrder.delivery_fee}` : 'Free'}
                    </span>
                  </div>
                  <div className="flex justify-between sm:justify-end gap-6 text-sm font-bold text-white pt-1 border-t border-slate-800">
                    <span>Total Amount:</span>
                    <span className="text-red-400 tabular-nums font-mono">Tk {viewingOrder.total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-800 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setViewingOrder(null)}
                className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
