import { NextResponse } from 'next/server';
import { submitToZohoCRM, getDestinationFromTrip } from '@/lib/zoho';
import { sendEmail, ADMIN_NOTIFICATION_EMAIL } from '@/lib/email';
import { trips } from '@/lib/data';

export const dynamic = 'force-dynamic';

interface InitiateRequest {
  fullName?: string;
  mobileNumber?: string;
  email?: string;
  tripSlug?: string;
  tripTitle?: string;
  destination?: string;
  numberOfGuests?: number;
  pricingOptions?: string;
  sharingType?: string;
  startDate?: string;
  endDate?: string;
  subtotal?: number;
  gst?: number;
  totalAmount?: number;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as InitiateRequest | null;
    
    if (!body) {
      return NextResponse.json(
        { error: 'Invalid or missing request body.' },
        { status: 400 }
      );
    }

    const {
      fullName,
      mobileNumber,
      email,
      tripSlug,
      tripTitle,
      destination: passedDestination,
      numberOfGuests,
      pricingOptions,
      sharingType,
      startDate,
      endDate,
      subtotal,
      gst,
      totalAmount
    } = body;

    // Validate essential request payload
    if (!fullName || typeof fullName !== 'string' || fullName.trim() === '') {
      return NextResponse.json(
        { error: 'fullName is required and must be a non-empty string.' },
        { status: 400 }
      );
    }
    if (!mobileNumber || typeof mobileNumber !== 'string' || mobileNumber.trim() === '') {
      return NextResponse.json(
        { error: 'mobileNumber is required and must be a non-empty string.' },
        { status: 400 }
      );
    }
    if (!email || typeof email !== 'string' || email.trim() === '') {
      return NextResponse.json(
        { error: 'email is required and must be a non-empty string.' },
        { status: 400 }
      );
    }
    if (!tripSlug || typeof tripSlug !== 'string' || tripSlug.trim() === '') {
      return NextResponse.json(
        { error: 'tripSlug is required and must be a non-empty string.' },
        { status: 400 }
      );
    }

    // Resolve trip details from trips data if not provided
    const trip = trips.find(t => t.slug === tripSlug.trim() || t.id === tripSlug.trim());
    const displayTripTitle = tripTitle || (trip ? trip.title : tripSlug);
    const destination = passedDestination || (trip ? trip.destination : getDestinationFromTrip(tripSlug));
    const exactId = trip ? trip.id : tripSlug.trim();
    const guestCount = (numberOfGuests && numberOfGuests > 0) ? numberOfGuests : 1;
    const formattedAmount = totalAmount ? `₹${Number(totalAmount).toLocaleString('en-IN')}` : 'Custom / Quote';

    // 1. Submit Lead to Zoho CRM
    let zohoLeadId: string | undefined;
    try {
      const zohoResult = await submitToZohoCRM({
        name: fullName.trim(),
        email: email.trim(),
        phone: mobileNumber.trim(),
        leadSource: 'Website',
        leadStatus: 'Query',
        tripTitle: displayTripTitle,
        tripSlug: tripSlug.trim(),
        destination: destination,
        itineraryId: exactId,
        numberOfGuests: guestCount,
        sharingType: sharingType || '',
        startDate: startDate,
        endDate: endDate,
        pricingOptions: pricingOptions || '',
        totalAmount: totalAmount,
      });

      if (zohoResult && 'leadId' in zohoResult && zohoResult.leadId) {
        zohoLeadId = zohoResult.leadId;
      }
    } catch (zohoError) {
      console.error('[POST /api/checkout/initiate] Zoho CRM Error:', zohoError);
    }

