'use client';

/**
 * app/admin/menu/page.tsx — Menu Management
 *
 * Full interactive client manager for Weekly Menu items:
 *  - Grouped by day of the week (Sat to Thu)
 *  - Add & Edit item modal with image upload
 *  - Live toggle availability
 *  - Delete item with confirmation
 */

import { useState, useEffect } from 'react';
import { MenuItem, MenuTier } from '@/types';
import { PlusIcon, CloseIcon, FoodPlateIcon } from '@/components/SvgIcons';

const DAY_NAMES: Record<number, string> = {
  0: 'Saturday (Sat)',
  1: 'Sunday (Sun)',
  2: 'Monday (Mon)',
  3: 'Tuesday (Tue)',
  4: 'Wednesday (Wed)',
  5: 'Thursday (Thu)',
};

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form fields
  const [dayIndex, setDayIndex] = useState(0);
  const [tier, setTier] = useState<MenuTier>('standard');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(135);
  const [emoji, setEmoji] = useState('🍱');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    loadMenu();
  }, []);

  async function loadMenu() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/menu');
      const data = await res.json();
      if (data.success) {
        setItems(data.data || []);
      } else {
        setError(data.message || 'Failed to load menu items.');
      }
    } catch {
      setError('Network error while loading menu items.');
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingItem(null);
    setDayIndex(0);
    setTier('standard');
    setName('');
    setDescription('');
    setPrice(135);
    setEmoji('🍱');
    setImageUrl('');
    setModalOpen(true);
  }

  function openEditModal(item: MenuItem) {
    setEditingItem(item);
    setDayIndex(item.day_index);
    setTier(item.tier);
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price);
    setEmoji(item.emoji || '🍱');
    setImageUrl(item.image_url || '');
    setModalOpen(true);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setImageUrl(data.url);
      } else {
        alert(data.message || 'Image upload failed.');
      }
    } catch {
      alert('Network error during image upload.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      id: editingItem ? editingItem.id : undefined,
      day_index: Number(dayIndex),
      day_name: DAY_NAMES[Number(dayIndex)]?.split(' ')[0] || '',
      tier,
      name,
      description,
      price: Number(price),
      emoji,
      image_url: imageUrl || null,
    };

    try {
      const res = await fetch('/api/admin/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        loadMenu();
      } else {
        alert(data.message || 'Failed to save menu item.');
      }
    } catch {
      alert('Network error while saving menu item.');
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleAvailability(item: MenuItem) {
    try {
      const nextState = !item.is_available;
      // Optimistic update
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_available: nextState } : i))
      );

      const res = await fetch('/api/admin/menu', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, is_available: nextState }),
      });
      const data = await res.json();
      if (!data.success) {
        // Rollback
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, is_available: !nextState } : i))
        );
        alert(data.message || 'Failed to update availability.');
      }
    } catch {
      alert('Network error.');
    }
  }

  async function deleteItem(id: number) {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
      const res = await fetch(`/api/admin/menu?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      } else {
        alert(data.message || 'Failed to delete menu item.');
      }
    } catch {
      alert('Network error.');
    }
  }

  const grouped = items.reduce<Record<number, MenuItem[]>>((acc, item) => {
    (acc[item.day_index] ??= []).push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-xl font-bold tracking-tight">Weekly Menu Management</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            {items.length} items configured across 6 operational days
          </p>
        </div>
        <button
          onClick={openCreateModal}
          type="button"
          className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 shadow-lg shadow-red-950/40 flex items-center justify-center gap-2 bg-[#af0202]"
        >
          <PlusIcon className="w-4 h-4" /> Add Menu Item
        </button>
      </div>

      {error && (
        <div className="bg-red-950/50 border border-red-800 rounded-xl px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm">Loading weekly menu...</div>
      ) : (
        <div className="space-y-6">
          {[0, 1, 2, 3, 4, 5].map((dayIdx) => {
            const dayItems = grouped[dayIdx] || [];
            return (
              <div
                key={dayIdx}
                className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm"
              >
                <div className="px-5 py-3 border-b border-slate-800 bg-slate-800/40 flex items-center justify-between">
                  <h3 className="text-white font-semibold text-sm">
                    {DAY_NAMES[dayIdx]}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    {dayItems.length} items
                  </span>
                </div>

                {dayItems.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No items for this day. Click &quot;Add Menu Item&quot; to create one.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800">
                    {dayItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 hover:bg-slate-800/30 transition-colors"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          {item.image_url ? (
                            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-slate-700/80 bg-slate-800 shrink-0 shadow-sm">
                              <img
                                src={item.image_url.startsWith('/') || item.image_url.startsWith('http') ? item.image_url : `/${item.image_url}`}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center shrink-0 text-amber-400">
                              <FoodPlateIcon className="w-6 h-6" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-white font-medium text-sm truncate">{item.name}</p>
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${
                                  item.tier === 'premium'
                                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                                }`}
                              >
                                {item.tier}
                              </span>
                            </div>
                            <p className="text-slate-400 text-xs mt-1 line-clamp-1">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                          <span className="text-slate-200 font-bold tabular-nums text-sm">
                            Tk {item.price}
                          </span>

                          <button
                            onClick={() => toggleAvailability(item)}
                            className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                              item.is_available
                                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800 hover:bg-emerald-900/50'
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                            }`}
                          >
                            {item.is_available ? 'Available' : 'Disabled'}
                          </button>

                          <button
                            onClick={() => openEditModal(item)}
                            className="text-xs px-2.5 py-1 rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteItem(item.id)}
                            className="text-xs px-2.5 py-1 rounded-lg text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/60 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add / Edit Modal ────────────────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'Edit Menu Item' : 'Create New Menu Item'}
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
                    Day of Week
                  </label>
                  <select
                    value={dayIndex}
                    onChange={(e) => setDayIndex(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                  >
                    {[0, 1, 2, 3, 4, 5].map((d) => (
                      <option key={d} value={d}>
                        {DAY_NAMES[d]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Tier
                  </label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value as MenuTier)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                  >
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sonali Chicken Bhuna"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Description / Ingredients
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Miniket Rice, Sonali Chicken Bhuna, Bharta/Bhaji, Thick Dal, Salad."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Price (BDT)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Emoji Icon
                  </label>
                  <input
                    type="text"
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    placeholder="🍗"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                  Photo / Dish Image (Optional)
                </label>
                <div className="flex items-start gap-3.5 bg-slate-950/60 border border-slate-800/90 rounded-xl p-3">
                  {imageUrl ? (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-slate-700 bg-slate-900 shrink-0 shadow-md group">
                      <img
                        src={imageUrl.startsWith('/') || imageUrl.startsWith('http') ? imageUrl : `/${imageUrl}`}
                        alt="Menu preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="absolute -top-1 -right-1 bg-red-600 hover:bg-red-500 text-white rounded-full p-1 shadow cursor-pointer transition"
                        title="Remove image"
                      >
                        <CloseIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 border-dashed flex flex-col items-center justify-center text-slate-500 shrink-0">
                      <FoodPlateIcon className="w-6 h-6 text-slate-600" />
                      <span className="text-[9px] text-slate-500 mt-0.5">No photo</span>
                    </div>
                  )}

                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition shadow-sm border border-slate-700">
                        <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                      {imageUrl && (
                        <button
                          type="button"
                          onClick={() => setImageUrl('')}
                          className="text-[11px] px-2 py-1 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/40 transition cursor-pointer"
                        >
                          Clear Image
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Or enter image URL / path (/assets/...)"
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs placeholder-slate-500 truncate focus:outline-none focus:border-red-600"
                    />

                    {uploading && <p className="text-[11px] text-amber-400">Uploading new image file...</p>}
                    {imageUrl && (
                      <p className="text-[11px] text-emerald-400 truncate">
                        Attached: <span className="font-mono text-emerald-300">{imageUrl}</span>
                      </p>
                    )}
                  </div>
                </div>
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
                  {submitting ? 'Saving...' : editingItem ? 'Update Item' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
