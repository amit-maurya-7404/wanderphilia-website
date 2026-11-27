import { OperationsBooking } from '@/types/operations';
import { sendEmail } from '@/lib/email';
import { getAllOperationsBookings, saveOperationsBooking } from '@/lib/operations-db';

export const OPERATIONS_TEAM_EMAIL = 'operations@wanderphilia.com';
export const OWNER_EMAIL = 'experiences@wanderphilia.com';
const OPS_PORTAL_URL = 'https://wanderphilia.com/wanderphilia-operations';

interface SlaCheckResult {
  checkedCount: number;
  overdueCount: number;
  emailsSent: number;
  skippedAlreadySent: number;
  details: Array<{
    bookingId: string;
    customerName: string;
    hoursElapsed: number;
    daysOverdue: number;
    emailSent: boolean;
    reason?: string;
  }>;
}

/**
 * Builds and sends the professional SLA escalation email to both Operations & Owner
 */
export async function sendOperationsSlaEscalationEmail(
  booking: OperationsBooking,
  hoursElapsed: number
): Promise<{ success: boolean; error?: any }> {
  const daysElapsed = Math.floor(hoursElapsed / 24);
  const daysOverdue = Math.max(1, Math.floor((hoursElapsed - 48) / 24) + 1);

  // 1. Hotel Status Summary
  const hotels = booking.hotels || [];
  const confirmedHotels = hotels.filter(h => h.status === 'confirmed');
  const pendingHotels = hotels.filter(h => h.status !== 'confirmed');

  // 2. Transport Status Summary
  const transport = booking.transport;
  const isTransportConfirmed = Boolean(booking.isTransportBooked || transport?.status === 'confirmed');
  const transportSummary = isTransportConfirmed
    ? 'Confirmed & Booked'
    : transport?.vendorName
    ? `Vendor Assigned (${transport.vendorName}) - Confirmation Pending`
    : 'Pending Assignment';

  // 3. Activities Summary
  let totalExps = 0;
  let confirmedExps = 0;
  let pendingExpsList: string[] = [];

  if (Array.isArray(booking.dayActivities)) {
    booking.dayActivities.forEach((day: any) => {
      const exps = day.experiences || day.activities || day.sightseeingPoints || [];
      if (Array.isArray(exps)) {
        exps.forEach((exp: any) => {
          totalExps++;
          const status = typeof exp === 'object' ? exp?.status : 'requested';
          const name = typeof exp === 'object' ? (exp?.name || exp?.title || 'Experience') : String(exp);
          if (status === 'confirmed') {
            confirmedExps++;
          } else {
            pendingExpsList.push(`${name} (Day ${day.dayNumber || '?'})`);
          }
        });
      }
    });
  }

  // Pre-tax selling price
  const sellingPrice = booking.totalQuotationAmount || 0;
  const preTaxSelling = Math.round(sellingPrice / 1.05);

  const subject = `🚨 [SLA BREACH - ${daysOverdue}D OVERDUE] Operations Pending for ${booking.customerName} (${booking.destination}) - ${booking.inquiryId}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Operations 48-Hour SLA Escalation</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f1f5f9; margin: 0; padding: 24px; }
    .card { max-width: 650px; margin: 0 auto; background: #131b2e; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #7f1d1d, #450a0a); padding: 24px; border-bottom: 2px solid #ef4444; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
    .badge-red { background: #ef4444; color: #ffffff; }
    .badge-amber { background: #f59e0b; color: #000000; }
    .badge-green { background: #10b981; color: #ffffff; }
    .content { padding: 24px; }
    .alert-box { background: rgba(239, 68, 68, 0.12); border: 1px solid #ef4444; border-radius: 12px; padding: 16px; margin-bottom: 20px; }
    .table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    .table td { padding: 10px 12px; border-bottom: 1px solid #1e293b; font-size: 13px; }
    .table td.label { color: #94a3b8; font-weight: 600; width: 35%; }
    .table td.val { color: #f8fafc; font-weight: 700; }
    .section-title { font-size: 14px; font-weight: 800; color: #f97316; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 24px; margin-bottom: 8px; border-bottom: 1px solid #334155; padding-bottom: 6px; }
    .item-card { background: #1e293b; border-radius: 8px; padding: 12px; margin-bottom: 8px; font-size: 12px; }
    .cta-btn { display: block; width: 100%; box-sizing: border-box; text-align: center; background: linear-gradient(135deg, #f97316, #ea580c); color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 800; padding: 14px; border-radius: 10px; margin-top: 24px; }
    .footer { padding: 18px 24px; background: #0a0f1d; font-size: 11px; color: #64748b; text-align: center; border-top: 1px solid #1e293b; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <span class="badge badge-red">🚨 48-Hour SLA Breached</span>
        <span class="badge badge-amber">${daysOverdue} Day${daysOverdue > 1 ? 's' : ''} Overdue (${daysElapsed}d Total)</span>
      </div>
      <h1 style="margin: 0; font-size: 20px; color: #ffffff; font-weight: 900;">
        Operations Action Pending: ${booking.customerName}
      </h1>
      <p style="margin: 4px 0 0 0; font-size: 12px; color: #fca5a5;">
        Booking arrived in Operations ${daysElapsed} days ago (${hoursElapsed} hrs). Finance sync is still incomplete.
      </p>
    </div>

    <div class="content">
      <div class="alert-box">
        <strong style="color: #f87171; font-size: 14px; display: block; margin-bottom: 4px;">
          ⚠️ Why this email was triggered:
        </strong>
        <span style="font-size: 12px; color: #cbd5e1; line-height: 1.5;">
          Wanderphilia operations policy requires all hotels, cabs, and activities to be confirmed within <strong>48 hours (2 days)</strong> so advance payments can be processed by Finance. Currently, this record is delayed and requires immediate attention.
        </span>
      </div>

      <!-- Booking Quick Summary -->
      <div class="section-title">Trip &amp; Booking Details</div>
      <table class="table">
        <tr>
          <td class="label">Guest Name:</td>
          <td class="val">${booking.customerName}</td>
        </tr>
        <tr>
          <td class="label">Inquiry ID:</td>
          <td class="val font-mono">${booking.inquiryId}</td>
        </tr>
        <tr>
          <td class="label">Destination:</td>
          <td class="val">${booking.destination} (${booking.noOfNights}N/${booking.noOfDays}D)</td>
        </tr>
        <tr>
          <td class="label">Travel Dates:</td>
          <td class="val">${booking.travelStartDate || 'TBA'} &rarr; ${booking.travelEndDate || 'TBA'}</td>
        </tr>
        <tr>
          <td class="label">Pax:</td>
          <td class="val">${booking.numberOfGuests} Guests (${booking.adults} Adults, ${booking.kids} Kids)</td>
        </tr>
        <tr>
          <td class="label">Selling Price:</td>
          <td class="val" style="color: #fbbf24;">
            ₹${sellingPrice.toLocaleString('en-IN')} (With 5% GST) 
            <span style="color: #94a3b8; font-size: 11px; font-weight: normal;">• Pre-Tax: ₹${preTaxSelling.toLocaleString('en-IN')}</span>
          </td>
        </tr>
        <tr>
          <td class="label">Advance Received:</td>
          <td class="val" style="color: #34d399;">₹${(booking.advanceAmountPaid || 0).toLocaleString('en-IN')} (With Taxes)</td>
        </tr>
      </table>

      <!-- Work Status Breakdown -->
      <div class="section-title">
        Operations Work Status (${confirmedHotels.length}/${hotels.length} Hotels Booked)
      </div>

      <!-- Hotels Breakdown -->
      <div style="margin-top: 10px;">
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
          <strong style="color: #e2e8f0;">Hotels Checklist:</strong>
          <span style="color: ${pendingHotels.length === 0 ? '#34d399' : '#f87171'}; font-weight: 700;">
            ${confirmedHotels.length} Confirmed • ${pendingHotels.length} Pending
          </span>
        </div>
        ${
          hotels.map((h, i) => {
            const isConf = h.status === 'confirmed';
            return `
            <div class="item-card" style="border-left: 3px solid ${isConf ? '#10b981' : '#ef4444'};">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 700; color: #ffffff;">${i + 1}. ${h.hotelName || 'Pending Hotel'}</span>
                <span class="badge ${isConf ? 'badge-green' : 'badge-red'}">
                  ${isConf ? 'CONFIRMED' : 'ACTION REQUIRED'}
                </span>
              </div>
              <div style="color: #94a3b8; margin-top: 3px; font-size: 11px;">
                ${h.city} &bull; ${h.nights} Night(s) &bull; Room: ${h.roomCategory || 'Standard'} &bull; Dates: ${h.dates || 'TBA'}
              </div>
            </div>`;
          }).join('')
        }
      </div>

      <!-- Transport Breakdown -->
      <div style="margin-top: 14px;">
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
          <strong style="color: #e2e8f0;">Transport &amp; Cab:</strong>
          <span class="badge ${isTransportConfirmed ? 'badge-green' : 'badge-amber'}">
            ${transportSummary}
          </span>
        </div>
        <div class="item-card">
          <span style="color: #f1f5f9; font-weight: 600;">Vehicle: ${transport?.vehicleType || 'Dedicated Private Cab'}</span>
          <span style="color: #94a3b8; font-size: 11px; display: block; margin-top: 2px;">
            Vendor: ${transport?.vendorName || 'Not Assigned Yet'} &bull; ${transport?.totalDays || booking.noOfDays} Days
          </span>
        </div>
      </div>

      <!-- Activities Breakdown -->
      ${totalExps > 0 ? `
      <div style="margin-top: 14px;">
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
          <strong style="color: #e2e8f0;">Activities &amp; Sightseeing:</strong>
          <span style="color: ${pendingExpsList.length === 0 ? '#34d399' : '#fbbf24'}; font-weight: 700; font-size: 12px;">
            ${confirmedExps}/${totalExps} Confirmed
          </span>
        </div>
        ${pendingExpsList.length > 0 ? `
          <div class="item-card" style="border-left: 3px solid #f59e0b;">
            <strong style="color: #fbbf24; font-size: 11px; display: block;">Pending Activities:</strong>
            <span style="color: #cbd5e1; font-size: 11px; line-height: 1.4;">
              ${pendingExpsList.slice(0, 5).join(', ')}${pendingExpsList.length > 5 ? ` + ${pendingExpsList.length - 5} more` : ''}
            </span>
          </div>
        ` : ''}
      </div>
      ` : ''}

      <!-- CTA Button -->
      <a href="${OPS_PORTAL_URL}" class="cta-btn" target="_blank">
        👉 Open Operations Console &amp; Complete Sync
      </a>
      <p style="text-align: center; margin-top: 8px; font-size: 11px; color: #64748b;">
        Portal Link: <a href="${OPS_PORTAL_URL}" style="color: #f97316;">${OPS_PORTAL_URL}</a>
      </p>
    </div>

    <div class="footer">
      <strong>Wanderphilia Automated SLA Escalation System</strong><br>
      Delivered to: <code>${OPERATIONS_TEAM_EMAIL}</code> (Operations) &amp; <code>${OWNER_EMAIL}</code> (Owner)<br>
      This email repeats daily after 48 hours until the booking is marked "Sync to Finance".
    </div>
  </div>
</body>
</html>
  `;

  // Send to both Operations & Owner
  const recipients = `${OPERATIONS_TEAM_EMAIL}, ${OWNER_EMAIL}`;
  console.log(`[Operations SLA Mailer] Dispatching 48h SLA escalation email for ${booking.customerName} (${booking.inquiryId}) to: ${recipients}`);

  const sendResult = await sendEmail({
    to: recipients,
    subject,
    html,
    replyTo: OWNER_EMAIL,
  });

  return sendResult;
}

