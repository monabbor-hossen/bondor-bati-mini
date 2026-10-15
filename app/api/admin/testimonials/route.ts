/**
 * app/api/admin/testimonials/route.ts
 *
 * Admin Testimonials / Success Stories management:
 *  - GET: Fetch all testimonials
 *  - POST: Create or update testimonial
 *  - PATCH: Toggle visibility
 *  - DELETE: Delete testimonial
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { SuccessStory } from '@/types';

function normalizeAvatarUrl(url: string | null | undefined): string | null {
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
    const stories = await query<SuccessStory[]>(
      'SELECT * FROM success_stories ORDER BY created_at DESC'
    );
    const normalized = stories.map((s) => ({
      ...s,
      avatar_url: normalizeAvatarUrl(s.avatar_url),
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
    const { id, client_name, avatar_url, rating, content } = body;

    if (!client_name || !content) {
      return NextResponse.json(
        { success: false, message: 'Client name and testimonial content are required.' },
        { status: 400 }
      );
    }

    const ratingNum = Math.min(5, Math.max(1, Number(rating || 5)));
    const cleanAvatarUrl = normalizeAvatarUrl(avatar_url);

    if (id) {
      await query(
        'UPDATE success_stories SET client_name = ?, avatar_url = ?, rating = ?, content = ? WHERE id = ?',
        [client_name.trim(), cleanAvatarUrl, ratingNum, content.trim(), Number(id)]
      );
      return NextResponse.json({ success: true, message: 'Testimonial updated successfully.' });
    } else {
      await query(
        'INSERT INTO success_stories (client_name, avatar_url, rating, content, is_visible) VALUES (?, ?, ?, ?, 1)',
        [client_name.trim(), cleanAvatarUrl, ratingNum, content.trim()]
      );
      return NextResponse.json(
        { success: true, message: 'Testimonial created successfully.' },
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
    const { id, is_visible } = body;

    if (!id || is_visible === undefined) {
      return NextResponse.json(
        { success: false, message: 'ID and visibility status are required.' },
        { status: 400 }
      );
    }

    await query('UPDATE success_stories SET is_visible = ? WHERE id = ?', [
      is_visible ? 1 : 0,
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

    await query('DELETE FROM success_stories WHERE id = ?', [Number(id)]);

    return NextResponse.json({ success: true, message: 'Testimonial deleted successfully.' });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
