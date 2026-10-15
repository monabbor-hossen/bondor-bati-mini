/**
 * app/api/orders/track/route.ts
 *
 * GET /api/orders/track?order_number=BB-123456-ABCDEF&phone=01700000000
 * Replaces: GET /api/index.php → 'orders/track'  (TrackOrder use-case)
 *
 * No auth required — customers use this publicly to check their order status.
 *
 * Flutter example:
 *   final uri = Uri.parse('$baseUrl/api/orders/track')
 *     .replace(queryParameters: {'order_number': orderNum, 'phone': phone});
 *   final res = await http.get(uri);
 */

import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { ok, badRequest, notFound, serverError, corsOptions } from '@/lib/api-response';
import type { Order, OrderItem } from '@/types';
import { RowDataPacket } from 'mysql2';

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return corsOptions();
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const orderNumber = searchParams.get('order_number')?.trim();
  const phone = searchParams.get('phone')?.trim();

  // Validate params
  if (!orderNumber || !phone) {
    return badRequest('Both order_number and phone query parameters are required.');
  }
  if (!/^BB-\d{6}-[A-Z0-9]{6}$/.test(orderNumber)) {
    return badRequest('Invalid order number format. Expected: BB-XXXXXX-XXXXXX');
  }
  if (!/^01[3-9]\d{8}$/.test(phone)) {
    return badRequest('Invalid phone number format.');
  }

  try {
    // Fetch the order — phone acts as a second factor
    const orders = await query<(Order & RowDataPacket)[]>(
      `SELECT
         id, order_number, customer_name, phone, address,
         delivery_date, plan_days, notes,
         subtotal, delivery_fee, total, status,
         created_at, updated_at
       FROM orders
       WHERE order_number = ? AND phone = ?
       LIMIT 1`,
      [orderNumber, phone],
    );

    if (orders.length === 0) {
      return notFound('No order found with the provided order number and phone number.');
    }

    const order = orders[0];

    // Fetch associated order items
    const items = await query<(OrderItem & RowDataPacket)[]>(
      `SELECT
         id, order_id, menu_item_id, item_name, tier,
         unit_price, quantity, plan_days, line_total, created_at
       FROM order_items
       WHERE order_id = ?
       ORDER BY id ASC`,
      [order.id],
    );

    return ok({
      ...order,
      items,
    });
  } catch (err) {
    console.error('[api/orders/track] GET error:', err);
    return serverError();
  }
}