/**
 * Main function: Checks all active bookings, finds overdue records (> 48 hours),
 * and dispatches daily emails if not already sent today.
 */
export async function checkAndEscalateOperationsSLA(
  bookingsInput?: OperationsBooking[]
): Promise<SlaCheckResult> {
  const result: SlaCheckResult = {
    checkedCount: 0,
    overdueCount: 0,
    emailsSent: 0,
    skippedAlreadySent: 0,
    details: [],
  };

  try {
    const allBookings = bookingsInput || await getAllOperationsBookings('all');
    result.checkedCount = allBookings.length;

    const now = Date.now();
    const todayDate = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

    for (const booking of allBookings) {
      // If already synced to finance or marked complete, skip
      if (booking.opsStatus === 'synced_to_finance' || booking.isSyncToFinance) {
        continue;
      }

      // Calculate time elapsed since creation / handover
      const createdTimestamp = new Date(booking.createdAt || booking.handedOverAt || now).getTime();
      const hoursElapsed = Math.round((now - createdTimestamp) / (1000 * 60 * 60));

      // Overdue threshold: 48 Hours (2 Calendar Days)
      if (hoursElapsed >= 48) {
        result.overdueCount++;
        const daysOverdue = Math.max(1, Math.floor((hoursElapsed - 48) / 24) + 1);

        // Deduplication: Has an SLA escalation email already been sent today?
        if (booking.lastSlaEscalationDate === todayDate) {
          result.skippedAlreadySent++;
          result.details.push({
            bookingId: booking.id || booking.inquiryId,
            customerName: booking.customerName,
            hoursElapsed,
            daysOverdue,
            emailSent: false,
            reason: `Email already sent today (${todayDate})`,
          });
          continue;
        }

        // Send escalation email
        const mailRes = await sendOperationsSlaEscalationEmail(booking, hoursElapsed);

        if (mailRes.success) {
          result.emailsSent++;
          // Update booking escalation record
          booking.lastSlaEscalationDate = todayDate;
          booking.lastSlaEscalationAt = new Date().toISOString();
          booking.slaEscalationCount = (booking.slaEscalationCount || 0) + 1;

          // Persist update
          await saveOperationsBooking(booking);

          result.details.push({
            bookingId: booking.id || booking.inquiryId,
            customerName: booking.customerName,
            hoursElapsed,
            daysOverdue,
            emailSent: true,
          });
        } else {
          result.details.push({
            bookingId: booking.id || booking.inquiryId,
            customerName: booking.customerName,
            hoursElapsed,
            daysOverdue,
            emailSent: false,
            reason: mailRes.error?.message || 'Email delivery failed',
          });
        }
      }
    }
  } catch (err: any) {
    console.error('[Operations SLA Check Error]:', err);
  }

  return result;
}
