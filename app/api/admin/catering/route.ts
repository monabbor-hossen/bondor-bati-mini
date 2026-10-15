/**
 * app/api/admin/catering/route.ts
 *
 * Admin Catering Bookings management:
 *  - GET: List bookings with filter & pagination
 *  - PATCH: Update booking status (pending, confirmed, completed, cancelled)
 *  - DELETE: Delete a booking
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { CateringBooking, CateringStatus } from '@/types';

const VALID_STATUSES: CateringStatus[] = ['pending', 'confirmed', 'completed', 'cancelled'];

export async function GET(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const limit = Math.max(1, Math.min(100, Number(searchParams.get('limit') || 20)));
    const offset = (page - 1) * limit;

    let sql = 'SELECT * FROM catering_bookings';
    const params: (string | number)[] = [];

    if (status && VALID_STATUSES.includes(status as CateringStatus)) {
      sql += ' WHERE status = ?';
      params.push(status);
    }

    sql += ' ORDER BY event_date DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const bookings = await query<CateringBooking[]>(sql, params);

    return NextResponse.json({
      success: true,
      data: bookings,
      meta: { page, limit },
    });
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
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: 'Booking ID and status are required.' },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, message: `Invalid status: ${status}` },
        { status: 400 }
      );
    }

    await query('UPDATE catering_bookings SET status = ? WHERE id = ?', [status, Number(id)]);

    return NextResponse.json({
      success: true,
      message: `Booking #${id} status updated to ${status}.`,
    });
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
      return NextResponse.json({ success: false, message: 'Booking ID is required.' }, { status: 400 });
    }

    await query('DELETE FROM catering_bookings WHERE id = ?', [Number(id)]);

    return NextResponse.json({ success: true, message: 'Booking deleted successfully.' });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
