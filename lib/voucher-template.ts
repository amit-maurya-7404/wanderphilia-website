import { OperationsBooking } from '@/types/operations';

export interface VoucherData {
  booking: OperationsBooking;
  voucherNumber: string;
  issueDate: string;
  paidExperiences: Array<{
    dayNumber: number | string;
    dayTitle: string;
    name: string;
    description?: string;
  }>;
}

/**
 * Extracts ONLY paid experiences (Company Paid or Vendor Paid with cost > 0),
 * excluding any generic free sightseeing or transit milestones.
 */
export function getPaidExperiencesOnly(booking: OperationsBooking) {
  const paidList: Array<{
    dayNumber: number | string;
    dayTitle: string;
    name: string;
    description?: string;
  }> = [];

  if (!Array.isArray(booking.dayActivities)) return paidList;

  booking.dayActivities.forEach((day: any, dIdx: number) => {
    const dayNum = day.dayNumber || dIdx + 1;
    const dayTitle = day.title || `Day ${dayNum}`;
    const exps = day.experiences || day.activities || day.sightseeingPoints || [];

    if (Array.isArray(exps)) {
      exps.forEach((exp: any) => {
        if (!exp) return;

        const isObj = typeof exp === 'object';
        const expName = isObj ? (exp.name || exp.title || '') : String(exp);
        const cost = isObj ? (Number(exp.cost) || 0) : 0;
        const paidBy = isObj ? exp.paidBy : undefined;

        // ONLY include if it has an explicit cost, or is tagged as company/vendor paid
        const isPaid = cost > 0 || paidBy === 'wanderphilia' || paidBy === 'vendor' || exp.isPaidExperience;

        if (isPaid && expName.trim()) {
          paidList.push({
            dayNumber: dayNum,
            dayTitle,
            name: expName.trim(),
            description: isObj ? (exp.description || exp.inclusions) : undefined,
          });
        }
      });
    }
  });

  return paidList;
}

/**
 * Generates the official, luxury branded HTML Confirmation Voucher for Wanderphilia Experiences
 */
