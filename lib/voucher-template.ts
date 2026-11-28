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
function resolveStayDates(hotel: any, index: number, allHotels: any[], travelStartDate?: string): { checkIn: string; checkOut: string; rangeStr: string } {
  if (hotel.checkIn && hotel.checkOut) {
    return { checkIn: hotel.checkIn, checkOut: hotel.checkOut, rangeStr: `${hotel.checkIn} → ${hotel.checkOut}` };
  }
  const nights = Number(hotel.nights || 1);
  let baseDate: Date | null = null;
  if (travelStartDate) {
    if (/^\d{4}-\d{2}-\d{2}/.test(travelStartDate)) {
      baseDate = new Date(travelStartDate);
    } else if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}/.test(travelStartDate)) {
      const [d, m, y] = travelStartDate.split(/[\/\-]/);
      baseDate = new Date(Number(y), Number(m) - 1, Number(d));
    }
  }
  if (baseDate && !isNaN(baseDate.getTime())) {
    let cumulative = 0;
    for (let i = 0; i < index; i++) cumulative += Number(allHotels[i]?.nights || 1);
    const inDate = new Date(baseDate);
    inDate.setDate(inDate.getDate() + cumulative);
    const outDate = new Date(inDate);
    outDate.setDate(outDate.getDate() + nights);
    const inStr = inDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const outStr = outDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    return { checkIn: inStr, checkOut: outStr, rangeStr: `${inStr} → ${outStr}` };
  }
  if (hotel.dates) {
    return { checkIn: hotel.dates, checkOut: '', rangeStr: hotel.dates };
  }
  return { checkIn: `Day ${index + 1}`, checkOut: `Day ${index + 1 + nights}`, rangeStr: `Day ${index + 1} → Day ${index + 1 + nights}` };
}

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

    /* Base Mobile-First Styles: 0 outer padding on mobile to eliminate dead horizontal space */
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0b0f19;
      color: #f1f5f9;
      padding: 0;
      margin: 0;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }

    .voucher-container {
      width: 100%;
      max-width: 100%;
      margin: 0;
      background: #111827;
      border: none;
      border-radius: 0;
      overflow: hidden;
    }

    /* Header */
    .voucher-header {
      background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);
      padding: 14px 12px;
      border-bottom: 2px solid #f97316;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }
    .brand-col {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-shrink: 0;
    }
    .brand-logo {
      height: 38px;
      max-width: 160px;
      width: auto;
      object-fit: contain;
      display: block;
    }
    .voucher-meta {
      text-align: right;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2px;
      flex-shrink: 0;
    }
    .voucher-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 9999px;
      font-size: 8.5px;
      font-weight: 900;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.4);
      white-space: nowrap;
    }
    .voucher-num {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
      font-weight: 800;
      color: #f8fafc;
      white-space: nowrap;
    }
    .voucher-date {
      font-size: 9.5px;
      color: #94a3b8;
      white-space: nowrap;
    }

    /* Body */
    .voucher-body {
      padding: 14px 12px;
    }
    .section-title {
      font-size: 11px;
      font-weight: 900;
      color: #f97316;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
      border-bottom: 1px solid #1f293d;
      padding-bottom: 5px;
    }

    /* Summary Grid */
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
      background: #0d1321;
      padding: 12px 10px;
      border-radius: 12px;
      border: 1px solid #1f293d;
      margin-bottom: 18px;
    }
    .summary-item .label {
      font-size: 9px;
      text-transform: uppercase;
      color: #64748b;
      font-weight: 700;
      display: block;
      margin-bottom: 2px;
    }
    .summary-item .val {
      font-size: 11.5px;
      font-weight: 800;
      color: #f8fafc;
      word-break: break-word;
    }

    /* Hotels */
    .hotel-card {
      background: #0d1321;
      border: 1px solid #1f293d;
      border-radius: 12px;
      padding: 11px 12px;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-direction: column;
      gap: 8px;
    }
    .hotel-name {
      font-size: 12.5px;
      font-weight: 800;
      color: #ffffff;
    }
    .hotel-meta {
      font-size: 10.5px;
      color: #94a3b8;
      margin-top: 3px;
      line-height: 1.4;
    }
    .hotel-badge {
      font-size: 9px;
      font-weight: 800;
      color: #34d399;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 3px 8px;
      border-radius: 6px;
      text-transform: uppercase;
      display: inline-block;
    }

    /* Transport Card */
    .transport-box {
      background: #0d1321;
      border: 1px solid #1f293d;
      border-radius: 12px;
      padding: 12px 12px;
      margin-bottom: 18px;
    }

    /* Paid Experiences Grid */
    .exp-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin-bottom: 18px;
    }
    .exp-card {
      background: #0d1321;
      border: 1px solid #1f293d;
      border-left: 3px solid #f97316;
      border-radius: 10px;
      padding: 10px 12px;
    }
    .exp-day {
      font-size: 9px;
      font-weight: 800;
      color: #f97316;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    .exp-title {
      font-size: 11.5px;
      font-weight: 800;
      color: #ffffff;
    }

    /* Pricing Table */
    .pricing-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 18px;
      background: #0d1321;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #1f293d;
    }
    .pricing-table td {
      padding: 9px 12px;
      border-bottom: 1px solid #1f293d;
      font-size: 11px;
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
      padding: 12px;
      font-size: 10px;
      color: #cbd5e1;
      line-height: 1.5;
      margin-bottom: 18px;
    }
    .guidelines-box ul {
      padding-left: 15px;
      margin-top: 4px;
    }

    /* Footer & Support */
    .voucher-footer {
      background: #080c14;
      padding: 14px 12px;
      border-top: 1px solid #1f293d;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
    .support-info {
      font-size: 10px;
      color: #94a3b8;
      line-height: 1.5;
    }
    .support-info strong {
      color: #ffffff;
    }
    .seal-box {
      text-align: left;
    }
    .seal-text {
      font-size: 9px;
      text-transform: uppercase;
      color: #34d399;
      font-weight: 900;
      letter-spacing: 0.8px;
    }

    /* Desktop & Tablet View (min-width: 640px) */
    @media (min-width: 640px) {
      body {
        padding: 20px 16px;
        background-color: #080c14;
      }
      .voucher-container {
        max-width: 820px;
        margin: 0 auto;
        border: 1px solid #1f293d;
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
      }
      .voucher-header {
        padding: 24px 28px;
        gap: 16px;
      }
      .brand-logo {
        height: 52px;
        max-width: 230px;
      }
      .voucher-meta {
        gap: 3px;
      }
      .voucher-badge {
        font-size: 9.5px;
        padding: 4px 10px;
      }
      .voucher-num {
        font-size: 12.5px;
      }
      .voucher-date {
        font-size: 10.5px;
      }
      .voucher-body {
        padding: 24px 28px;
      }
      .section-title {
        font-size: 12px;
        letter-spacing: 0.8px;
        margin-bottom: 12px;
      }
      .summary-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
        padding: 18px 20px;
        margin-bottom: 24px;
      }
      .summary-item .label {
        font-size: 9.5px;
      }
      .summary-item .val {
        font-size: 13px;
      }
      .hotel-card {
        padding: 14px 18px;
        flex-direction: row;
        align-items: center;
        margin-bottom: 10px;
      }
      .hotel-name {
        font-size: 13.5px;
      }
      .hotel-meta {
        font-size: 11px;
      }
      .transport-box {
        padding: 16px 18px;
        margin-bottom: 24px;
      }
      .exp-grid {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 10px;
        margin-bottom: 24px;
      }
      .exp-card {
        padding: 12px 14px;
      }
      .exp-title {
        font-size: 12px;
      }
      .pricing-table {
        margin-bottom: 24px;
      }
      .pricing-table td {
        padding: 12px 18px;
        font-size: 12px;
      }
      .guidelines-box {
        padding: 14px 16px;
        font-size: 10.5px;
        margin-bottom: 24px;
      }
      .voucher-footer {
        padding: 22px 28px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
      .support-info {
        font-size: 10.5px;
      }
      .seal-box {
        text-align: right;
      }
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
    <!-- HEADER (Logo is clean image with no duplicate text) -->
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
      <div style="margin-bottom: 18px;">
        ${hotels.length === 0 ? `
          <div style="padding: 14px; background: #0d1321; border-radius: 10px; font-size: 12px; color: #94a3b8;">
            Accommodations currently as per finalized proposal.
          </div>
        ` : hotels.map((h, i) => {
          const stayDates = resolveStayDates(h, i, hotels, booking.travelStartDate);
          return `
          <div class="hotel-card">
            <div>
              <div class="hotel-name">${i + 1}. ${h.hotelName || 'Property'} (${h.city})</div>
              <div class="hotel-meta">
                ${h.nights} Night(s) &bull; Room: <strong>${h.roomCategory || 'Deluxe Room'}</strong> &bull; Meal Plan: <strong>CP (Breakfast Included)</strong>
              </div>
              <div style="font-size: 11px; color: #fbbf24; font-family: monospace; font-weight: 700; margin-top: 4px;">
                📅 Check-in: <span style="color: #ffffff;">${stayDates.checkIn}</span> ➔ Check-out: <span style="color: #ffffff;">${stayDates.checkOut}</span>
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
        `;
        }).join('')}
      </div>

      <!-- TRANSPORT -->
      <div class="section-title">🚗 Dedicated Private Transport &amp; Chauffeur</div>
      <div class="transport-box">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <div>
            <div style="font-size: 13.5px; font-weight: 800; color: #ffffff;">
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
          <td class="val" style="color: ${balanceDue === 0 ? '#34d399' : '#f59e0b'}; font-size: 13.5px;">
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
        <div style="margin-top: 4px; font-size: 9.5px; color: #64748b;">Wanderphilia Experiences &bull; Registered Office &bull; www.wanderphilia.com</div>
      </div>
      <div class="seal-box">
        <div class="seal-text">Authorized Signatory &bull; Wanderphilia</div>
        <div style="font-family: monospace; font-size: 9.5px; color: #64748b; margin-top: 2px;">
          DIGITALLY CERTIFIED VOUCHER
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