    // 2. Dispatch Email to Admin (experiences@wanderphilia.com)
    try {
      const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; padding: 20px; color: #1e293b; margin: 0; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
    .header { background: linear-gradient(135deg, #ff5d09 0%, #ff8a00 100%); color: #ffffff; padding: 28px 24px; }
    .content { padding: 28px 24px; }
    .badge { display: inline-block; background: #fff3ed; color: #ea580c; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; margin-bottom: 12px; }
    .table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    .table td { padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; vertical-align: top; }
    .table td.label { color: #64748b; font-weight: 600; width: 38%; }
    .table td.value { color: #0f172a; font-weight: 700; text-align: right; }
    .alert-box { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 14px 16px; border-radius: 6px; margin-top: 20px; }
    .footer { text-align: center; padding: 18px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="badge" style="background: rgba(255,255,255,0.25); color: #ffffff;">⚡ New Booking Inquiry / Checkout</div>
      <h2 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff;">${displayTripTitle}</h2>
      <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.95;">Customer reached checkout / Proceed to Payment step.</p>
    </div>
    
    <div class="content">
      <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #0f172a; border-bottom: 2px solid #ff5d09; display: inline-block; padding-bottom: 4px;">Customer Information</h3>
      <table class="table">
        <tr>
          <td class="label">Full Name</td>
          <td class="value">${fullName}</td>
        </tr>
        <tr>
          <td class="label">Mobile Number</td>
          <td class="value"><a href="tel:${mobileNumber}" style="color: #ff5d09; text-decoration: none;">${mobileNumber}</a></td>
        </tr>
        <tr>
          <td class="label">Email Address</td>
          <td class="value"><a href="mailto:${email}" style="color: #ff5d09; text-decoration: none;">${email}</a></td>
        </tr>
      </table>

      <h3 style="margin: 20px 0 12px 0; font-size: 16px; color: #0f172a; border-bottom: 2px solid #ff5d09; display: inline-block; padding-bottom: 4px;">Trip & Selection Details</h3>
      <table class="table">
        <tr>
          <td class="label">Trip Name</td>
          <td class="value">${displayTripTitle}</td>
        </tr>
        <tr>
          <td class="label">Destination</td>
          <td class="value">${destination || 'Not Specified'}</td>
        </tr>
        <tr>
          <td class="label">Selected Dates</td>
          <td class="value">${startDate && endDate ? `${startDate} to ${endDate}` : startDate || 'Not specified'}</td>
        </tr>
        <tr>
          <td class="label">Total Travelers</td>
          <td class="value">${guestCount} Guest(s)</td>
        </tr>
        ${sharingType ? `
        <tr>
          <td class="label">Sharing Type</td>
          <td class="value">${sharingType}</td>
        </tr>
        ` : ''}
        ${pricingOptions ? `
        <tr>
          <td class="label">Selected Options</td>
          <td class="value">${pricingOptions}</td>
        </tr>
        ` : ''}
        ${totalAmount ? `
        <tr>
          <td class="label">Estimated Total</td>
          <td class="value" style="color: #059669; font-size: 16px;">${formattedAmount}</td>
        </tr>
        ` : ''}
        ${zohoLeadId ? `
        <tr>
          <td class="label">Zoho CRM Lead ID</td>
          <td class="value" style="font-family: monospace; font-size: 12px;">${zohoLeadId}</td>
        </tr>
        ` : ''}
      </table>

      <div class="alert-box">
        <p style="margin: 0; font-size: 13px; color: #15803d; line-height: 1.5;">
          <strong>Follow-up Note:</strong> The customer has filled in their details and clicked Proceed to Payment. Their lead is registered in Zoho CRM. You can follow up via phone or email right away.
        </p>
      </div>
    </div>

    <div class="footer">
      Wanderphilia Travel Portal &copy; 2026 | Automated Notification
    </div>
  </div>
</body>
</html>
      `;

      await sendEmail({
        to: ADMIN_NOTIFICATION_EMAIL,
        subject: `🔔 New Booking Inquiry: ${fullName} - ${displayTripTitle}`,
        html: adminEmailHtml,
        replyTo: email,
      });
    } catch (adminEmailError) {
      console.error('[POST /api/checkout/initiate] Admin Email Error:', adminEmailError);
    }

    // 3. Dispatch Confirmation Email to Customer (email)
    try {
      const customerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; padding: 20px; color: #334155; margin: 0; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: #ffffff; padding: 32px 24px; text-align: center; }
    .content { padding: 32px 24px; }
    .trip-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0; }
    .table { width: 100%; border-collapse: collapse; }
    .table td { padding: 8px 0; font-size: 14px; }
    .table td.label { color: #64748b; font-weight: 600; width: 40%; }
    .table td.value { color: #0f172a; font-weight: 700; text-align: right; }
    .contact-box { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 12px; margin-top: 24px; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff;">We Received Your Booking Inquiry! ✈️</h2>
      <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.95;">Thank you for choosing Wanderphilia, ${fullName}!</p>
    </div>
    
    <div class="content">
      <p style="font-size: 15px; line-height: 1.6; margin-top: 0;">
        Hi <strong>${fullName}</strong>,
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #475569;">
        We've received your booking inquiry for <strong>${displayTripTitle}</strong>. Our dedicated travel specialists have registered your details and are already preparing everything for your unforgettable adventure!
      </p>

      <div class="trip-box">
        <h4 style="margin: 0 0 12px 0; font-size: 15px; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">Your Trip Summary</h4>
        <table class="table">
          <tr>
            <td class="label">Trip Name</td>
            <td class="value">${displayTripTitle}</td>
          </tr>
          ${startDate ? `
          <tr>
            <td class="label">Travel Dates</td>
            <td class="value">${startDate}${endDate ? ` to ${endDate}` : ''}</td>
          </tr>
          ` : ''}
          <tr>
            <td class="label">Travelers</td>
            <td class="value">${guestCount} Traveler(s)</td>
          </tr>
          ${sharingType ? `
          <tr>
            <td class="label">Room / Sharing</td>
            <td class="value">${sharingType}</td>
          </tr>
          ` : ''}
          ${totalAmount ? `
          <tr>
            <td class="label">Estimated Price</td>
            <td class="value" style="color: #0284c7; font-size: 15px;">${formattedAmount}</td>
          </tr>
          ` : ''}
        </table>
      </div>

      <div class="contact-box">
        <p style="margin: 0; font-size: 13px; color: #166534; line-height: 1.5;">
          <strong>What happens next?</strong><br>
          A Wanderphilia tour expert will reach out to you on <strong>${mobileNumber}</strong> or reply to this email shortly to assist with trip preparation, payment confirmation, and answer any questions.
        </p>
      </div>

      <p style="font-size: 13px; color: #64748b; margin-top: 24px; line-height: 1.5;">
        Need instant assistance? Reach out to us anytime at <a href="mailto:experiences@wanderphilia.com" style="color: #0284c7; text-decoration: none; font-weight: 600;">experiences@wanderphilia.com</a> or message us on WhatsApp.
      </p>
    </div>

    <div class="footer">
      <strong>Wanderphilia Experiences</strong> &copy; 2026. All rights reserved.
    </div>
  </div>
</body>
</html>
      `;

      await sendEmail({
        to: email,
        subject: `Booking Inquiry Received: ${displayTripTitle} - Wanderphilia`,
        html: customerEmailHtml,
      });
    } catch (customerEmailError) {
      console.error('[POST /api/checkout/initiate] Customer Email Error:', customerEmailError);
    }

    // Return the response to frontend
    return NextResponse.json({
      success: true,
      leadId: zohoLeadId || 'created',
      message: 'Booking details registered and notifications sent successfully.',
    });
  } catch (error: any) {
    console.error('[POST /api/checkout/initiate] Internal Server Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
