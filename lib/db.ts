/**
 * lib/db.ts
 *
 * MySQL connection pool using mysql2/promise.
 * Pool creation is lazy — it only happens on the first actual DB call,
 * NOT at module import time. This prevents Next.js build failures when
 * .env.local is absent during `next build`.
 *
 * Usage:
 *   import { query, ping, pool } from '@/lib/db';
 *
 *   // Simple query
 *   const rows = await query<MenuItem[]>('SELECT * FROM menu_items');
 *
 *   // Transaction (use pool() to get the underlying mysql2 Pool)
 *   const conn = await pool().getConnection();
 *   try { await conn.beginTransaction(); ... await conn.commit(); }
 *   finally { conn.release(); }
 */

import mysql from 'mysql2/promise';

// Prevent multiple pool instances during Next.js hot-reload in dev
declare global {
  // eslint-disable-next-line no-var
  var __mysqlPool: mysql.Pool | undefined;
}

function getPool(): mysql.Pool {
  if (globalThis.__mysqlPool) {
    return globalThis.__mysqlPool;
  }

  const database = process.env.DB_DATABASE;
  const user = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD ?? '';

  if (!database || !user) {
    throw new Error(
      '[bondor-bati/db] Missing required env vars: DB_DATABASE, DB_USERNAME. ' +
        'Create .env.local from .env.local.example and fill in your credentials.',
    );
  }

  globalThis.__mysqlPool = mysql.createPool({
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    database,
    user,
    password,
    charset: 'utf8mb4',
    timezone: '+06:00',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

  return globalThis.__mysqlPool;
}

/**
 * Get the raw mysql2 Pool instance (lazy-initialised).
 * Use for transactions; prefer `query()` for simple queries.
 */
export function pool(): mysql.Pool {
  return getPool();
}

/**
 * Execute a parameterised SQL query and return the typed rows.
 *
 * @example
 * const items = await query<MenuItem[]>('SELECT * FROM menu_items WHERE is_available = ?', [true]);
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function query<T>(sql: string, params?: any[]): Promise<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rows] = await (getPool() as any).execute(sql, params);
  return rows as T;
}

/**
 * Perform a health-check ping against the database.
 * Returns true if the connection is alive, false otherwise.
 */
export async function ping(): Promise<boolean> {
  try {
    const conn = await getPool().getConnection();
    await conn.ping();
    conn.release();
    return true;
  } catch {
    return false;
  }
}
