'use client';

/**
 * app/admin/admins/page.tsx — Admin Users Management
 *
 * Superadmin portal for managing administrative staff:
 *  - Create admin user with hashed password
 *  - Edit role (superadmin / manager)
 *  - Toggle active status
 *  - Delete account
 */

import { useState, useEffect } from 'react';
import { AdminUser, AdminRole } from '@/types';
import { PlusIcon, CloseIcon } from '@/components/SvgIcons';

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<AdminRole>('manager');

  useEffect(() => {
    loadAdmins();
  }, []);

  async function loadAdmins() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/admins');
      const data = await res.json();
      if (data.success) {
        setAdmins(data.data || []);
      } else {
        setError(data.message || 'Failed to load admin accounts.');
      }
    } catch {
      setError('Network error while loading admin accounts.');
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingAdmin(null);
    setName('');
    setUsername('');
    setEmail('');
    setPassword('');
    setRole('manager');
    setModalOpen(true);
  }

  function openEditModal(a: AdminUser) {
    setEditingAdmin(a);
    setName(a.name);
    setUsername(a.username);
    setEmail(a.email);
    setPassword('');
    setRole(a.role);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingAdmin?.id,
          name,
          username,
          email,
          password: password || undefined,
          role,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        loadAdmins();
      } else {
        alert(data.message || 'Failed to save admin account.');
      }
    } catch {
      alert('Network error.');
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleStatus(a: AdminUser) {
    try {
      const nextActive = !a.is_active;
      setAdmins((prev) =>
        prev.map((item) => (item.id === a.id ? { ...item, is_active: nextActive } : item))
      );

      const res = await fetch('/api/admin/admins', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: a.id, is_active: nextActive }),
      });
      const data = await res.json();
      if (!data.success) {
        setAdmins((prev) =>
          prev.map((item) => (item.id === a.id ? { ...item, is_active: !nextActive } : item))
        );
        alert(data.message || 'Failed to update admin status.');
      }
    } catch {
      alert('Network error.');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this admin user?')) return;
    try {
      const res = await fetch(`/api/admin/admins?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAdmins((prev) => prev.filter((a) => a.id !== id));
      } else {
        alert(data.message || 'Failed to delete admin.');
      }
    } catch {
      alert('Network error.');
    }
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-xl font-bold tracking-tight">System Administrators</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Manage administrative credentials, manager privileges, and portal access
          </p>
        </div>
        <button
          onClick={openCreateModal}
          type="button"
          className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 shadow-lg shadow-red-950/40 flex items-center justify-center gap-2 bg-[#af0202]"
        >
          <PlusIcon className="w-4 h-4" /> Add Admin User
        </button>
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
                <th className="px-3.5 sm:px-5 py-3">Name</th>
                <th className="px-3.5 sm:px-5 py-3">Username</th>
                <th className="px-3.5 sm:px-5 py-3">Email</th>
                <th className="px-3.5 sm:px-5 py-3">Role</th>
                <th className="px-3.5 sm:px-5 py-3">Status</th>
                <th className="px-3.5 sm:px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-500">
                    Loading administrators...
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-500">
                    No administrators found.
                  </td>
                </tr>
              ) : (
                admins.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white uppercase">
                          {a.name.charAt(0) || 'A'}
                        </div>
                        <span className="font-semibold text-white">{a.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-300">
                      {a.username}
                    </td>
                    <td className="px-5 py-4 text-slate-300 text-xs">{a.email}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider ${
                          a.role === 'superadmin'
                            ? 'bg-red-950/40 text-red-400 border border-red-800'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {a.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleStatus(a)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                          a.is_active
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800 hover:bg-emerald-900/50'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {a.is_active ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(a)}
                          className="text-xs px-2.5 py-1 rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="text-xs px-2.5 py-1 rounded-lg text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/60 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal ───────────────────────────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingAdmin ? 'Edit Admin User' : 'New Admin Account'}
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
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin_staff"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as AdminRole)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                  >
                    <option value="manager">Manager</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staff@bondorbati.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  {editingAdmin ? 'New Password (leave blank to keep current)' : 'Password'}
                </label>
                <input
                  type="password"
                  required={!editingAdmin}
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
                  {submitting ? 'Saving...' : editingAdmin ? 'Update Account' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
