import { NextRequest, NextResponse } from 'next/server';
import { verifyPasscode, generateOperationsToken } from '@/lib/operations-auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { pin, passcode, portal } = body;
    const codeToTest = String(pin || passcode || '').trim();
    const targetRole = portal === 'sales' ? 'sales' : portal === 'operations' ? 'operations' : 'any';

    if (!codeToTest) {
      return NextResponse.json(
        { success: false, error: 'Please enter your Access PIN.' },
        { status: 400 }
      );
    }

    const verification = verifyPasscode(codeToTest, targetRole);

    if (!verification.valid) {
      return NextResponse.json(
        {
          success: false,
          error: targetRole === 'sales'
            ? 'Invalid Sales PIN. Please check credentials.'
            : 'Invalid Operations PIN. Please check credentials.'
        },
        { status: 401 }
      );
    }

    const assignedRole = verification.role || (targetRole === 'sales' ? 'sales_team' : 'operations_team');
    const token = generateOperationsToken(codeToTest, assignedRole);

    const res = NextResponse.json(
      {
        success: true,
        message: 'Access Verified.',
        token,
        role: assignedRole
      },
      { status: 200 }
    );

    // Set cookie
    const cookieName = assignedRole === 'sales_team' ? 'wanderphilia_sales_token' : 'wanderphilia_ops_token';
    res.cookies.set(cookieName, token, {
      path: '/',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return res;
  } catch (error) {
    console.error('[Verify PIN API Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error verifying passcode.' },
      { status: 500 }
    );
  }
}
