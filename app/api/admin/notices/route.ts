/**
 * app/api/admin/notices/route.ts
 *
 * Admin Marquee Notices management:
 *  - GET: Fetch all marquee notices (active & inactive)
 *  - POST: Create or update notice
 *  - PATCH: Toggle active status
 *  - DELETE: Delete notice
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import type { MarqueeNotice } from '@/types';

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
    // DB handled gracefully
  }
}

export async function GET(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await ensureTable();
    const rows = await query<MarqueeNotice[]>(
      'SELECT id, text, icon, display_order, is_active, created_at, updated_at FROM marquee_notices ORDER BY display_order ASC, id ASC'
    );
    const notices = rows.map((r) => ({ ...r, is_active: Boolean(r.is_active) }));
    return NextResponse.json(
      { success: true, data: notices },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        },
      }
    );
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await ensureTable();
    const body = await request.json();
    const { id, text, icon, display_order, is_active } = body;

    if (!text || !text.trim()) {
      return NextResponse.json(
        { success: false, message: 'Notice text is required.' },
        { status: 400 }
      );
    }

    const cleanText = text.trim();
    const cleanIcon = (icon || '📢').trim();
    const orderNum = Number(display_order) || 0;
    const activeVal = is_active !== false ? 1 : 0;

    if (id) {
      await query(
        'UPDATE marquee_notices SET text = ?, icon = ?, display_order = ?, is_active = ? WHERE id = ?',
        [cleanText, cleanIcon, orderNum, activeVal, Number(id)]
      );
      return NextResponse.json({ success: true, message: 'Notice updated successfully.' });
    } else {
      await query(
        'INSERT INTO marquee_notices (text, icon, display_order, is_active) VALUES (?, ?, ?, ?)',
        [cleanText, cleanIcon, orderNum, activeVal]
      );
      return NextResponse.json(
        { success: true, message: 'Notice created successfully.' },
        { status: 201 }
      );
    }
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await ensureTable();
    const body = await request.json();
    const { id, is_active } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Notice ID is required.' }, { status: 400 });
    }

    await query('UPDATE marquee_notices SET is_active = ? WHERE id = ?', [
      is_active ? 1 : 0,
      Number(id),
    ]);

    return NextResponse.json({ success: true, message: 'Notice status updated.' });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await ensureTable();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Notice ID is required.' }, { status: 400 });
    }

    await query('DELETE FROM marquee_notices WHERE id = ?', [Number(id)]);
    return NextResponse.json({ success: true, message: 'Notice deleted successfully.' });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
