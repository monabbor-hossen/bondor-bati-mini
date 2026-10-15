/**
 * app/api/admin/me/route.ts
 *
 * Returns the currently authenticated admin session user.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getAdminSession(request);

  if (!session) {
    return NextResponse.json(
      { success: false, message: 'Unauthenticated' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    user: session,
  });
}
