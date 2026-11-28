import { jsPDF } from 'jspdf';
import path from 'path';
import fs from 'fs';
import { OperationsBooking } from '@/types/operations';
import { getPaidExperiencesOnly } from './voucher-template';

/**
 * Loads image from public/images as Base64 for Node.js server-side jsPDF
 */
function getImageBase64(filename: string): string | null {
  try {
    const fullPath = path.join(process.cwd(), 'public', 'images', filename);
    if (fs.existsSync(fullPath)) {
      const buf = fs.readFileSync(fullPath);
      const ext = path.extname(filename).toLowerCase().replace('.', '') || 'png';
      return `data:image/${ext === 'jpg' ? 'jpeg' : ext};base64,${buf.toString('base64')}`;
    }
  } catch (err) {
    console.error(`[Voucher PDF] Error loading image ${filename}:`, err);
  }
  return null;
}

/**
 * Generates an official, luxury branded Confirmation Voucher PDF using jsPDF
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

export function generateVoucherPDFDocument(booking: OperationsBooking): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

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

  // Page geometry
  const leftX = 14;
  const pageWidth = 210;
  const contentWidth = 182;
  const rightX = leftX + contentWidth; // 196
  const maxY = 278;

  // Colors
  const orangePrimary: [number, number, number] = [249, 115, 22]; // #F97316
  const darkNavy: [number, number, number] = [15, 23, 42]; // #0F172A
  const slateDark: [number, number, number] = [30, 41, 59]; // #1E293B
  const slateMuted: [number, number, number] = [100, 116, 139]; // #64748B
  const emeraldGreen: [number, number, number] = [16, 185, 129]; // #10B981
  const bgLightCard: [number, number, number] = [248, 250, 252]; // #F8FAFC
  const borderGray: [number, number, number] = [226, 232, 240]; // #E2E8F0

  let currentY = 12;

  // Helper: Page Break Check
  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > maxY) {
      doc.addPage();
      currentY = 16;
      // Running mini-header on subsequent pages
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...slateMuted);
      doc.text(`Wanderphilia Experiences | Voucher #${voucherNumber} (${booking.customerName})`, leftX, currentY);
      doc.text(`Page ${doc.getNumberOfPages()}`, rightX, currentY, { align: 'right' });
      currentY += 3;
      doc.setDrawColor(...borderGray);
      doc.setLineWidth(0.3);
      doc.line(leftX, currentY, rightX, currentY);
      currentY += 8;
    }
  };

  // ==========================================
  // 1. HEADER (BRAND LOGO + META BADGES)
  // ==========================================
  const headerHeight = 26;
  doc.setFillColor(...darkNavy);
  doc.rect(leftX, currentY, contentWidth, headerHeight, 'F');

  // Orange accent line below header
  doc.setFillColor(...orangePrimary);
  doc.rect(leftX, currentY + headerHeight - 1.5, contentWidth, 1.5, 'F');

  // Logo on Left
  const logoBase64 = getImageBase64('Made_LOGO.png') || getImageBase64('LOGO.png');
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', leftX + 4, currentY + 3.5, 42, 18);
    } catch (e) {
      // Fallback text
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text('WANDERPHILIA', leftX + 6, currentY + 12);
      doc.setFontSize(7.5);
      doc.setTextColor(...orangePrimary);
      doc.text('CURATED TRAVEL EXPERIENCES', leftX + 6, currentY + 17);
    }
  } else {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('WANDERPHILIA', leftX + 6, currentY + 12);
    doc.setFontSize(7.5);
    doc.setTextColor(...orangePrimary);
    doc.text('CURATED TRAVEL EXPERIENCES', leftX + 6, currentY + 17);
  }

  // Right Side Meta
  const metaRightX = rightX - 5;
  // Status Pill
  const badgeW = 54;
  const badgeH = 5.5;
  const badgeX = metaRightX - badgeW;
  const badgeY = currentY + 4;
  doc.setFillColor(16, 185, 129, 0.2); // subtle green
  doc.setDrawColor(...emeraldGreen);
  doc.setLineWidth(0.3);
  doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...emeraldGreen);
  doc.text('CONFIRMED & GUARANTEED ✓', badgeX + badgeW / 2, badgeY + 3.8, { align: 'center' });

  // Voucher Ref
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(`Ref: ${voucherNumber}`, metaRightX, currentY + 15, { align: 'right' });

  // Issue Date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...slateMuted);
  doc.text(`Issue Date: ${issueDate}`, metaRightX, currentY + 20, { align: 'right' });

  currentY += headerHeight + 6;

  // ==========================================
  // 2. GUEST & ITINERARY INFORMATION (GRID BOX)
  // ==========================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...orangePrimary);
  doc.text('1. GUEST & ITINERARY SUMMARY', leftX, currentY);
  currentY += 4;

  const summaryBoxH = 24;
  doc.setFillColor(...bgLightCard);
  doc.setDrawColor(...borderGray);
  doc.setLineWidth(0.4);
  doc.roundedRect(leftX, currentY, contentWidth, summaryBoxH, 2, 2, 'FD');

  const colW = contentWidth / 3;
  const row1Y = currentY + 4.5;
  const row2Y = currentY + 14.5;

  // Col 1: Lead Guest Name & Travel Dates
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...slateMuted);
  doc.text('LEAD GUEST NAME', leftX + 4, row1Y);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...darkNavy);
  doc.text(booking.customerName || 'Guest', leftX + 4, row1Y + 4.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...slateMuted);
  doc.text('TRAVEL DATES', leftX + 4, row2Y);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...darkNavy);
  doc.text(`${booking.travelStartDate || 'TBA'} -> ${booking.travelEndDate || 'TBA'}`, leftX + 4, row2Y + 4.5);

  // Col 2: Inquiry ID & Duration
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...slateMuted);
  doc.text('BOOKING / INQUIRY ID', leftX + colW + 4, row1Y);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...darkNavy);
  doc.text(booking.inquiryId || 'WND', leftX + colW + 4, row1Y + 4.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...slateMuted);
  doc.text('DURATION', leftX + colW + 4, row2Y);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...darkNavy);
  doc.text(`${booking.noOfNights} Nights / ${booking.noOfDays} Days`, leftX + colW + 4, row2Y + 4.5);

  // Col 3: Destination & Travelers
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...slateMuted);
  doc.text('DESTINATION', leftX + colW * 2 + 4, row1Y);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...darkNavy);
  doc.text(booking.destination || 'India', leftX + colW * 2 + 4, row1Y + 4.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...slateMuted);
  doc.text('TOTAL TRAVELERS', leftX + colW * 2 + 4, row2Y);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...darkNavy);
  doc.text(`${booking.numberOfGuests} Guests (${booking.adults} Adults, ${booking.kids} Kids)`, leftX + colW * 2 + 4, row2Y + 4.5);

  currentY += summaryBoxH + 6;

  // ==========================================
  // 3. CONFIRMED ACCOMMODATIONS (HOTELS)
  // ==========================================
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...orangePrimary);
  doc.text('2. CONFIRMED ACCOMMODATIONS', leftX, currentY);
  currentY += 4;

  if (hotels.length === 0) {
    doc.setFillColor(...bgLightCard);
    doc.setDrawColor(...borderGray);
    doc.roundedRect(leftX, currentY, contentWidth, 10, 2, 2, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...slateMuted);
    doc.text('Accommodations confirmed as per finalized itinerary package.', leftX + 4, currentY + 6.5);
    currentY += 14;
  } else {
    hotels.forEach((h, idx) => {
      checkPageBreak(18);
      const cardH = 16;
      doc.setFillColor(...bgLightCard);
      doc.setDrawColor(...borderGray);
      doc.setLineWidth(0.3);
      doc.roundedRect(leftX, currentY, contentWidth, cardH, 2, 2, 'FD');

      const stayDates = resolveStayDates(h, idx, hotels, booking.travelStartDate);

      // Hotel Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...darkNavy);
      doc.text(`${idx + 1}. ${h.hotelName || 'Property'} (${h.city})`, leftX + 4, currentY + 4.5);

      // Meta Line
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...slateMuted);
      const stayMeta = `${h.nights} Night(s) | Room: ${h.roomCategory || 'Deluxe Room'} | Meal Plan: CP (Breakfast Included)`;
      doc.text(stayMeta, leftX + 4, currentY + 8.5);

      // Check-in & Check-out Dates Line
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(...orangePrimary);
      doc.text(`Check-in: ${stayDates.checkIn}   ➔   Check-out: ${stayDates.checkOut}`, leftX + 4, currentY + 12.5);

      // Confirmed Badge on Right
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...emeraldGreen);
      doc.text('CONFIRMED ✓', rightX - 4, currentY + 5.5, { align: 'right' });

      if (h.confirmationNumber) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(...slateMuted);
        doc.text(`Voucher #${h.confirmationNumber}`, rightX - 4, currentY + 10, { align: 'right' });
      }

      currentY += cardH + 2.5;
    });
    currentY += 3;
  }

  // ==========================================
  // 4. DEDICATED PRIVATE TRANSPORT
  // ==========================================
  checkPageBreak(25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...orangePrimary);
  doc.text('3. DEDICATED PRIVATE TRANSPORT & CHAUFFEUR', leftX, currentY);
  currentY += 4;

  const transportH = 16;
  doc.setFillColor(...bgLightCard);
  doc.setDrawColor(...borderGray);
  doc.setLineWidth(0.4);
  doc.roundedRect(leftX, currentY, contentWidth, transportH, 2, 2, 'FD');

  const vType = transport?.vehicleType || 'Dedicated Private AC Cab (Sedan / SUV)';
  const vDays = transport?.totalDays || booking.noOfDays;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...darkNavy);
  doc.text(vType, leftX + 4, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...slateMuted);
  const driverDetail = `${vDays} Days Dedicated Service${transport?.driverName ? ` | Chauffeur: ${transport.driverName}` : ''}${transport?.vehicleNumber ? ` | Vehicle #: ${transport.vehicleNumber}` : ''}`;
  doc.text(driverDetail, leftX + 4, currentY + 9.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Includes: Dedicated Chauffeur, Fuel, Inter-state Road Taxes, All Toll Taxes & Parking Charges.', leftX + 4, currentY + 13.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...emeraldGreen);
  doc.text('ASSIGNED & CONFIRMED ✓', rightX - 4, currentY + 5.5, { align: 'right' });

  currentY += transportH + 6;

  // ==========================================
  // 5. CURATED PAID EXPERIENCES ONLY
  // ==========================================
  if (paidExperiences.length > 0) {
    checkPageBreak(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...orangePrimary);
    doc.text('4. CURATED PAID EXPERIENCES & SIGHTSEEING INCLUDED', leftX, currentY);
    currentY += 4;

    paidExperiences.forEach(exp => {
      checkPageBreak(13);
      const expH = 11;
      doc.setFillColor(...bgLightCard);
      doc.setDrawColor(...borderGray);
      doc.setLineWidth(0.3);
      doc.roundedRect(leftX, currentY, contentWidth, expH, 2, 2, 'FD');

      // Orange left accent mark
      doc.setFillColor(...orangePrimary);
      doc.rect(leftX, currentY, 2, expH, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(...orangePrimary);
      doc.text(`DAY ${exp.dayNumber} - ${exp.dayTitle.toUpperCase()}`, leftX + 4, currentY + 4);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...darkNavy);
      doc.text(exp.name, leftX + 4, currentY + 8.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(...emeraldGreen);
      doc.text('✓ Included in Package', rightX - 4, currentY + 6.5, { align: 'right' });

      currentY += expH + 2;
    });
    currentY += 4;
  }

  // ==========================================
  // 6. BILLING & PAYMENT SUMMARY TABLE
  // ==========================================
  checkPageBreak(38);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...orangePrimary);
  doc.text('5. BILLING & FINANCIAL SETTLEMENT SUMMARY', leftX, currentY);
  currentY += 4;

  const tableH = 26;
  doc.setFillColor(...bgLightCard);
  doc.setDrawColor(...borderGray);
  doc.setLineWidth(0.4);
  doc.roundedRect(leftX, currentY, contentWidth, tableH, 2, 2, 'FD');

  const rowH = 6.5;
  const tRows = [
    { label: 'Total Package Quotation (With 5% GST)', val: `₹${totalAmount.toLocaleString('en-IN')}`, bold: true, color: darkNavy },
    { label: 'Pre-Tax Base Amount (Without Taxes)', val: `₹${preTaxAmount.toLocaleString('en-IN')}`, bold: false, color: slateMuted },
    { label: 'Advance Amount Received', val: `₹${advancePaid.toLocaleString('en-IN')} [CONFIRMED]`, bold: true, color: emeraldGreen },
    {
      label: 'Balance Payable Amount',
      val: `₹${balanceDue.toLocaleString('en-IN')} ${balanceDue === 0 ? '(All Paid ✓)' : '(Due at Check-in)'}`,
      bold: true,
      color: balanceDue === 0 ? emeraldGreen : orangePrimary,
    },
  ];

  tRows.forEach((r, idx) => {
    const rowY = currentY + (idx * rowH);
    if (idx > 0) {
      doc.setDrawColor(...borderGray);
      doc.setLineWidth(0.2);
      doc.line(leftX, rowY, rightX, rowY);
    }

    doc.setFont('helvetica', r.bold ? 'bold' : 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...(r.bold ? darkNavy : slateMuted));
    doc.text(r.label, leftX + 4, rowY + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...r.color);
    doc.text(r.val, rightX - 4, rowY + 4.5, { align: 'right' });
  });

  currentY += tableH + 6;

  // ==========================================
  // 7. IMPORTANT GUEST GUIDELINES
  // ==========================================
  checkPageBreak(25);
  doc.setFillColor(255, 247, 237); // subtle orange
  doc.setDrawColor(253, 186, 116);
  doc.setLineWidth(0.3);
  doc.roundedRect(leftX, currentY, contentWidth, 20, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...orangePrimary);
  doc.text('IMPORTANT GUEST GUIDELINES:', leftX + 4, currentY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(124, 45, 18);
  doc.text('• Check-in ID: Standard hotel check-in time is 12:00 PM / 2:00 PM. Government Photo ID is mandatory for all traveling adults.', leftX + 4, currentY + 9);
  doc.text('• Private Cab: The dedicated vehicle is at your disposal for scheduled itinerary points. AC is operational during transit.', leftX + 4, currentY + 13);
  doc.text('• Voucher Presentation: Please present this official confirmation voucher (digital copy or print) at hotel reception upon arrival.', leftX + 4, currentY + 17);

  currentY += 26;

  // ==========================================
  // 8. FOOTER WITH STAMP & CONCIERGE SUPPORT
  // ==========================================
  checkPageBreak(22);
  const footerH = 20;
  doc.setFillColor(...darkNavy);
  doc.rect(leftX, currentY, contentWidth, footerH, 'F');

  // Orange accent top border of footer
  doc.setFillColor(...orangePrimary);
  doc.rect(leftX, currentY, contentWidth, 1, 'F');

  // Left: Concierge Helpline
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('24x7 Wanderphilia On-Tour Concierge: +91 98765 43210', leftX + 4, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...slateMuted);
  doc.text('Support Email: experiences@wanderphilia.com | Web: www.wanderphilia.com', leftX + 4, currentY + 10.5);
  doc.text('Wanderphilia Experiences Pvt. Ltd. | 262/64 Laxmi Vihar, Mumbai', leftX + 4, currentY + 15);

  // Right: Stamp & Digital Certification
  const stampBase64 = getImageBase64('stamp.png');
  const stampSize = 16;
  const stampX = rightX - stampSize - 4;
  const stampY = currentY + 2;

  if (stampBase64) {
    try {
      doc.addImage(stampBase64, 'PNG', stampX, stampY, stampSize, stampSize);
    } catch (e) {
      // Vector seal fallback
      doc.setDrawColor(...emeraldGreen);
      doc.setLineWidth(0.4);
      doc.circle(rightX - 12, currentY + 10, 6, 'S');
    }
  } else {
    doc.setDrawColor(...emeraldGreen);
    doc.setLineWidth(0.4);
    doc.circle(rightX - 12, currentY + 10, 6, 'S');
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...emeraldGreen);
  doc.text('DIGITALLY CERTIFIED', stampX - 2, currentY + 8, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor(...slateMuted);
  doc.text('Authorized Signatory', stampX - 2, currentY + 12, { align: 'right' });

  return doc;
}

/**
 * Generates the Confirmation Voucher PDF and returns it as a Node.js Buffer
 */
export async function generateVoucherPDFBuffer(booking: OperationsBooking): Promise<Buffer> {
  const doc = generateVoucherPDFDocument(booking);
  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}
