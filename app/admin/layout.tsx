/**
 * app/admin/layout.tsx
 *
 * Admin panel layout shell.
 * Renders metadata and delegates to AdminShell client wrapper.
 */

import type { Metadata } from 'next';
import { AdminShell } from '@/components/admin/admin-shell';

export const metadata: Metadata = {
  title: {
    default: 'Admin Panel',
    template: '%s — Bondor Bati Admin',
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
