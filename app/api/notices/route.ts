import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { MarqueeNotice } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DEFAULT_NOTICES: MarqueeNotice[] = [
  { id: 1, text: 'Order Cut-off Time: 10:00 PM for Next Day Lunch', icon: '⏰', display_order: 1, is_active: true },
  { id: 2, text: 'Serving specific delivery zones in Dhaka', icon: '🚚', display_order: 2, is_active: true },
  { id: 3, text: 'Authentic Chittagong Heritage Cuisine', icon: '🍱', display_order: 3, is_active: true },
];

async function ensureTable() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS marquee_notices (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        text VARCHAR(255) NOT NULL,
        icon VARCHAR(32) NOT NULL DEFAULT '📢',
        display_order INT UNSIGNED NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        KEY idx_marquee_active (is_active, display_order)
      ) ENGINE=InnoDB;
    `);

    const countRes = await query<{ count: number }[]>('SELECT COUNT(*) as count FROM marquee_notices');
    if (countRes[0]?.count === 0) {
      await query(`
        INSERT INTO marquee_notices (id, text, icon, display_order, is_active) VALUES
          (1, 'Order Cut-off Time: 10:00 PM for Next Day Lunch', '⏰', 1, 1),
          (2, 'Serving specific delivery zones in Dhaka', '🚚', 2, 1),
          (3, 'Authentic Chittagong Heritage Cuisine', '🍱', 3, 1)
        ON DUPLICATE KEY UPDATE text=VALUES(text);
      `);
    }
  } catch {
    // Gracefully handle if DB not reachable
  }
}

export async function GET(_req: NextRequest) {
  const headers = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
    Pragma: 'no-cache',
    Expires: '0',
  };

  try {
    await ensureTable();
    const rows = await query<MarqueeNotice[]>(`
      SELECT id, text, icon, display_order, is_active, created_at, updated_at
      FROM marquee_notices
      WHERE is_active = TRUE
      ORDER BY display_order ASC, id ASC
    `);

    // If query returned rows (active notices in DB)
    if (Array.isArray(rows)) {
      const data = rows.map((r) => ({ ...r, is_active: Boolean(r.is_active) }));
      return NextResponse.json(
        { success: true, data, message: null, errors: null, meta: null },
        { status: 200, headers }
      );
    }

    return NextResponse.json(
      { success: true, data: DEFAULT_NOTICES, message: null, errors: null, meta: null },
      { status: 200, headers }
    );
  } catch {
    return NextResponse.json(
      { success: true, data: DEFAULT_NOTICES, message: null, errors: null, meta: null },
      { status: 200, headers }
    );
  }
}
