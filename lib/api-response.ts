/**
 * lib/api-response.ts
 *
 * Standardised JSON response helpers for Next.js API Routes.
 * Every response follows the same envelope structure so the Flutter
 * mobile app can rely on a consistent shape for all endpoints.
 *
 * Envelope shape:
 * {
 *   "success": true | false,
 *   "data":    <payload>   | null,
 *   "message": <string>    | null,
 *   "errors":  <object>    | null,   // field-level validation errors
 *   "meta":    <object>    | null,   // pagination, timestamps, etc.
 * }
 */

import { NextResponse } from 'next/server';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiEnvelope<T = unknown> {
  success: boolean;
  data: T | null;
  message: string | null;
  errors: Record<string, string> | null;
  meta: Record<string, unknown> | null;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

// ─── Core builder ─────────────────────────────────────────────────────────────

function buildEnvelope<T>(
  success: boolean,
  data: T | null,
  message: string | null,
  errors: Record<string, string> | null,
  meta: Record<string, unknown> | null,
): ApiEnvelope<T> {
  return { success, data, message, errors, meta };
}

// ─── Shared CORS / cache headers ─────────────────────────────────────────────

/**
 * Default headers attached to every API response.
 * Adjust the CORS origin for production.
 */
const BASE_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
  // Allow Flutter (or any client) to call from any origin in dev.
  // In production, replace '*' with your actual Flutter app origin or remove it.
  'Access-Control-Allow-Origin': process.env.CORS_ORIGIN ?? '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Api-Key',
};

// ─── Response factories ───────────────────────────────────────────────────────

/** 200 OK – generic success */
export function ok<T>(
  data: T,
  message?: string,
  meta?: Record<string, unknown>,
): NextResponse<ApiEnvelope<T>> {
  return NextResponse.json(
    buildEnvelope(true, data, message ?? null, null, meta ?? null),
    { status: 200, headers: BASE_HEADERS },
  );
}

/** 201 Created – resource successfully created */
export function created<T>(
  data: T,
  message = 'Resource created successfully.',
): NextResponse<ApiEnvelope<T>> {
  return NextResponse.json(
    buildEnvelope(true, data, message, null, null),
    { status: 201, headers: BASE_HEADERS },
  );
}

/** 400 Bad Request – client sent invalid data */
export function badRequest(
  message = 'Invalid request.',
  errors?: Record<string, string>,
): NextResponse<ApiEnvelope<null>> {
  return NextResponse.json(
    buildEnvelope(false, null, message, errors ?? null, null),
    { status: 400, headers: BASE_HEADERS },
  );
}

/** 401 Unauthorised – missing or invalid credentials */
export function unauthorised(
  message = 'Unauthorised. Please provide a valid API key or session.',
): NextResponse<ApiEnvelope<null>> {
  return NextResponse.json(
    buildEnvelope(false, null, message, null, null),
    { status: 401, headers: BASE_HEADERS },
  );
}

/** 403 Forbidden – authenticated but lacking permission */
export function forbidden(
  message = 'You do not have permission to perform this action.',
): NextResponse<ApiEnvelope<null>> {
  return NextResponse.json(
    buildEnvelope(false, null, message, null, null),
    { status: 403, headers: BASE_HEADERS },
  );
}

/** 404 Not Found */
export function notFound(
  message = 'The requested resource was not found.',
): NextResponse<ApiEnvelope<null>> {
  return NextResponse.json(
    buildEnvelope(false, null, message, null, null),
    { status: 404, headers: BASE_HEADERS },
  );
}

/** 409 Conflict – e.g. duplicate idempotency key */
export function conflict(
  message = 'A conflict occurred. This resource may already exist.',
): NextResponse<ApiEnvelope<null>> {
  return NextResponse.json(
    buildEnvelope(false, null, message, null, null),
    { status: 409, headers: BASE_HEADERS },
  );
}

/** 422 Unprocessable Entity – semantic validation failure */
export function unprocessable(
  message = 'Validation failed.',
  errors?: Record<string, string>,
): NextResponse<ApiEnvelope<null>> {
  return NextResponse.json(
    buildEnvelope(false, null, message, errors ?? null, null),
    { status: 422, headers: BASE_HEADERS },
  );
}

/** 500 Internal Server Error */
export function serverError(
  message = 'The service is temporarily unavailable. Please try again later.',
): NextResponse<ApiEnvelope<null>> {
  return NextResponse.json(
    buildEnvelope(false, null, message, null, null),
    { status: 500, headers: BASE_HEADERS },
  );
}

/** Preflight CORS handler — attach to every route's OPTIONS export */
export function corsOptions(): NextResponse {
  return new NextResponse(null, { status: 204, headers: BASE_HEADERS });
}

// ─── Pagination helper ────────────────────────────────────────────────────────

/** Build a standardised paginated response */
export function paginated<T>(
  data: T[],
  page: number,
  perPage: number,
  total: number,
): NextResponse<ApiEnvelope<T[]>> {
  const meta: PaginationMeta = {
    page,
    per_page: perPage,
    total,
    total_pages: Math.ceil(total / perPage),
  };
  return NextResponse.json(
    buildEnvelope(true, data, null, null, meta as unknown as Record<string, unknown>),
    { status: 200, headers: BASE_HEADERS },
  );
}
