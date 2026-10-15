/**
 * app/api/upload/route.ts
 *
 * Image file upload endpoint for menu items and banners:
 * Accepts multipart/form-data with 'file'.
 * Saves locally into public/assets/images/menu/ (matching PHP behavior).
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getAdminSession } from '@/lib/auth';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded.' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds the 5MB limit.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeFilename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'assets', 'images', 'menu');

    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, safeFilename), buffer);

    const relativeUrl = `/assets/images/menu/${safeFilename}`;

    return NextResponse.json({
      success: true,
      url: relativeUrl,
      message: 'File uploaded successfully.',
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('[upload] Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'File upload failed.' },
      { status: 500 }
    );
  }
}
