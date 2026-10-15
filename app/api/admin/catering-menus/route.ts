/**
 * app/api/admin/catering-menus/route.ts
 *
 * Admin Catering Packages management:
 *  - GET: Fetch all catering menus
 *  - POST: Create or update catering menu
 *  - PATCH: Toggle active status
 *  - DELETE: Delete catering menu
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { CateringMenu } from '@/types';

export async function GET(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const menus = await query<CateringMenu[]>(
      'SELECT * FROM catering_menus ORDER BY FIELD(category, "regular", "premium", "holud", "bride", "box"), id ASC'
    );
    return NextResponse.json({ success: true, data: menus });
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
    const { id, category, badge_text, title, items } = body;

    if (!category || !title || !items) {
      return NextResponse.json(
        { success: false, message: 'Category, title, and items are required.' },
        { status: 400 }
      );
    }

    if (id) {
      await query(
        'UPDATE catering_menus SET category = ?, badge_text = ?, title = ?, items = ? WHERE id = ?',
        [category.trim(), (badge_text || '').trim(), title.trim(), items.trim(), Number(id)]
      );
      return NextResponse.json({ success: true, message: 'Catering package updated successfully.' });
    } else {
      await query(
        'INSERT INTO catering_menus (category, badge_text, title, items, is_active) VALUES (?, ?, ?, ?, 1)',
        [category.trim(), (badge_text || '').trim(), title.trim(), items.trim()]
      );
      return NextResponse.json(
        { success: true, message: 'Catering package created successfully.' },
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
    const { id, is_active } = body;

    if (!id || is_active === undefined) {
      return NextResponse.json(
        { success: false, message: 'ID and active status are required.' },
        { status: 400 }
      );
    }

    await query('UPDATE catering_menus SET is_active = ? WHERE id = ?', [
      is_active ? 1 : 0,
      Number(id),
    ]);

    return NextResponse.json({ success: true, message: 'Visibility updated successfully.' });
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
      return NextResponse.json({ success: false, message: 'ID is required.' }, { status: 400 });
    }

    await query('DELETE FROM catering_menus WHERE id = ?', [Number(id)]);

    return NextResponse.json({ success: true, message: 'Catering package deleted successfully.' });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
