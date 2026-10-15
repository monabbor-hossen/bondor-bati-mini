/**
 * app/api/menu/route.ts
 *
 * GET /api/menu
 * Replaces: GET /api/index.php → 'menu'  (ListWeeklyMenu use-case)
 *
 * Returns the full 6-day weekly menu grouped by day.
 * Cached for 60 s server-side; Flutter app should honour Cache-Control.
 *
 * Flutter example:
 *   final res = await http.get(Uri.parse('$baseUrl/api/menu'));
 *   final json = jsonDecode(res.body) as Map<String, dynamic>;
 *   final days = (json['data'] as List).map((d) => WeeklyMenuDay.fromJson(d)).toList();
 */

import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { ok, serverError, corsOptions } from '@/lib/api-response';
import type { MenuItem, WeeklyMenuDay } from '@/types';

export const dynamic = 'force-dynamic';
// Revalidate cached response every 60 seconds (ISR-style for Route Handlers)
export const revalidate = 60;

export async function OPTIONS() {
  return corsOptions();
}

export async function GET(_req: NextRequest) {
  try {
    // Fetch all available menu items ordered by day and tier
    const rows = await query<MenuItem[]>(`
      SELECT
        id,
        day_index,
        day_name,
        tier,
        name,
        description,
        price,
        emoji,
        image_url,
        is_available,
        created_at,
        updated_at
      FROM menu_items
      WHERE is_available = TRUE
      ORDER BY day_index ASC, tier ASC
    `);

    // Group rows into WeeklyMenuDay buckets (day_index 0–5)
    const dayMap = new Map<number, WeeklyMenuDay>();

    for (const item of rows) {
      const existing = dayMap.get(item.day_index);
      // Cast MySQL tinyint(1) → boolean & normalize image_url
      const rawImg = item.image_url ? String(item.image_url).trim() : null;
      const normalizedImg =
        rawImg && !rawImg.startsWith('/') && !rawImg.startsWith('http://') && !rawImg.startsWith('https://')
          ? `/${rawImg}`
          : rawImg;

      const normalised: MenuItem = {
        ...item,
        is_available: Boolean(item.is_available),
        image_url: normalizedImg,
      };

      if (existing) {
        existing.items.push(normalised);
      } else {
        dayMap.set(item.day_index, {
          day_index: item.day_index,
          day_name: item.day_name,
          items: [normalised],
        });
      }
    }

    // Sort days 0 → 5 and return
    const data: WeeklyMenuDay[] = Array.from(dayMap.values()).sort(
      (a, b) => a.day_index - b.day_index,
    );

    return ok(data, `${data.length} days in the weekly menu.`);
  } catch (err) {
    console.error('[api/menu] GET error:', err);
    return serverError();
  }
}
