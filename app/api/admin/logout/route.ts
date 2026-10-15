/**
 * app/api/admin/logout/route.ts
 *
 * Clears the admin session cookie and redirects to /admin/login (or returns JSON).
 */

import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const isJson = request.headers.get('accept')?.includes('application/json');

  const response = isJson
    ? NextResponse.json({ success: true, message: 'Logged out successfully.' })
    : NextResponse.redirect(new URL('/admin/login', request.url), { status: 303 });

  response.cookies.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  return response;
}

export async function GET(request: NextRequest) {
  // Allow GET logout links as fallback
  const response = NextResponse.redirect(new URL('/admin/login', request.url), { status: 303 });
  response.cookies.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  return response;
}
