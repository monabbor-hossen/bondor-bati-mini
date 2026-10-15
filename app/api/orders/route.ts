/**
 * app/api/orders/route.ts
 *
 * POST /api/orders
 * Replaces: POST /api/index.php → 'orders'  (CreateOrder use-case)
 *
 * Requires: Authorization: Bearer <MOBILE_API_KEY>
 *
 * Flutter usage:
 *   await http.post(
 *     Uri.parse('$baseUrl/api/orders'),
 *     headers: {
 *       'Content-Type': 'application/json',
 *       'Authorization': 'Bearer $apiKey',
 *     },
 *     body: jsonEncode(orderPayload),
 *   );
 */

import { NextRequest } from 'next/server';
import { query, pool as getPool } from '@/lib/db';
import { verifyMobileApiKey } from '@/lib/auth';
import {
  created,
  badRequest,
  unauthorised,
  conflict,
  serverError,
  unprocessable,
  corsOptions,
} from '@/lib/api-response';
import type { CreateOrderInput, CreateOrderItemInput, MenuItem } from '@/types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return corsOptions();
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validateCreateOrder(body: unknown): {
  errors: Record<string, string> | null;
  data: CreateOrderInput | null;
} {
  if (!body || typeof body !== 'object') {
    return { errors: { body: 'Request body must be a JSON object.' }, data: null };
  }

  const b = body as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const customerName = String(b.customer_name || '').trim();
  if (!customerName || customerName.length < 2) {
    errors.customer_name = 'Customer name must be at least 2 characters.';
  }

  const rawPhone = String(b.phone || b.customer_phone || '').trim();
  const cleanPhone = rawPhone.replace(/[\s\-]/g, '').replace(/^(\+?88)/, '');
  if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
    errors.phone = 'Phone must be a valid Bangladeshi mobile number (e.g. 01700000000).';
  }

  const address = String(b.address || b.delivery_address || '').trim();
  if (!address || address.length < 3) {
    errors.address = 'Address must be at least 3 characters.';
  }

  let deliveryDate = '';
  const rawDeliveryDate = String(b.delivery_date || '').trim();
  if (rawDeliveryDate) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(rawDeliveryDate)) {
      deliveryDate = rawDeliveryDate;
    } else {
      const d = new Date(rawDeliveryDate);
      if (!isNaN(d.getTime())) {
        deliveryDate = d.toISOString().slice(0, 10);
      }
    }
  }
  if (!deliveryDate) {
    deliveryDate = new Date().toISOString().slice(0, 10);
  }

  let idempotencyKey = String(b.idempotency_key || '').trim();
  if (!idempotencyKey || idempotencyKey.length < 8) {
    idempotencyKey = `ord-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  const rootPlanDays = typeof b.plan_days === 'number' && b.plan_days >= 1 ? b.plan_days : 1;
  const rawItems = Array.isArray(b.items) ? b.items : [];
  if (rawItems.length === 0) {
    errors.items = 'At least one order item is required.';
  }

  const items: CreateOrderItemInput[] = [];
  for (let i = 0; i < rawItems.length; i++) {
    const it = rawItems[i] as Record<string, unknown>;
    const itemId = Number(it.item_id || it.menu_item_id);
    const quantity = Number(it.quantity);
    const planDays = Number(it.plan_days || rootPlanDays) || 1;

    if (!itemId || isNaN(itemId) || itemId < 1) {
      errors[`items.${i}.item_id`] = 'item_id must be a number.';
    }
    if (!quantity || isNaN(quantity) || quantity < 1 || quantity > 20) {
      errors[`items.${i}.quantity`] = 'quantity must be between 1 and 20.';
    }
    if (!planDays || isNaN(planDays) || planDays < 1) {
      errors[`items.${i}.plan_days`] = 'plan_days must be at least 1.';
    }

    if (itemId && quantity >= 1 && planDays >= 1) {
      items.push({ item_id: itemId, quantity, plan_days: planDays });
    }
  }

  if (Object.keys(errors).length > 0) return { errors, data: null };

  return {
    errors: null,
    data: {
      customer_name: customerName,
      phone: cleanPhone,
      address,
      delivery_date: deliveryDate,
      notes: b.notes ? String(b.notes).trim() : undefined,
      idempotency_key: idempotencyKey,
      items,
    },
  };
}

// ─── Generate order number ─────────────────────────────────────────────────────

function generateOrderNumber(): string {
  const ts = Date.now().toString().slice(-6);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 8);
  return `BB-${ts}-${rand}`;
}

// ─── POST handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // 1. Auth: If Authorization header is provided (e.g. Flutter mobile app), verify it.
  // Web storefront orders from customers are public and do not require Bearer token.
  const authHeader = req.headers.get('authorization');
  if (authHeader && !verifyMobileApiKey(req)) {
    return unauthorised('A valid Bearer API key is required to place orders via API.');
  }

  // 2. Parse body
  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return badRequest('Request body must be valid JSON.');
  }

  // 3. Validate
  const { errors, data } = validateCreateOrder(rawBody);
  if (errors || !data) {
    return unprocessable('Validation failed.', errors ?? undefined);
  }

  const conn = await getPool().getConnection();
  try {
    await conn.beginTransaction();

    // 4. Check idempotency — return the existing order if key already used
    const [existing] = await conn.execute<RowDataPacket[]>(
      'SELECT order_number FROM orders WHERE idempotency_key = ? LIMIT 1',
      [data.idempotency_key],
    );
    if (existing.length > 0) {
      await conn.rollback();
      return conflict(
        `This order was already placed. Order number: ${existing[0].order_number}`,
      );
    }

    // 5. Resolve menu items and calculate totals
    const itemIds = data.items.map((i) => i.item_id);
    const [menuRows] = await conn.execute<RowDataPacket[]>(
      `SELECT id, name, tier, price FROM menu_items WHERE id IN (${itemIds.map(() => '?').join(',')}) AND is_available = TRUE`,
      itemIds,
    );

    const menuMap = new Map<number, { name: string; tier: string; price: number }>(
      (menuRows as MenuItem[]).map((m) => [m.id, { name: m.name, tier: m.tier, price: m.price }]),
    );

    let subtotal = 0;
    const resolvedItems: Array<{
      menu_item_id: number;
      item_name: string;
      tier: string;
      unit_price: number;
      quantity: number;
      plan_days: number;
      line_total: number;
    }> = [];

    for (const orderItem of data.items) {
      const menuItem = menuMap.get(orderItem.item_id);
      if (!menuItem) {
        await conn.rollback();
        return unprocessable(`Menu item with id ${orderItem.item_id} is not available.`);
      }
      const lineTotal = menuItem.price * orderItem.quantity * orderItem.plan_days;
      subtotal += lineTotal;
      resolvedItems.push({
        menu_item_id: orderItem.item_id,
        item_name: menuItem.name,
        tier: menuItem.tier,
        unit_price: menuItem.price,
        quantity: orderItem.quantity,
        plan_days: orderItem.plan_days,
        line_total: lineTotal,
      });
    }

    const deliveryFee = 0; // TODO: add delivery zone fee logic
    const total = subtotal + deliveryFee;
    const orderNumber = generateOrderNumber();

    // 6. Insert order
    const [orderResult] = await conn.execute<ResultSetHeader>(
      `INSERT INTO orders
         (order_number, customer_name, phone, address, delivery_date, plan_days, notes,
          subtotal, delivery_fee, total, status, idempotency_key)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [
        orderNumber,
        data.customer_name,
        data.phone,
        data.address,
        data.delivery_date,
        resolvedItems.reduce((acc, i) => Math.max(acc, i.plan_days), 1),
        data.notes ?? null,
        subtotal,
        deliveryFee,
        total,
        data.idempotency_key,
      ],
    );

    const orderId = orderResult.insertId;

    // 7. Insert order items
    for (const item of resolvedItems) {
      await conn.execute(
        `INSERT INTO order_items
           (order_id, menu_item_id, item_name, tier, unit_price, quantity, plan_days, line_total)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.menu_item_id, item.item_name, item.tier, item.unit_price, item.quantity, item.plan_days, item.line_total],
      );
    }

    await conn.commit();

    return created({
      order_number: orderNumber,
      subtotal,
      delivery_fee: deliveryFee,
      total,
      status: 'pending',
      items: resolvedItems,
    }, 'Order placed successfully.');
  } catch (err) {
    await conn.rollback();
    console.error('[api/orders] POST error:', err);
    return serverError();
  } finally {
    conn.release();
  }
}
