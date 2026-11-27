import { NextRequest, NextResponse } from 'next/server';
import { getOperationsBookingById, saveOperationsBooking } from '@/lib/operations-db';
import { isAuthorizedOperationsRequest } from '@/lib/operations-auth';
import { generateVoucherHtml } from '@/lib/voucher-template';
import { sendEmail, ADMIN_NOTIFICATION_EMAIL } from '@/lib/email';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const isAuth = isAuthorizedOperationsRequest(req);
    if (!isAuth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Valid Operations PIN session required.' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, error: 'Missing request body payload.' }, { status: 400 });
    }

    const bookingId = String(body.bookingId || body.id || body.inquiryId || '').trim();
    if (!bookingId) {
      return NextResponse.json({ success: false, error: 'Booking ID or Inquiry ID is required.' }, { status: 400 });
    }

    const booking = await getOperationsBookingById(bookingId);
    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking record not found.' }, { status: 404 });
    }

    const recipientEmail = String(body.recipientEmail || booking.customerEmail || '').trim();
    if (!recipientEmail || !recipientEmail.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid client email address is required to dispatch voucher.' },
        { status: 400 }
      );
    }

    // Generate Voucher HTML
    const voucherHtml = generateVoucherHtml(booking);
    const subject = `🎉 Official Booking Confirmation Voucher: ${booking.destination} Tour (${booking.customerName}) - Ref: ${booking.inquiryId}`;

    // Send email to client with CC to experiences@wanderphilia.com
    const toRecipients = `${recipientEmail}, experiences@wanderphilia.com`;
    console.log(`[Send Voucher API] Dispatching confirmation voucher for ${booking.customerName} to: ${toRecipients}`);

    const mailRes = await sendEmail({
      to: toRecipients,
      subject,
      html: voucherHtml,
      replyTo: 'experiences@wanderphilia.com',
    });

    if (!mailRes.success) {
      return NextResponse.json(
        { success: false, error: (mailRes.error as any)?.message || 'Failed to dispatch email via SMTP server.' },
        { status: 500 }
      );
    }

    // Update booking audit trail
    booking.voucherSentAt = new Date().toISOString();
    booking.voucherSentTo = recipientEmail;
    await saveOperationsBooking(booking);

    return NextResponse.json({
      success: true,
      message: `Official Confirmation Voucher successfully sent to ${recipientEmail}!`,
      sentAt: booking.voucherSentAt,
      sentTo: recipientEmail,
    });
  } catch (error: any) {
    console.error('[Send Voucher API Error]:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error dispatching voucher.' },
      { status: 500 }
    );
  }
}
