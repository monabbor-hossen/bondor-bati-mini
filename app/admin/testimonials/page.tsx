'use client';

/**
 * app/admin/testimonials/page.tsx — Testimonials Management
 *
 * Interactive testimonials manager:
 *  - Create & Edit customer reviews
 *  - Client profile photo upload & URL support
 *  - Rating stars (1–5) with vector SVG icons
 *  - Toggle visibility
 *  - Delete review
 */

import { useState, useEffect } from 'react';
import { SuccessStory } from '@/types';
import { PlusIcon, CloseIcon } from '@/components/SvgIcons';

export default function AdminTestimonialsPage() {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<SuccessStory | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form
  const [clientName, setClientName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');

  useEffect(() => {
    loadTestimonials();
  }, []);

  async function loadTestimonials() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/testimonials');
      const data = await res.json();
      if (data.success) {
        setStories(data.data || []);
      } else {
        setError(data.message || 'Failed to load testimonials.');
      }
    } catch {
      setError('Network error while loading testimonials.');
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingStory(null);
    setClientName('');
    setAvatarUrl('');
    setRating(5);
    setContent('');
    setModalOpen(true);
  }

  function openEditModal(s: SuccessStory) {
    setEditingStory(s);
    setClientName(s.client_name);
    setAvatarUrl(s.avatar_url || '');
    setRating(s.rating);
    setContent(s.content);
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
        setAvatarUrl(data.url);
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

    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingStory?.id,
          client_name: clientName,
          avatar_url: avatarUrl.trim() || undefined,
          rating,
          content,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        loadTestimonials();
      } else {
        alert(data.message || 'Failed to save testimonial.');
      }
    } catch {
      alert('Network error.');
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleVisibility(s: SuccessStory) {
    try {
      const nextVisible = !s.is_visible;
      setStories((prev) =>
        prev.map((item) => (item.id === s.id ? { ...item, is_visible: nextVisible } : item))
      );

      const res = await fetch('/api/admin/testimonials', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: s.id, is_visible: nextVisible }),
      });
      const data = await res.json();
      if (!data.success) {
        setStories((prev) =>
          prev.map((item) => (item.id === s.id ? { ...item, is_visible: !nextVisible } : item))
        );
        alert(data.message || 'Failed to update visibility.');
      }
    } catch {
      alert('Network error.');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setStories((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert(data.message || 'Failed to delete testimonial.');
      }
    } catch {
      alert('Network error.');
    }
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-xl font-bold tracking-tight">Testimonials & Reviews</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Customer feedback displayed on the website and mobile app
          </p>
        </div>
        <button
          onClick={openCreateModal}
          type="button"
          className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 shadow-lg shadow-red-950/40 flex items-center justify-center gap-2 bg-[#af0202]"
        >
          <PlusIcon className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      {error && (
        <div className="bg-red-950/50 border border-red-800 rounded-xl px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm">Loading testimonials...</div>
      ) : stories.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <p className="text-slate-400 text-sm">No testimonials added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stories.map((s) => (
            <div
              key={s.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm transition-all"
            >
              <div>
                {/* Top: Avatar, Name, Rating & Status Badge */}
                <div className="flex items-start justify-between gap-2.5 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {s.avatar_url ? (
                      <img
                        src={s.avatar_url.startsWith('/') || s.avatar_url.startsWith('http') ? s.avatar_url : `/${s.avatar_url}`}
                        alt={s.client_name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-700/80 shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#af0202] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                        {(s.client_name || 'C').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm leading-tight truncate">
                        {s.client_name}
                      </p>
                      <div className="flex text-amber-400 gap-0.5 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill={i < s.rating ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className={i < s.rating ? 'text-amber-400' : 'text-slate-600'}
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleVisibility(s)}
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border transition shrink-0 cursor-pointer ${
                      s.is_visible
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {s.is_visible ? 'Published' : 'Hidden'}
                  </button>
                </div>

                {/* Review Text */}
                <p className="text-slate-300 text-xs sm:text-[13px] leading-relaxed mb-3 line-clamp-3 italic">
                  &quot;{s.content}&quot;
                </p>
              </div>

              {/* Card Footer: Date & Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono text-[11px]">
                  {s.created_at ? String(s.created_at).slice(0, 10) : ''}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEditModal(s)}
                    className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition font-medium text-xs cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(s.id)}
                    className="px-2.5 py-1 rounded-lg text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/60 transition font-medium text-xs cursor-pointer"
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
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingStory ? 'Edit Testimonial' : 'New Testimonial'}
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
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Client / Customer Name
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                />
              </div>

              {/* Profile Photo (Upload or URL) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Profile Photo (Optional)
                </label>
                <div className="flex items-center gap-3">
                  {avatarUrl ? (
                    <div className="relative w-12 h-12 shrink-0">
                      <img
                        src={avatarUrl.startsWith('/') || avatarUrl.startsWith('http') ? avatarUrl : `/${avatarUrl}`}
                        alt="Avatar Preview"
                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-700"
                      />
                      <button
                        type="button"
                        onClick={() => setAvatarUrl('')}
                        className="absolute -top-1 -right-1 bg-red-600 hover:bg-red-500 text-white rounded-full p-0.5 shadow cursor-pointer"
                        title="Remove Photo"
                      >
                        <CloseIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold text-sm shrink-0">
                      {(clientName || 'C').charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="flex-1 space-y-1.5 min-w-0">
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer transition">
                      <span>{uploading ? 'Uploading...' : 'Upload Image File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="Or paste image URL (https://...)"
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs truncate"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition hover:scale-110 cursor-pointer p-0.5"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill={star <= rating ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className={star <= rating ? 'text-amber-400' : 'text-slate-600'}
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  ))}
                  <span className="text-xs text-slate-400 ml-2">({rating} / 5 stars)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Testimonial / Review Text
                </label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="e.g. Authentic Chittagong flavors that I can enjoy at my office desk..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#af0202] hover:opacity-90 disabled:opacity-50 transition shadow-lg shadow-red-950/40"
                >
                  {submitting ? 'Saving...' : editingStory ? 'Update Review' : 'Create Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
