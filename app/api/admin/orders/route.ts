/**
 * app/api/admin/orders/route.ts
 *
 * Admin Orders management:
 *  - GET: List orders with status filter & pagination
 *  - PATCH: Update order status (pending, confirmed, preparing, out_for_delivery, delivered, cancelled)
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { Order, OrderStatus } from '@/types';

const VALID_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'delivered',
  'cancelled',
];

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

    let sql = 'SELECT * FROM orders';
    const params: (string | number)[] = [];

    if (status && VALID_STATUSES.includes(status as OrderStatus)) {
      sql += ' WHERE status = ?';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const orders = await query<Order[]>(sql, params);

    if (orders.length > 0) {
      const orderIds = orders.map((o) => o.id);
      const items = await query<any[]>(
        `SELECT * FROM order_items WHERE order_id IN (${orderIds.map(() => '?').join(',')})`,
        orderIds
      );

      const itemsByOrderId = new Map<number, any[]>();
      for (const it of items) {
        if (!itemsByOrderId.has(it.order_id)) {
          itemsByOrderId.set(it.order_id, []);
        }
        itemsByOrderId.get(it.order_id)!.push(it);
      }

      for (const o of orders) {
        o.items = itemsByOrderId.get(o.id) || [];
      }
    }

    return NextResponse.json({
      success: true,
      data: orders,
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
        { success: false, message: 'Order ID and status are required.' },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, message: `Invalid status: ${status}` },
        { status: 400 }
      );
    }

    await query('UPDATE orders SET status = ? WHERE id = ?', [status, Number(id)]);

    return NextResponse.json({
      success: true,
      message: `Order #${id} status updated to ${status}.`,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
