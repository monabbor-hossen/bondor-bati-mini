/**
 * app/api/admin/login/route.ts
 *
 * Admin login endpoint.
 * Accepts POST { username, password } via JSON or FormData.
 * Authenticates against `admins` table or initial development fallback.
 * Sets HTTP-only JWT session cookie.
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { createAdminToken, verifyPassword, ADMIN_COOKIE_NAME } from '@/lib/auth';

interface AdminDbRow {
  id: number;
  name: string;
  username: string;
  email: string;
  password_hash: string;
  role: 'superadmin' | 'manager';
  is_active: number | boolean;
}

export async function POST(request: NextRequest) {
  try {
    let username = '';
    let password = '';

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      username = (body.username || '').trim();
      password = body.password || '';
    } else {
      const formData = await request.formData();
      username = (formData.get('username')?.toString() || '').trim();
      password = formData.get('password')?.toString() || '';
    }

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required.' },
        { status: 400 }
      );
    }

    let user: AdminDbRow | null = null;

    try {
      const rows = await query<AdminDbRow[]>(
        'SELECT id, name, username, email, password_hash, role, is_active FROM admins WHERE username = ? AND is_active = 1 LIMIT 1',
        [username]
      );
      if (rows && rows.length > 0) {
        user = rows[0];
      }
    } catch (dbErr) {
      console.warn('[admin/login] DB query skipped or table not initialized:', dbErr);
    }

    let authenticated = false;

    if (user) {
      authenticated = await verifyPassword(password, user.password_hash);
    } else if (
      // Development fallback when database is not yet seeded
      (username === 'admin' && password === 'admin123') ||
      (process.env.DEFAULT_ADMIN_USER &&
        username === process.env.DEFAULT_ADMIN_USER &&
        password === (process.env.DEFAULT_ADMIN_PASSWORD || 'admin123'))
    ) {
      authenticated = true;
      user = {
        id: 1,
        name: 'Super Administrator',
        username: 'admin',
        email: 'admin@bondorbati.com',
        password_hash: '',
        role: 'superadmin',
        is_active: 1,
      };
    }

    if (!authenticated || !user) {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = await createAdminToken({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    });

    const isSecure = process.env.NODE_ENV === 'production';
    const isJson = contentType.includes('application/json');

    const response = isJson
      ? NextResponse.json({
          success: true,
          message: 'Login successful.',
          user: {
            id: user.id,
            name: user.name,
            username: user.username,
            role: user.role,
          },
        })
      : NextResponse.redirect(new URL('/admin', request.url), { status: 303 });

    // Set HTTP-only session cookie
    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('[admin/login] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error during authentication.' },
      { status: 500 }
    );
  }
}
