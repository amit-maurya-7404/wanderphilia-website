// app/api/admin/check-auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const result = await verifyAdminSessionToken(cookie);

  if (!result.valid) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    email: result.email
  });
}

