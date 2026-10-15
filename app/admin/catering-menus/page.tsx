'use client';

/**
 * app/admin/catering-menus/page.tsx — Catering Packages
 *
 * Interactive catering package menus manager:
 *  - Create & Edit package modal (Category, Badge, Title, Items)
 *  - Live toggle visibility
 *  - Delete package
 */

import { useState, useEffect } from 'react';
import { CateringMenu } from '@/types';
import { PlusIcon, CloseIcon } from '@/components/SvgIcons';

const CATEGORIES = ['regular', 'premium', 'holud', 'bride', 'box'];

export default function AdminCateringMenusPage() {
  const [menus, setMenus] = useState<CateringMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<CateringMenu | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form
  const [category, setCategory] = useState('regular');
  const [badgeText, setBadgeText] = useState('');
  const [title, setTitle] = useState('');
  const [itemsText, setItemsText] = useState('');

  useEffect(() => {
    loadMenus();
  }, []);

  async function loadMenus() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/catering-menus');
      const data = await res.json();
      if (data.success) {
        setMenus(data.data || []);
      } else {
        setError(data.message || 'Failed to load catering packages.');
      }
    } catch {
      setError('Network error while loading catering packages.');
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingMenu(null);
    setCategory('regular');
    setBadgeText('REG-1');
    setTitle('');
    setItemsText('');
    setModalOpen(true);
  }

  function openEditModal(m: CateringMenu) {
    setEditingMenu(m);
    setCategory(m.category);
    setBadgeText(m.badge_text);
    setTitle(m.title);
    setItemsText(m.items);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/catering-menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingMenu?.id,
          category,
          badge_text: badgeText,
          title,
          items: itemsText,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        loadMenus();
      } else {
        alert(data.message || 'Failed to save catering package.');
      }
    } catch {
      alert('Network error.');
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleStatus(m: CateringMenu) {
    try {
      const nextActive = !m.is_active;
      setMenus((prev) =>
        prev.map((item) => (item.id === m.id ? { ...item, is_active: nextActive } : item))
      );

      const res = await fetch('/api/admin/catering-menus', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: m.id, is_active: nextActive }),
      });
      const data = await res.json();
      if (!data.success) {
        setMenus((prev) =>
          prev.map((item) => (item.id === m.id ? { ...item, is_active: !nextActive } : item))
        );
        alert(data.message || 'Failed to update visibility.');
      }
    } catch {
      alert('Network error.');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this catering package?')) return;
    try {
      const res = await fetch(`/api/admin/catering-menus?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMenus((prev) => prev.filter((m) => m.id !== id));
      } else {
        alert(data.message || 'Failed to delete package.');
      }
    } catch {
      alert('Network error.');
    }
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-xl font-bold tracking-tight">Catering Packages</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Configure preset menus for wedding, holud, corporate box, and feast catering
          </p>
        </div>
        <button
          onClick={openCreateModal}
          type="button"
          className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 shadow-lg shadow-red-950/40 flex items-center justify-center gap-2 bg-[#af0202]"
        >
          <PlusIcon className="w-4 h-4" /> New Catering Package
        </button>
      </div>

      {error && (
        <div className="bg-red-950/50 border border-red-800 rounded-xl px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm">Loading catering packages...</div>
      ) : menus.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <p className="text-slate-400 text-sm">No catering menus configured yet.</p>
          <button
            onClick={openCreateModal}
            className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-600 rounded-xl text-white text-xs font-semibold"
          >
            Create Your First Package
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menus.map((m) => (
            <div
              key={m.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-semibold uppercase tracking-wider">
                    {m.category}
                  </span>
                  <span className="font-mono text-xs font-bold text-red-400">
                    {m.badge_text}
                  </span>
                </div>

                <h3 className="text-white font-bold text-base mb-2">{m.title}</h3>

                <div className="text-slate-400 text-xs leading-relaxed line-clamp-4 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 mb-4">
                  {m.items}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => toggleStatus(m)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                    m.is_active
                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800 hover:bg-emerald-900/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {m.is_active ? 'Active' : 'Disabled'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(m)}
                    className="text-xs px-2.5 py-1 rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="text-xs px-2.5 py-1 rounded-lg text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/60 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal ───────────────────────────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingMenu ? 'Edit Package' : 'New Catering Package'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 transition-colors"
                aria-label="Close"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Badge / Code
                  </label>
                  <input
                    type="text"
                    required
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    placeholder="e.g. REG-1"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Package Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Chittagong Heritage Feast"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Menu Items (Comma or newline separated)
                </label>
                <textarea
                  rows={4}
                  required
                  value={itemsText}
                  onChange={(e) => setItemsText(e.target.value)}
                  placeholder="e.g. Kacchi Biriyani, Chicken Roast, Beef Kala Bhuna, Borhani, Firni, Salad"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#af0202] hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingMenu ? 'Update Package' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
