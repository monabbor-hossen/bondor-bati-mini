/**
 * proxy.ts (Next.js 16 route protection)
 *
 * Edge Proxy for route protection:
 *  - Protects /admin/** routes (redirects unauthenticated users to /admin/login)
 *  - Redirects logged-in admins visiting /admin/login back to /admin
 */

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const ADMIN_COOKIE_NAME = 'bondor_bati_admin_session';
const JWT_SECRET_STRING =
  process.env.ADMIN_JWT_SECRET || 'bondor-bati-admin-secret-key-32-chars-long-2026';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (payload && payload.id) {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // If visiting /admin/login while already logged in -> redirect to /admin
  if (pathname === '/admin/login') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // If visiting any protected /admin route while not logged in -> redirect to /admin/login
  if (!isAuthenticated) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
