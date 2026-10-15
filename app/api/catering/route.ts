/**
 * app/api/catering/route.ts
 *
 * POST /api/catering
 * Replaces: POST /api/index.php → 'catering'  (CreateCateringBooking use-case)
 *
 * Requires: Authorization: Bearer <MOBILE_API_KEY>
 *
 * Flutter usage:
 *   await http.post(
 *     Uri.parse('$baseUrl/api/catering'),
 *     headers: {
 *       'Content-Type': 'application/json',
 *       'Authorization': 'Bearer $apiKey',
 *     },
 *     body: jsonEncode(cateringPayload),
 *   );
 */

import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { verifyMobileApiKey } from '@/lib/auth';
import {
  created,
  badRequest,
  unauthorised,
  serverError,
  unprocessable,
  corsOptions,
} from '@/lib/api-response';
import type { CreateCateringInput } from '@/types';
import { ResultSetHeader } from 'mysql2';

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return corsOptions();
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(body: unknown): {
  errors: Record<string, string> | null;
  data: CreateCateringInput | null;
} {
  if (!body || typeof body !== 'object') {
    return { errors: { body: 'Request body must be a JSON object.' }, data: null };
  }

  const b = body as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const menuName = String(b.menu_name || '').trim();
  if (!menuName || menuName.length < 2) {
    errors.menu_name = 'menu_name is required (min 2 characters).';
  }

  const guestCount = Number(b.guest_count);
  if (!guestCount || isNaN(guestCount) || guestCount < 10) {
    errors.guest_count = 'guest_count must be a number ≥ 10.';
  }

  const clientName = String(b.client_name || b.name || '').trim();
  if (!clientName || clientName.length < 2) {
    errors.client_name = 'client_name is required (min 2 characters).';
  }

  const rawPhone = String(b.phone || '').trim();
  const cleanPhone = rawPhone.replace(/[\s\-]/g, '').replace(/^(\+?88)/, '');
  if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
    errors.phone = 'Phone must be a valid Bangladeshi mobile number.';
  }

  let eventDate = '';
  const rawEventDate = String(b.event_date || '').trim();
  if (rawEventDate) {
    const d = new Date(rawEventDate);
    if (!isNaN(d.getTime())) {
      eventDate = d.toISOString().slice(0, 19).replace('T', ' ');
    } else if (/^\d{4}-\d{2}-\d{2}/.test(rawEventDate)) {
      eventDate = rawEventDate.length === 10 ? `${rawEventDate} 12:00:00` : rawEventDate;
    }
  }
  if (!eventDate) {
    errors.event_date = 'event_date is required (e.g. 2026-12-01).';
  }

  const venue = String(b.venue || '').trim();
  if (!venue || venue.length < 2) {
    errors.venue = 'venue is required (min 2 characters).';
  }

  if (Object.keys(errors).length > 0) return { errors, data: null };

  return {
    errors: null,
    data: {
      menu_name: menuName,
      guest_count: guestCount,
      client_name: clientName,
      phone: cleanPhone,
      event_date: eventDate,
      venue,
      notes: b.notes ? String(b.notes).trim() : undefined,
    },
  };
}

// ─── Generate booking number ──────────────────────────────────────────────────

function generateBookingNumber(): string {
  const ts = Date.now().toString().slice(-6);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 8);
  return `BC-${ts}-${rand}`;
}

// ─── POST handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // If an Authorization header is sent (e.g. from mobile app), verify it
  const authHeader = req.headers.get('authorization');
  if (authHeader && !verifyMobileApiKey(req)) {
    return unauthorised('A valid Bearer API key is required to submit catering bookings via API.');
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return badRequest('Request body must be valid JSON.');
  }

  const { errors, data } = validate(rawBody);
  if (errors || !data) {
    return unprocessable('Validation failed.', errors ?? undefined);
  }

  try {
    const bookingNumber = generateBookingNumber();

    const result = await query<ResultSetHeader>(
      `INSERT INTO catering_bookings
         (booking_number, menu_name, guest_count, client_name, phone, event_date, venue, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        bookingNumber,
        data.menu_name,
        data.guest_count,
        data.client_name,
        data.phone,
        data.event_date,
        data.venue,
        data.notes ?? null,
      ],
    );

    return created({
      booking_number: bookingNumber,
      id: (result as ResultSetHeader).insertId,
      status: 'pending',
    }, 'Catering booking submitted successfully. Our team will contact you shortly.');
  } catch (err) {
    console.error('[api/catering] POST error:', err);
    return serverError();
  }
}
