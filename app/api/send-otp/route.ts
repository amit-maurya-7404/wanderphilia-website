import { NextRequest, NextResponse } from 'next/server';
import { OtpManager } from '@/lib/otp-manager';

interface SendOTPRequest {
  phone: string;
}

interface SendOTPResponse {
  success: boolean;
  message: string;
  requestId?: string;
}

/**
 * Format phone number to 91XXXXXXXXXX format
 */
function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');

  // If already starts with 91 and has 12 digits, return as is
  if (cleanPhone.startsWith('91') && cleanPhone.length === 12) {
    return cleanPhone;
  }

  // If has 10 digits (without country code), add 91
  if (cleanPhone.length === 10) {
    return `91${cleanPhone}`;
  }

  throw new Error(
    'Invalid phone number format. Expected 10 digits or 91XXXXXXXXXX'
  );
}

/**
 * Generate a random OTP (for demo purposes)
 * In production, MSG91 generates and sends the OTP
 */
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<SendOTPResponse>> {
  try {
    const body = (await request.json()) as SendOTPRequest;
    const { phone } = body;

    // Validate phone input
    if (!phone) {
      return NextResponse.json(
        { success: false, message: 'Phone number is required' },
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

    // Get MSG91 API credentials
    const authKey = process.env.MSG91_AUTH_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;

    if (!authKey || !templateId) {
      console.error('MSG91 API credentials not configured');
      return NextResponse.json(
        { success: false, message: 'SMS service not configured' },
        { status: 500 }
      );
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP with expiration (10 minutes)
    OtpManager.store(formattedPhone, otp);

    // Call MSG91 API to send OTP using the configured template
    const msg91Response = await fetch('https://control.msg91.com/api/sendotp.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        authkey: authKey,
        mobile: formattedPhone,
        template_id: templateId,
        otp,
        otp_expiry: '10',
        otp_length: '6',
      }).toString(),
    });

    const responseText = await msg91Response.text();
    let parsedResponse: Record<string, any> | null = null;

    try {
      parsedResponse = JSON.parse(responseText);
    } catch {
      // Ignore parse errors for non-JSON responses
    }

    const successResponse =
      (parsedResponse && parsedResponse.type === 'success') ||
      (typeof responseText === 'string' && !responseText.toLowerCase().includes('error'));

    if (!msg91Response.ok || !successResponse) {
      console.error('MSG91 API error:', responseText);
      return NextResponse.json(
        {
          success: false,
          message:
            parsedResponse?.message || 'Failed to send OTP via MSG91',
        },
        { status: 500 }
      );
    }

    console.log(`OTP sent successfully to ${formattedPhone}`);
    return NextResponse.json(
      {
        success: true,
        message: 'OTP sent successfully',
        requestId: parsedResponse?.message_id || parsedResponse?.requestId || responseText,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in send-otp route:', error);
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
