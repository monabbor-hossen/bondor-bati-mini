import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { SuccessStory } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(_req: NextRequest) {
  const headers = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
    Pragma: 'no-cache',
    Expires: '0',
  };

  try {
    const stories = await query<SuccessStory[]>(`
      SELECT id, client_name, avatar_url, rating, content, is_visible, created_at
      FROM success_stories
      WHERE is_visible = TRUE
      ORDER BY id DESC
    `);

    return NextResponse.json(
      { success: true, data: stories || [] },
      { status: 200, headers }
    );
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500, headers }
    );
  }
}