export function generateVoucherHtml(booking: OperationsBooking): string {
  const cleanInq = (booking.inquiryId || 'WND').toUpperCase();
  const voucherNumber = cleanInq.startsWith('VCH-') ? cleanInq : `VCH-${cleanInq}`;
  const issueDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const paidExperiences = getPaidExperiencesOnly(booking);
  const totalAmount = booking.totalQuotationAmount || 0;
  const advancePaid = booking.advanceAmountPaid || 0;
  const balanceDue = Math.max(0, totalAmount - advancePaid);
  const preTaxAmount = Math.round(totalAmount / 1.05);

  const hotels = booking.hotels || [];
  const transport = booking.transport;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Official Booking Confirmation Voucher | Wanderphilia Experiences</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0b0f19;
      color: #f1f5f9;
      padding: 24px 16px;
      line-height: 1.5;
    }
    .voucher-container {
      max-width: 820px;
      margin: 0 auto;
      background: #111827;
      border: 1px solid #1f293d;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
    }
    .voucher-header {
      background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);
      padding: 28px 32px;
      border-bottom: 2px solid #f97316;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    .brand-col {
      display: flex;
      align-items: center;
    }
    .brand-logo {
      height: 56px;
      max-width: 250px;
      width: auto;
      object-fit: contain;
    }
    .voucher-meta {
      text-align: right;
    }
    .voucher-badge {
      display: inline-block;
      padding: 5px 12px;
      border-radius: 9999px;
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.4);
      margin-bottom: 6px;
    }
    .voucher-num {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 13px;
      font-weight: 800;
      color: #f8fafc;
    }
    .voucher-date {
      font-size: 11px;
      color: #94a3b8;
    }

    .voucher-body {
      padding: 32px;
    }
    .section-title {
      font-size: 12px;
      font-weight: 900;
      color: #f97316;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid #1f293d;
      padding-bottom: 6px;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 14px;
      background: #0d1321;
      padding: 18px;
      border-radius: 14px;
      border: 1px solid #1f293d;
      margin-bottom: 24px;
    }
    .summary-item .label {
      font-size: 10px;
      text-transform: uppercase;
      color: #64748b;
      font-weight: 700;
      display: block;
      margin-bottom: 2px;
    }
    .summary-item .val {
      font-size: 13px;
      font-weight: 800;
      color: #f8fafc;
    }

    /* Hotels Table */
    .hotel-card {
      background: #0d1321;
      border: 1px solid #1f293d;
      border-radius: 12px;
      padding: 14px 18px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }
    .hotel-name {
      font-size: 14px;
      font-weight: 800;
      color: #ffffff;
    }
    .hotel-meta {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 3px;
    }
    .hotel-badge {
      font-size: 10px;
      font-weight: 800;
      color: #34d399;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 4px 10px;
      border-radius: 8px;
      text-transform: uppercase;
    }

    /* Transport Card */
    .transport-box {
      background: #0d1321;
      border: 1px solid #1f293d;
      border-radius: 12px;
      padding: 16px 18px;
      margin-bottom: 24px;
    }

    /* Paid Experiences Grid */
    .exp-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 10px;
      margin-bottom: 24px;
    }
    .exp-card {
      background: #0d1321;
      border: 1px solid #1f293d;
      border-left: 3px solid #f97316;
      border-radius: 10px;
      padding: 12px 14px;
    }
    .exp-day {
      font-size: 10px;
      font-weight: 800;
      color: #f97316;
      text-transform: uppercase;
      margin-bottom: 3px;
    }
    .exp-title {
      font-size: 12px;
      font-weight: 800;
      color: #ffffff;
    }

    /* Payment Summary */
    .pricing-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      background: #0d1321;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #1f293d;
    }
    .pricing-table td {
      padding: 12px 18px;
      border-bottom: 1px solid #1f293d;
      font-size: 12px;
    }
    .pricing-table td.label {
      color: #94a3b8;
      font-weight: 600;
    }
    .pricing-table td.val {
      text-align: right;
      font-weight: 800;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }

    /* Guidelines */
    .guidelines-box {
      background: rgba(249, 115, 22, 0.06);
      border: 1px solid rgba(249, 115, 22, 0.3);
      border-radius: 12px;
      padding: 16px;
      font-size: 11px;
      color: #cbd5e1;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .guidelines-box ul {
      padding-left: 18px;
      margin-top: 6px;
    }

    /* Footer & Support */
    .voucher-footer {
      background: #080c14;
      padding: 24px 32px;
      border-top: 1px solid #1f293d;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    .support-info {
      font-size: 11px;
      color: #94a3b8;
    }
    .support-info strong {
      color: #ffffff;
    }
    .seal-box {
      text-align: right;
    }
    .seal-text {
      font-size: 10px;
      text-transform: uppercase;
      color: #34d399;
      font-weight: 900;
      letter-spacing: 0.8px;
    }

    @media print {
      body { background-color: #ffffff; color: #000000; padding: 0; }
      .voucher-container { border: none; box-shadow: none; max-width: 100%; background: #ffffff; }
      .voucher-header { background: #0f172a !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .summary-grid, .hotel-card, .transport-box, .exp-card, .pricing-table { background: #f8fafc !important; color: #0f172a !important; border: 1px solid #cbd5e1 !important; }
      .summary-item .val, .hotel-name, .exp-title { color: #0f172a !important; }
      .guidelines-box { background: #fff7ed !important; color: #7c2d12 !important; border: 1px solid #fdba74 !important; }
      .voucher-footer { background: #f8fafc !important; color: #334155 !important; border-top: 1px solid #cbd5e1 !important; }
    }
  </style>
</head>
<body>
  <div class="voucher-container">
    <!-- HEADER -->
    <div class="voucher-header">
      <div class="brand-col">
        <img src="https://wanderphilia.com/images/Made_LOGO.png" alt="Wanderphilia Experiences" class="brand-logo" onerror="this.src='/images/Made_LOGO.png'">
      </div>
      <div class="voucher-meta">
        <div class="voucher-badge">Status: Confirmed &amp; Guaranteed ✓</div>
        <div class="voucher-num">Ref: ${voucherNumber}</div>
        <div class="voucher-date">Issue Date: ${issueDate}</div>
      </div>
    </div>

    <!-- BODY -->
    <div class="voucher-body">
      <!-- TRIP & GUEST SUMMARY -->
      <div class="section-title">👤 Guest &amp; Itinerary Information</div>
      <div class="summary-grid">
        <div class="summary-item">
          <span class="label">Lead Guest Name</span>
          <span class="val">${booking.customerName}</span>
        </div>
        <div class="summary-item">
          <span class="label">Inquiry / Booking ID</span>
          <span class="val font-mono">${booking.inquiryId}</span>
        </div>
        <div class="summary-item">
          <span class="label">Destination</span>
          <span class="val">${booking.destination}</span>
        </div>
        <div class="summary-item">
          <span class="label">Travel Dates</span>
          <span class="val">${booking.travelStartDate || 'TBA'} &rarr; ${booking.travelEndDate || 'TBA'}</span>
        </div>
        <div class="summary-item">
          <span class="label">Duration</span>
          <span class="val">${booking.noOfNights} Nights / ${booking.noOfDays} Days</span>
        </div>
        <div class="summary-item">
          <span class="label">Total Travelers</span>
          <span class="val">${booking.numberOfGuests} Guests (${booking.adults} Adults, ${booking.kids} Kids)</span>
        </div>
      </div>

      <!-- CONFIRMED HOTELS -->
      <div class="section-title">🏨 Confirmed Accommodations</div>
      <div style="margin-bottom: 24px;">
        ${hotels.length === 0 ? `
          <div style="padding: 14px; background: #0d1321; border-radius: 10px; font-size: 12px; color: #94a3b8;">
            Accommodations currently as per finalized proposal.
          </div>
        ` : hotels.map((h, i) => `
          <div class="hotel-card">
            <div>
              <div class="hotel-name">${i + 1}. ${h.hotelName || 'Property'}</div>
              <div class="hotel-meta">
                ${h.city} &bull; ${h.nights} Night(s) &bull; Room: <strong>${h.roomCategory || 'Deluxe Room'}</strong> &bull; Meal Plan: <strong>CP (Breakfast Included)</strong>
                ${h.dates ? ` &bull; Stay: <strong>${h.dates}</strong>` : ''}
              </div>
            </div>
            <div style="text-align: right;">
              <span class="hotel-badge">Confirmed ✓</span>
              ${h.confirmationNumber ? `
                <div style="font-size: 10px; color: #94a3b8; font-family: monospace; margin-top: 4px;">
                  Voucher #${h.confirmationNumber}
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- TRANSPORT -->
      <div class="section-title">🚗 Dedicated Private Transport &amp; Chauffeur</div>
      <div class="transport-box">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <div>
            <div style="font-size: 14px; font-weight: 800; color: #ffffff;">
              ${transport?.vehicleType || 'Dedicated Private AC Cab'}
            </div>
            <div style="font-size: 11px; color: #94a3b8; margin-top: 3px;">
              Duration: <strong>${transport?.totalDays || booking.noOfDays} Days Dedicated Service</strong>
              ${transport?.driverName ? ` &bull; Chauffeur: <strong>${transport.driverName}</strong>` : ''}
              ${transport?.vehicleNumber ? ` &bull; Vehicle #: <strong>${transport.vehicleNumber}</strong>` : ''}
            </div>
          </div>
          <span class="hotel-badge">Assigned &amp; Confirmed ✓</span>
        </div>
        <div style="font-size: 10.5px; color: #64748b; margin-top: 8px; border-top: 1px solid #1f293d; padding-top: 8px;">
          ✓ Includes: Dedicated Professional Chauffeur, Fuel, Inter-state Road Taxes, All Toll Taxes &amp; Parking Charges.
        </div>
      </div>

      <!-- PAID EXPERIENCES ONLY -->
      ${paidExperiences.length > 0 ? `
      <div class="section-title">🎯 Curated Paid Sightseeing &amp; Experiences Included</div>
      <div class="exp-grid">
        ${paidExperiences.map(exp => `
          <div class="exp-card">
            <div class="exp-day">Day ${exp.dayNumber} &bull; ${exp.dayTitle}</div>
            <div class="exp-title">${exp.name}</div>
            ${exp.description ? `<div style="font-size: 10px; color: #94a3b8; margin-top: 3px;">${exp.description}</div>` : ''}
            <div style="font-size: 9.5px; color: #34d399; font-weight: 700; margin-top: 4px;">✓ Included in Package</div>
          </div>
        `).join('')}
      </div>
      ` : ''}

      <!-- PAYMENT SUMMARY -->
      <div class="section-title">💳 Billing &amp; Payment Summary</div>
      <table class="pricing-table">
        <tr>
          <td class="label">Total Package Quotation (With 5% GST)</td>
          <td class="val" style="color: #ffffff; font-size: 13px;">₹${totalAmount.toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td class="label">Pre-Tax Base Amount (Without Taxes)</td>
          <td class="val" style="color: #94a3b8;">₹${preTaxAmount.toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td class="label">Advance Amount Received</td>
          <td class="val" style="color: #34d399;">₹${advancePaid.toLocaleString('en-IN')} [CONFIRMED]</td>
        </tr>
        <tr>
          <td class="label">Balance Payable Amount</td>
          <td class="val" style="color: ${balanceDue === 0 ? '#34d399' : '#f59e0b'}; font-size: 14px;">
            ₹${balanceDue.toLocaleString('en-IN')} ${balanceDue === 0 ? '(All Paid ✓)' : '(Due at Check-in)'}
          </td>
        </tr>
      </table>

      <!-- GUIDELINES -->
      <div class="guidelines-box">
        <strong style="color: #f97316; font-size: 11px; text-transform: uppercase;">⚠️ Important Guest Guidelines:</strong>
        <ul>
          <li><strong>Check-in ID:</strong> Standard hotel check-in time is 12:00 PM / 2:00 PM. A valid Government Photo ID (Aadhaar / Passport / Driving License) is mandatory for all traveling adults at check-in.</li>
          <li><strong>Cab Usage:</strong> The dedicated vehicle is at your disposal as per the scheduled tour itinerary points. AC is operational during transit (as per local hill station / national park guidelines).</li>
          <li><strong>Voucher Presentation:</strong> Please present this official confirmation voucher (digital copy or print) at the hotel reception upon arrival.</li>
        </ul>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="voucher-footer">
      <div class="support-info">
        <div><strong>24x7 Wanderphilia On-Tour Concierge:</strong> +91 98765 43210</div>
        <div>Support Email: <a href="mailto:experiences@wanderphilia.com" style="color: #f97316; text-decoration: none;">experiences@wanderphilia.com</a></div>
        <div style="margin-top: 4px; font-size: 10px; color: #64748b;">Wanderphilia Experiences &bull; Registered Office &bull; www.wanderphilia.com</div>
      </div>
      <div class="seal-box">
        <div class="seal-text">Authorized Signatory &bull; Wanderphilia</div>
        <div style="font-family: monospace; font-size: 10px; color: #64748b; margin-top: 2px;">
          DIGITALLY CERTIFIED VOUCHER
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
