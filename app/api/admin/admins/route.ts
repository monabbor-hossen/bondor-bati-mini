/**
 * app/api/admin/admins/route.ts
 *
 * Super-Admin user management:
 *  - GET: Fetch all admin accounts (excluding password_hash)
 *  - POST: Create or update admin account (hashes password with bcryptjs)
 *  - PATCH: Toggle active status
 *  - DELETE: Delete admin account
 *
 * Restricted to superadmin role.
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminSession, hashPassword } from '@/lib/auth';
import { AdminUser } from '@/types';

export async function GET(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session || session.role !== 'superadmin') {
    return NextResponse.json(
      { success: false, message: 'Forbidden: Superadmin access required.' },
      { status: 403 }
    );
  }

  try {
    const users = await query<AdminUser[]>(
      'SELECT id, name, username, email, role, is_active, created_at, updated_at FROM admins ORDER BY id ASC'
    );
    return NextResponse.json({ success: true, data: users });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session || session.role !== 'superadmin') {
    return NextResponse.json(
      { success: false, message: 'Forbidden: Superadmin access required.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { id, name, username, email, password, role } = body;

    if (!name || !username || !email) {
      return NextResponse.json(
        { success: false, message: 'Name, username, and email are required.' },
        { status: 400 }
      );
    }

    const assignedRole = role === 'superadmin' ? 'superadmin' : 'manager';

    if (id) {
      if (password && password.trim().length > 0) {
        const passwordHash = await hashPassword(password);
        await query(
          'UPDATE admins SET name = ?, username = ?, email = ?, password_hash = ?, role = ? WHERE id = ?',
          [name.trim(), username.trim(), email.trim(), passwordHash, assignedRole, Number(id)]
        );
      } else {
        await query(
          'UPDATE admins SET name = ?, username = ?, email = ?, role = ? WHERE id = ?',
          [name.trim(), username.trim(), email.trim(), assignedRole, Number(id)]
        );
      }
      return NextResponse.json({ success: true, message: 'Admin user updated successfully.' });
    } else {
      if (!password || password.trim().length < 6) {
        return NextResponse.json(
          { success: false, message: 'A secure password of at least 6 characters is required.' },
          { status: 400 }
        );
      }
      const passwordHash = await hashPassword(password);
      await query(
        'INSERT INTO admins (name, username, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?, 1)',
        [name.trim(), username.trim(), email.trim(), passwordHash, assignedRole]
      );
      return NextResponse.json(
        { success: true, message: 'Admin user created successfully.' },
        { status: 201 }
      );
    }
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session || session.role !== 'superadmin') {
    return NextResponse.json(
      { success: false, message: 'Forbidden: Superadmin access required.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { id, is_active } = body;

    if (!id || is_active === undefined) {
      return NextResponse.json(
        { success: false, message: 'Admin ID and active status are required.' },
        { status: 400 }
      );
    }

    // Guard: Prevent admin from deactivating themselves
    if (Number(id) === session.id && !is_active) {
      return NextResponse.json(
        { success: false, message: 'You cannot deactivate your own account.' },
        { status: 400 }
      );
    }

    await query('UPDATE admins SET is_active = ? WHERE id = ?', [
      is_active ? 1 : 0,
      Number(id),
    ]);

    return NextResponse.json({ success: true, message: 'Admin status updated successfully.' });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session || session.role !== 'superadmin') {
    return NextResponse.json(
      { success: false, message: 'Forbidden: Superadmin access required.' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Admin ID is required.' }, { status: 400 });
    }

    if (Number(id) === session.id) {
      return NextResponse.json(
        { success: false, message: 'You cannot delete your own account.' },
        { status: 400 }
      );
    }

    await query('DELETE FROM admins WHERE id = ?', [Number(id)]);

    return NextResponse.json({ success: true, message: 'Admin user deleted successfully.' });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
