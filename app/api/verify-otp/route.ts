import { NextRequest, NextResponse } from 'next/server';
import { OtpManager } from '@/lib/otp-manager';

interface VerifyOTPRequest {
  phone: string;
  otp: string;
}

interface VerifyOTPResponse {
  success: boolean;
  message: string;
  token?: string;
}

/**
 * Format phone number to 91XXXXXXXXXX format
 */
function formatPhoneNumber(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '');

  if (cleanPhone.startsWith('91') && cleanPhone.length === 12) {
    return cleanPhone;
  }

  if (cleanPhone.length === 10) {
    return `91${cleanPhone}`;
  }

  throw new Error(
    'Invalid phone number format. Expected 10 digits or 91XXXXXXXXXX'
  );
}

/**
 * Generate a simple JWT token (for demo purposes)
 * In production, use a proper JWT library with secrets
 */
function generateToken(phone: string): string {
  const payload = {
    phone,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  // Base64 encode the payload (not secure for production - use proper JWT)
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<VerifyOTPResponse>> {
  try {
    const body = (await request.json()) as VerifyOTPRequest;
    const { phone, otp } = body;

    // Validate inputs
    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, message: 'Phone number and OTP are required' },
        { status: 400 }
      );
    }

    // Validate OTP format (should be 6 digits)
    if (!/^\d{6}$/.test(otp.trim())) {
      return NextResponse.json(
        { success: false, message: 'OTP must be 6 digits' },
        { status: 400 }
      );
    }

    // Format phone number
    let formattedPhone: string;
    try {
      formattedPhone = formatPhoneNumber(phone);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message:
            error instanceof Error ? error.message : 'Invalid phone number',
        },
        { status: 400 }
      );
    }

    // Verify OTP with MSG91 if configured, otherwise fall back to local OTP storage
    const authKey = process.env.MSG91_AUTH_KEY;
    let verificationResult = { valid: false, message: 'Invalid OTP' };

    if (authKey) {
      try {
        const msg91VerifyResponse = await fetch(
          'https://control.msg91.com/api/verifyotp.php',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              authkey: authKey,
              mobile: formattedPhone,
              otp: otp.trim(),
            }).toString(),
          }
        );

        const verifyText = await msg91VerifyResponse.text();
        let verifyJson: Record<string, any> | null = null;

        try {
          verifyJson = JSON.parse(verifyText);
        } catch {
          // Ignore parse errors for plain text responses
        }

        const msg91Success =
          (verifyJson && verifyJson.type === 'success') ||
          (typeof verifyText === 'string' &&
            verifyText.toLowerCase().includes('success') &&
            !verifyText.toLowerCase().includes('error'));

        if (msg91VerifyResponse.ok && msg91Success) {
          verificationResult = { valid: true, message: 'OTP verified successfully' };
        } else {
          verificationResult = {
            valid: false,
            message:
              verifyJson?.message ||
              verifyText ||
              'Invalid OTP',
          };
        }
      } catch (verifyError) {
        console.error('MSG91 verify error:', verifyError);
        verificationResult = { valid: false, message: 'OTP verification failed' };
      }
    }

    if (!verificationResult.valid) {
      verificationResult = OtpManager.verify(formattedPhone, otp.trim());
    }

    if (!verificationResult.valid) {
      return NextResponse.json(
        { success: false, message: verificationResult.message },
        { status: 401 }
      );
    }

    // Generate token for session
    const token = generateToken(formattedPhone);

    const response = NextResponse.json(
      {
        success: true,
        message: 'OTP verified successfully',
        token,
      },
      { status: 200 }
    );

    // Set secure http-only cookie for session (optional)
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Error in verify-otp route:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
