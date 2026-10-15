/**
 * app/api/health/route.ts
 *
 * GET /api/health
 * Replaces: GET /api/index.php → 'health'
 *
 * Returns the API status and whether the database is reachable.
 * Used by Flutter (and ops dashboards) to verify the service is alive.
 */

import { NextRequest } from 'next/server';
import { ping } from '@/lib/db';
import { ok, serverError, corsOptions } from '@/lib/api-response';

export const dynamic = 'force-dynamic'; // never cache health checks

export async function OPTIONS() {
  return corsOptions();
}

export async function GET(_req: NextRequest) {
  try {
    const dbAlive = await ping();

    return ok({
      status: 'ok',
      database: dbAlive ? 'connected' : 'unreachable',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? '0.1.0',
    });
  } catch (err) {
    console.error('[health] check failed:', err);
    return serverError('Health check failed.');
  }
}
