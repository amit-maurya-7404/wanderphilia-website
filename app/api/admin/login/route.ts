// app/api/admin/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  validateAdminCredentials,
  createAdminSessionToken,
  checkRateLimit,
  recordFailedAttempt,
  resetFailedAttempts,
  ADMIN_COOKIE_NAME
} from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown-ip';
    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    const rateKey = `${ip}_${(email || '').toLowerCase().trim()}`;
    const rateCheck = checkRateLimit(rateKey);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed attempts. Security lockout active for ${rateCheck.waitMinutes} more minute(s).`
        },
        { status: 429 }
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const isValid = await validateAdminCredentials(email, password);

    if (!isValid) {
      const failed = recordFailedAttempt(rateKey);
      if (failed.isLocked) {
        return NextResponse.json(
          {
            success: false,
            error: 'Maximum failed attempts reached. Account locked for 15 minutes.'
          },
          { status: 429 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          error: `Invalid credentials. ${failed.remainingAttempts} attempt(s) remaining before lockout.`
        },
        { status: 401 }
      );
    }

    // Success - reset failed attempts
    resetFailedAttempts(rateKey);

    // Create session token
    const token = await createAdminSessionToken(email);

    const response = NextResponse.json({
      success: true,
      message: 'Admin authentication successful.',
      email: email.toLowerCase().trim()
    });

    // Set HttpOnly, Secure, SameSite=Strict cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    return response;
  } catch (error: any) {
    console.error('[Admin Login Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal security authentication error.' },
      { status: 500 }
    );
  }
}

