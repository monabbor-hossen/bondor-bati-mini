/**
 * app/api/admin/menu/route.ts
 *
 * Admin Menu Items management:
 *  - GET: Fetch all menu items
 *  - POST: Create or update a menu item
 *  - PATCH: Toggle menu item availability
 *  - DELETE: Delete a menu item
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { MenuItem } from '@/types';

function normalizeImageUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string' || !url.trim()) return null;
  const trimmed = url.trim();
  if (trimmed.startsWith('/') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `/${trimmed}`;
}

export async function GET(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const items = await query<MenuItem[]>(
      'SELECT * FROM menu_items ORDER BY day_index ASC, FIELD(tier, "standard", "premium")'
    );
    const normalized = items.map((item) => ({
      ...item,
      image_url: normalizeImageUrl(item.image_url),
    }));
    return NextResponse.json({ success: true, data: normalized });
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
    const body = await request.json();
    const { id, day_index, day_name, tier, name, description, price, emoji, image_url } = body;

    if (!name || day_index === undefined || !tier || !price) {
      return NextResponse.json(
        { success: false, message: 'Day, tier, name, and price are required.' },
        { status: 400 }
      );
    }

    const cleanImageUrl = normalizeImageUrl(image_url);

    if (id) {
      await query(
        `UPDATE menu_items 
         SET day_index = ?, day_name = ?, tier = ?, name = ?, description = ?, price = ?, emoji = ?, image_url = ?
         WHERE id = ?`,
        [
          Number(day_index),
          day_name || '',
          tier,
          name,
          description || '',
          Number(price),
          emoji || '🍱',
          cleanImageUrl,
          Number(id),
        ]
      );
      return NextResponse.json({ success: true, message: 'Menu item updated successfully.' });
    } else {
      await query(
        `INSERT INTO menu_items (day_index, day_name, tier, name, description, price, emoji, image_url, is_available)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          Number(day_index),
          day_name || '',
          tier,
          name,
          description || '',
          Number(price),
          emoji || '🍱',
          cleanImageUrl,
        ]
      );
      return NextResponse.json(
        { success: true, message: 'Menu item created successfully.' },
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
    const body = await request.json();
    const { id, is_available } = body;

    if (!id || is_available === undefined) {
      return NextResponse.json(
        { success: false, message: 'Item ID and availability status are required.' },
        { status: 400 }
      );
    }

    await query('UPDATE menu_items SET is_available = ? WHERE id = ?', [
      is_available ? 1 : 0,
      Number(id),
    ]);

    return NextResponse.json({ success: true, message: 'Availability updated successfully.' });
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Item ID is required.' }, { status: 400 });
    }

    await query('DELETE FROM menu_items WHERE id = ?', [Number(id)]);

    return NextResponse.json({ success: true, message: 'Menu item deleted successfully.' });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
