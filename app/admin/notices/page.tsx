'use client';

/**
 * app/admin/notices/page.tsx — Top Marquee Scrolling Bar Management
 *
 * Manage live scrolling announcements shown on top of the website:
 *  - Create & Edit notices
 *  - Toggle active/hidden status
 *  - Display order
 *  - Live Marquee Preview
 */

import { useState, useEffect } from 'react';
import type { MarqueeNotice } from '@/types';
import { PlusIcon, CloseIcon, NoticeIcon, DotSeparator } from '@/components/SvgIcons';

const ICON_PRESETS = [
  { key: 'megaphone', label: 'Announcement' },
  { key: 'clock', label: 'Time / Cut-off' },
  { key: 'truck', label: 'Delivery' },
  { key: 'food', label: 'Cuisine / Menu' },
  { key: 'fire', label: 'Special / Hot' },
  { key: 'bolt', label: 'Fast / Express' },
  { key: 'party', label: 'Event / Party' },
  { key: 'star', label: 'Rating / Star' },
];

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<MarqueeNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<MarqueeNotice | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [text, setText] = useState('');
  const [icon, setIcon] = useState('megaphone');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    loadNotices();
  }, []);

  async function loadNotices() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/notices?_t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setNotices(data.data || []);
      } else {
        setError(data.message || 'Failed to load notices.');
      }
    } catch {
      setError('Network error while loading notices.');
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingNotice(null);
    setText('');
    setIcon('megaphone');
    setDisplayOrder((notices.length + 1));
    setIsActive(true);
    setModalOpen(true);
  }

  function openEditModal(n: MarqueeNotice) {
    setEditingNotice(n);
    setText(n.text);
    setIcon(n.icon || 'megaphone');
    setDisplayOrder(n.display_order);
    setIsActive(Boolean(n.is_active));
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) {
      alert('Please enter notice text.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingNotice?.id,
          text: text.trim(),
          icon: icon.trim(),
          display_order: Number(displayOrder),
          is_active: isActive,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        loadNotices();
      } else {
        alert(data.message || 'Failed to save notice.');
      }
    } catch {
      alert('Network error while saving notice.');
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleStatus(n: MarqueeNotice) {
    try {
      const nextActive = !n.is_active;
      const res = await fetch('/api/admin/notices', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: n.id, is_active: nextActive }),
      });
      const data = await res.json();
      if (data.success) {
        setNotices((prev) =>
          prev.map((item) => (item.id === n.id ? { ...item, is_active: nextActive } : item))
        );
      } else {
        alert(data.message || 'Failed to update status.');
      }
    } catch {
      alert('Network error.');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this notice?')) return;

    try {
      const res = await fetch(`/api/admin/notices?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setNotices((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(data.message || 'Failed to delete notice.');
      }
    } catch {
      alert('Network error.');
    }
  }

  const activeNotices = notices.filter((n) => n.is_active);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-white text-xl font-bold tracking-tight">Top Marquee Scrolling Notices</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Manage the dynamic red notification banner scrolling at the top of your website.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-red-900/30 cursor-pointer self-start sm:self-auto"
        >
          <PlusIcon className="w-4 h-4" /> Add Notice
        </button>
      </div>

      {/* Live Preview Box */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider font-semibold">
          <span>Live Banner Preview</span>
          <span className="text-emerald-400 font-mono">
            {activeNotices.length} Active Notice{activeNotices.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="w-full bg-[#af0202] text-white text-[13px] font-bold py-2 px-4 rounded-xl overflow-hidden shadow-inner flex items-center border border-red-800">
          <div className="flex whitespace-nowrap animate-marquee w-max">
            {(activeNotices.length > 0 ? activeNotices : notices).map((item, idx) => (
              <span key={`preview-${idx}`} className="inline-flex items-center mx-4">
                <NoticeIcon name={item.icon} className="w-3.5 h-3.5 mr-2 inline-block shrink-0 text-amber-200" />
                <span>{item.text}</span>
                <DotSeparator />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Notices Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-sm">Loading marquee notices...</div>
        ) : error ? (
          <div className="py-12 text-center text-red-400 text-sm">{error}</div>
        ) : notices.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <p className="text-slate-400 text-sm">No marquee notices created yet.</p>
            <button
              onClick={openCreateModal}
              className="text-red-400 hover:text-red-300 text-xs font-semibold underline"
            >
              Create your first notice
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-xs text-slate-400 font-semibold tracking-wider uppercase">
                  <th className="py-3 px-4 w-16">Order</th>
                  <th className="py-3 px-4 w-20">Icon</th>
                  <th className="py-3 px-6">Notice Text</th>
                  <th className="py-3 px-4 w-28 text-center">Status</th>
                  <th className="py-3 px-4 w-32 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {notices.map((n) => (
                  <tr key={n.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4 font-mono text-slate-400 font-semibold">
                      #{n.display_order}
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-amber-300">
                        <NoticeIcon name={n.icon} className="w-4 h-4" />
                      </div>
                    </td>
                    <td className="py-4 px-6 text-white font-medium">
                      {n.text}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleStatus(n)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                          n.is_active
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {n.is_active ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(n)}
                        className="text-xs text-slate-300 hover:text-white font-medium px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(n.id)}
                        className="text-xs text-red-400 hover:text-red-300 font-medium px-2 py-1 rounded bg-red-950/40 hover:bg-red-900/60 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-white font-bold text-lg">
                {editingNotice ? 'Edit Marquee Notice' : 'New Marquee Notice'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Notice Text */}
              <div>
                <label className="block text-slate-300 text-xs font-semibold mb-1 uppercase tracking-wider">
                  Notice Text
                </label>
                <textarea
                  required
                  rows={3}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="e.g. Order Cut-off Time: 10:00 PM for Next Day Lunch"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Vector SVG Icon Preset Selector */}
              <div>
                <label className="block text-slate-300 text-xs font-semibold mb-1 uppercase tracking-wider">
                  Notice Icon
                </label>
                <div className="space-y-2">
                  <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
                    {ICON_PRESETS.map((preset) => {
                      const isSelected = icon === preset.key;
                      return (
                        <button
                          key={preset.key}
                          type="button"
                          onClick={() => setIcon(preset.key)}
                          className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-red-500 bg-red-950/40 text-amber-300 shadow-md shadow-red-950/50'
                              : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-white'
                          }`}
                        >
                          <NoticeIcon name={preset.key} className="w-5 h-5" />
                          <span className="text-[11px] font-medium leading-tight truncate w-full text-center">
                            {preset.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs text-slate-400">Selected Identifier:</span>
                    <input
                      type="text"
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      placeholder="e.g. clock, truck, food, fire"
                      className="flex-1 rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Display Order & Active */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1 uppercase tracking-wider">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-white text-sm focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1 uppercase tracking-wider">
                    Status
                  </label>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 accent-red-600 rounded"
                    />
                    <span className="text-sm text-slate-300 font-medium">Active (Visible)</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors cursor-pointer shadow-lg shadow-red-900/30"
                >
                  {submitting ? 'Saving...' : editingNotice ? 'Update Notice' : 'Create Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
