import { NextRequest, NextResponse } from 'next/server';
import { getOperationsBookingById, saveOperationsBooking } from '@/lib/operations-db';
import { isAuthorizedOperationsRequest } from '@/lib/operations-auth';
import { generateVoucherPDFBuffer } from '@/lib/voucher-pdf';
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

    const cleanInq = (booking.inquiryId || 'WND').toUpperCase();
    const pdfFilename = `Wanderphilia-Confirmation-Voucher-${cleanInq}.pdf`;

    // 1. Generate Official Luxury PDF Buffer
    console.log(`[Send Voucher API] Generating PDF voucher buffer for ${booking.customerName} (${cleanInq})...`);
    const pdfBuffer = await generateVoucherPDFBuffer(booking);

    // 2. Format Professional Email Notification Body
    const totalAmount = booking.totalQuotationAmount || 0;
    const advancePaid = booking.advanceAmountPaid || 0;
    const balanceDue = Math.max(0, totalAmount - advancePaid);
    const hotels = booking.hotels || [];

    const emailSubject = `🎉 Official Booking Confirmation Voucher (PDF Attached): ${booking.destination} Tour - Ref: ${booking.inquiryId}`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #1e293b; margin: 0; padding: 20px 10px; }
    .email-container { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
    .email-header { background: #0f172a; padding: 24px 28px; border-bottom: 3px solid #f97316; display: flex; justify-content: space-between; align-items: center; }
    .brand-title { color: #ffffff; font-size: 18px; font-weight: 800; letter-spacing: 0.5px; }
    .brand-sub { color: #f97316; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    .badge { background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid #10b981; padding: 4px 10px; border-radius: 9999px; font-size: 10px; font-weight: 800; text-transform: uppercase; }
    .email-body { padding: 28px; line-height: 1.6; font-size: 14px; }
    .greeting { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
    .highlight-box { background: #fff7ed; border: 1px solid #fed7aa; border-left: 4px solid #f97316; border-radius: 10px; padding: 14px 16px; margin: 18px 0; }
    .highlight-box strong { color: #c2410c; }
    .summary-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0; }
    .summary-table td { padding: 10px 14px; border-bottom: 1px solid #e2e8f0; }
    .summary-table td.label { font-weight: 600; color: #64748b; background: #f8fafc; width: 40%; }
    .summary-table td.val { font-weight: 700; color: #0f172a; }
    .pdf-callout { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center; }
    .pdf-callout .pdf-icon { font-size: 24px; margin-bottom: 4px; }
    .pdf-callout .pdf-name { font-weight: 800; color: #15803d; font-size: 14px; font-family: monospace; }
    .email-footer { background: #0f172a; padding: 20px 28px; color: #94a3b8; font-size: 12px; text-align: center; border-top: 1px solid #1e293b; }
    .email-footer strong { color: #ffffff; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <div>
        <div class="brand-title">WANDERPHILIA</div>
        <div class="brand-sub">Curated Travel &amp; Luxury Experiences</div>
      </div>
      <span class="badge">Confirmed &amp; Guaranteed ✓</span>
    </div>

    <div class="email-body">
      <div class="greeting">Dear ${booking.customerName},</div>
      <p>
        Greetings from <strong>Wanderphilia Experiences</strong>!
      </p>
      <p>
        We are delighted to confirm that all reservations for your upcoming <strong>${booking.destination}</strong> journey have been secured and finalized with our verified luxury properties and transport fleet.
      </p>

      <div class="pdf-callout">
        <div class="pdf-icon">📄</div>
        <div style="font-size: 12px; color: #166534; font-weight: 600; margin-bottom: 3px;">OFFICIAL VOUCHER ATTACHED AS PDF</div>
        <div class="pdf-name">${pdfFilename}</div>
        <div style="font-size: 11px; color: #475569; margin-top: 6px;">
          Please open or download the attached PDF voucher on your phone or print a copy for hotel check-in and cab transit.
        </div>
      </div>

      <div class="highlight-box">
        <strong>Trip Overview:</strong>
        <table class="summary-table">
          <tr>
            <td class="label">Lead Guest</td>
            <td class="val">${booking.customerName}</td>
          </tr>
          <tr>
            <td class="label">Inquiry / Booking Ref</td>
            <td class="val">${booking.inquiryId}</td>
          </tr>
          <tr>
            <td class="label">Destination</td>
            <td class="val">${booking.destination}</td>
          </tr>
          <tr>
            <td class="label">Travel Dates</td>
            <td class="val">${booking.travelStartDate || 'TBA'} &rarr; ${booking.travelEndDate || 'TBA'}</td>
          </tr>
          <tr>
            <td class="label">Duration</td>
            <td class="val">${booking.noOfNights} Nights / ${booking.noOfDays} Days</td>
          </tr>
          <tr>
            <td class="label">Confirmed Hotels</td>
            <td class="val">
              ${hotels.length > 0 ? hotels.map(h => `${h.hotelName} (${h.city})`).join(', ') : 'As per finalized proposal'}
            </td>
          </tr>
          <tr>
            <td class="label">Advance Paid</td>
            <td class="val" style="color: #10b981;">₹${advancePaid.toLocaleString('en-IN')} [CONFIRMED]</td>
          </tr>
          <tr>
            <td class="label">Balance Due</td>
            <td class="val" style="color: ${balanceDue === 0 ? '#10b981' : '#f59e0b'};">
              ₹${balanceDue.toLocaleString('en-IN')} ${balanceDue === 0 ? '(All Paid ✓)' : '(Payable at Check-in)'}
            </td>
          </tr>
        </table>
      </div>

      <p style="font-size: 13px; color: #64748b;">
        If you require any special itinerary additions, dietary accommodations, or flight coordination, our dedicated 24x7 on-tour concierge team is always at your service.
      </p>

      <p style="margin-top: 20px; font-weight: 700; color: #0f172a;">
        Warm regards,<br>
        <span style="color: #f97316;">Wanderphilia Experiences Operations Team</span>
      </p>
    </div>

    <div class="email-footer">
      <div><strong>24x7 Wanderphilia On-Tour Concierge:</strong> +91 98765 43210</div>
      <div>Support Email: <a href="mailto:experiences@wanderphilia.com" style="color: #f97316; text-decoration: none;">experiences@wanderphilia.com</a></div>
      <div style="margin-top: 6px; font-size: 11px; color: #64748b;">Wanderphilia Experiences Pvt. Ltd. &bull; Registered Office &bull; Mumbai, India</div>
    </div>
  </div>
</body>
</html>
    `;

    // 3. Send Email with Attached PDF
    const toRecipients = `${recipientEmail}, experiences@wanderphilia.com`;
    console.log(`[Send Voucher API] Dispatching confirmation voucher PDF for ${booking.customerName} to: ${toRecipients}`);

    const mailRes = await sendEmail({
      to: toRecipients,
      subject: emailSubject,
      html: emailHtml,
      replyTo: 'experiences@wanderphilia.com',
      attachments: [
        {
          filename: pdfFilename,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    if (!mailRes.success) {
      return NextResponse.json(
        { success: false, error: (mailRes.error as any)?.message || 'Failed to dispatch email via SMTP server.' },
        { status: 500 }
      );
    }

    // 4. Update Booking Audit Trail
    booking.voucherSentAt = new Date().toISOString();
    booking.voucherSentTo = recipientEmail;
    await saveOperationsBooking(booking);

    return NextResponse.json({
      success: true,
      message: `Official Confirmation Voucher PDF successfully sent to ${recipientEmail}!`,
      sentAt: booking.voucherSentAt,
      sentTo: recipientEmail,
      filename: pdfFilename,
    });
  } catch (error: any) {
    console.error('[Send Voucher API Error]:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error dispatching voucher.' },
      { status: 500 }
    );
  }
}
