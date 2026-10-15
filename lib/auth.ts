/**
 * lib/auth.ts
 *
 * Authentication utilities:
 *  1. Admin Panel – JWT session stored in HTTP-only cookie ('bondor_bati_admin_session')
 *  2. Admin Passwords – bcrypt hashing & verification via bcryptjs
 *  3. Mobile API (Flutter) – Bearer token verification with MOBILE_API_KEY
 */

import { NextRequest } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

export const ADMIN_COOKIE_NAME = 'bondor_bati_admin_session';

const JWT_SECRET_STRING =
  process.env.ADMIN_JWT_SECRET || 'bondor-bati-admin-secret-key-32-chars-long-2026';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

export type AdminRole = 'superadmin' | 'manager';

export interface AdminSession {
  id: number;
  username: string;
  name: string;
  role: AdminRole;
}

// ─── JWT Session Helpers ──────────────────────────────────────────────────────

/**
 * Sign a JWT for an admin user, valid for 7 days.
 */
export async function createAdminToken(session: AdminSession): Promise<string> {
  return await new SignJWT({
    id: session.id,
    username: session.username,
    name: session.name,
    role: session.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

/**
 * Verify and decode an admin JWT token. Returns null if invalid or expired.
 */
export async function verifyAdminToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload || typeof payload !== 'object') return null;

    return {
      id: Number(payload.id),
      username: String(payload.username || ''),
      name: String(payload.name || ''),
      role: (payload.role === 'superadmin' ? 'superadmin' : 'manager') as AdminRole,
    };
  } catch {
    return null;
  }
}

/**
 * Read and verify the admin session from request cookies or NextRequest.
 */
export async function getAdminSession(
  request?: NextRequest | Request
): Promise<AdminSession | null> {
  let token: string | undefined;

  if (request && 'cookies' in request && typeof request.cookies.get === 'function') {
    token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  } else if (typeof document !== 'undefined') {
    // Client-side fallback if needed
    const match = document.cookie.match(new RegExp(`(^| )${ADMIN_COOKIE_NAME}=([^;]+)`));
    token = match ? match[2] : undefined;
  }

  if (!token) return null;
  return await verifyAdminToken(token);
}

export async function isAdminAuthenticated(request: NextRequest): Promise<boolean> {
  const session = await getAdminSession(request);
  return session !== null;
}

export async function isSuperAdmin(request: NextRequest): Promise<boolean> {
  const session = await getAdminSession(request);
  return session?.role === 'superadmin';
}

// ─── Password Hashing ─────────────────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// ─── Mobile API Key Auth (Flutter) ────────────────────────────────────────────

/**
 * Verify the Bearer token sent by the Flutter mobile app.
 * Flutter usage:
 *   headers: { 'Authorization': 'Bearer <MOBILE_API_KEY>' }
 */
export function verifyMobileApiKey(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization') ?? '';
  if (!authHeader.startsWith('Bearer ')) return false;

  const token = authHeader.slice(7).trim();
  const apiKey = process.env.MOBILE_API_KEY;

  if (!apiKey) {
    console.warn('[auth] MOBILE_API_KEY is not set in environment variables');
    return false;
  }

  return token === apiKey;
}
