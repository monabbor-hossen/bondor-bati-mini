/**
 * app/admin/page.tsx  — Admin Dashboard
 *
 * Server Component: fetches stats directly from DB, no loading state needed.
 * Mirrors the 'dashboard' case in AdminController.php.
 *
 * Sections:
 *  - KPI cards (orders, revenue, pending, catering)
 *  - Recent orders table
 *  - Quick-action links
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { query } from '@/lib/db';
import type { Order, DashboardCounts, RevenuePoint } from '@/types';
import { RowDataPacket } from 'mysql2';

export const metadata: Metadata = { title: 'Dashboard' };
export const dynamic = 'force-dynamic';

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getDashboardData() {
  try {
    const [counts] = await query<(DashboardCounts & RowDataPacket)[]>(`
      SELECT
        COUNT(*)                                                          AS total_orders,
        SUM(status = 'pending')                                          AS pending_orders,
        COALESCE(SUM(CASE WHEN status = 'delivered' THEN total END), 0) AS total_revenue,
        (SELECT COUNT(*) FROM catering_bookings WHERE status = 'pending') AS catering_pending,
        (SELECT COUNT(*) FROM menu_items)                                 AS total_menu_items,
        (SELECT COUNT(*) FROM success_stories)                            AS total_testimonials
      FROM orders
    `);

    const revenue = await query<RevenuePoint[]>(`
      SELECT
        DATE(created_at) AS date,
        COALESCE(SUM(CASE WHEN status = 'delivered' THEN total END), 0) AS revenue
      FROM orders
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    const recentOrders = await query<(Order & RowDataPacket)[]>(`
      SELECT id, order_number, customer_name, phone, total, status, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 5
    `);

    return { counts, revenue, recentOrders, error: null };
  } catch (err) {
    console.error('[admin/dashboard] DB error:', err);
    return {
      counts: null,
      revenue: [],
      recentOrders: [],
      error: 'Could not connect to database. Check your .env.local configuration.',
    };
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({
  id,
  label,
  value,
  sub,
  color,
  icon,
}: {
  id: string;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      id={id}
      className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex items-start gap-4 hover:border-slate-700 transition-colors"
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider truncate">{label}</p>
        <p className="text-white text-2xl font-bold mt-0.5 tabular-nums">{value}</p>
        {sub && <p className="text-slate-500 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-400',
  confirmed: 'bg-blue-500/15 text-blue-400',
  preparing: 'bg-violet-500/15 text-violet-400',
  out_for_delivery: 'bg-pink-500/15 text-pink-400',
  delivered: 'bg-emerald-500/15 text-emerald-400',
  cancelled: 'bg-slate-600/30 text-slate-400',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminDashboardPage() {
  const { counts, recentOrders, error } = await getDashboardData();

  return (
    <div className="space-y-6 max-w-7xl">

      {/* Page header */}
      <div>
        <h2 className="text-white text-xl font-bold">Overview</h2>
        <p className="text-slate-400 text-sm mt-0.5">
          Welcome back! Here&apos;s what&apos;s happening with Bondor Bati today.
        </p>
      </div>

      {/* DB error banner */}
      {error && (
        <div
          id="admin-db-error-banner"
          className="bg-red-950/50 border border-red-800 rounded-xl px-4 py-3 text-red-400 text-sm flex items-start gap-2"
          role="alert"
        >
          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span><strong>Database error:</strong> {error}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          id="kpi-total-orders"
          label="Total Orders"
          value={counts?.total_orders ?? '—'}
          sub={`${counts?.pending_orders ?? 0} pending`}
          color="bg-blue-600/20 text-blue-400"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
        />
        <KpiCard
          id="kpi-total-revenue"
          label="Total Revenue"
          value={counts ? `Tk ${Number(counts.total_revenue).toLocaleString('en-US')}` : '—'}
          sub="from delivered orders"
          color="bg-emerald-600/20 text-emerald-400"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <KpiCard
          id="kpi-catering-pending"
          label="Catering Bookings"
          value={counts?.catering_pending ?? '—'}
          sub="awaiting confirmation"
          color="bg-violet-600/20 text-violet-400"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <KpiCard
          id="kpi-menu-items"
          label="Menu Items"
          value={counts?.total_menu_items ?? '—'}
          sub={`${counts?.total_testimonials ?? 0} testimonials`}
          color="bg-amber-600/20 text-amber-400"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {[
          { label: 'View Orders', href: '/admin/orders', id: 'qa-orders' },
          { label: 'Manage Menu', href: '/admin/menu', id: 'qa-menu' },
          { label: 'Catering', href: '/admin/catering', id: 'qa-catering' },
          { label: 'Catering Menus', href: '/admin/catering-menus', id: 'qa-catering-menus' },
          { label: 'Testimonials', href: '/admin/testimonials', id: 'qa-testimonials' },
          { label: 'Marquee Bar', href: '/admin/notices', id: 'qa-notices' },
          { label: 'Admin Users', href: '/admin/admins', id: 'qa-admins' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            id={item.id}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-3 text-slate-300 text-sm font-medium text-center hover:bg-slate-800 hover:text-white hover:border-slate-700 transition-all duration-150"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <h3 className="text-white font-semibold text-sm">Recent Orders</h3>
          <Link
            href="/admin/orders"
            id="view-all-orders-link"
            className="text-red-400 text-xs hover:text-red-300 transition-colors font-medium"
          >
            View all →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-10">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm" id="admin-recent-orders-table">
              <thead>
                <tr className="border-b border-slate-800">
                  {['Order #', 'Customer', 'Phone', 'Total', 'Status', 'Date'].map((h) => (
                    <th
                      key={h}
                      className="text-left text-slate-400 font-medium text-xs uppercase tracking-wide px-3.5 sm:px-5 py-3 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-5 py-3 font-mono text-slate-300 text-xs whitespace-nowrap">
                      {order.order_number}
                    </td>
                    <td className="px-5 py-3 text-white font-medium whitespace-nowrap">
                      {order.customer_name}
                    </td>
                    <td className="px-5 py-3 text-slate-400 whitespace-nowrap">
                      {order.phone}
                    </td>
                    <td className="px-5 py-3 text-slate-200 font-semibold tabular-nums whitespace-nowrap">
                      Tk {Number(order.total).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status] ?? 'bg-slate-600/20 text-slate-400'}`}
                      >
                        {STATUS_LABELS[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-500 text-xs whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* API quick-links for Flutter testing */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
        <h3 className="text-white font-semibold text-sm mb-3">API Endpoints (Flutter)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { method: 'GET', path: '/api/health', id: 'api-link-health' },
            { method: 'GET', path: '/api/menu', id: 'api-link-menu' },
            { method: 'POST', path: '/api/orders', id: 'api-link-orders' },
            { method: 'GET', path: '/api/orders/track?order_number=&phone=', id: 'api-link-track' },
            { method: 'POST', path: '/api/catering', id: 'api-link-catering' },
          ].map((ep) => (
            <a
              key={ep.id}
              id={ep.id}
              href={ep.method === 'GET' ? ep.path : undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 font-mono text-xs bg-slate-800 rounded-lg px-3 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${ep.method === 'GET' ? 'bg-emerald-600/20 text-emerald-400' : 'bg-orange-600/20 text-orange-400'}`}
              >
                {ep.method}
              </span>
              {ep.path}
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}
