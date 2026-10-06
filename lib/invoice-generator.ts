import { jsPDF } from 'jspdf';
import path from 'path';
import fs from 'fs';

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string; // e.g. "24 March 2026" or "03 Oct 2026"
  paymentId: string; // Razorpay payment ID (e.g. pay_XXXXX)
  orderId: string; // Razorpay order ID (e.g. order_XXXXX)
  itineraryId: string;
  inquiryId?: string;
  leadId?: string;
  
  // Customer / Client Details
  customerName: string;
  customerAddress?: string;
  customerEmail?: string;
  customerMobile?: string;
  customerGstNo?: string;
  customerPanNo?: string;

  // Trip / Package Details
  destination: string;
  tripTitle?: string;
  travelStartDate?: string;
  travelEndDate?: string;
  noOfDays?: number;
  noOfNights?: number;
  numberOfGuests?: number;
  adults?: number;
  kids?: number;
  vehicleType?: string;
  roomCategory?: string;

  // Financials
  paymentType: 'token' | 'advance' | 'remaining_advance' | 'remaining_balance' | 'full' | string;
  totalPackageAmount: number;
  paidAmount: number;
  balanceDue: number;
  baseAmount?: number;
  gstPercentage?: number;
  gstAmount?: number;
  tcsPercentage?: number;
  tcsAmount?: number;
  sacCode?: string;
  gstId?: string;
}

/**
 * Convert number to Indian Currency Words (Lakhs, Crores, Thousands)
 */
export function numberToWordsINR(num: number): string {
  if (!num || num === 0) return 'Zero';
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n: number): string {
    if (n === 0) return '';
    if (n < 20) return a[n] + ' ';
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '') + ' ';
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred ' + inWords(n % 100);
    if (n < 100000) return inWords(Math.floor(n / 1000)).trim() + ' Thousand ' + inWords(n % 1000);
    if (n < 10000000) return inWords(Math.floor(n / 100000)).trim() + ' Lakh ' + inWords(n % 100000);
    return inWords(Math.floor(n / 10000000)).trim() + ' Crore ' + inWords(n % 10000000);
  }

  return inWords(Math.round(num)).trim().replace(/\s+/g, ' ');
}

/**
 * Helper to get logo base64 if running in Node.js server
 */
function getLogoBase64(): string | null {
  try {
    const logoPath = path.join(process.cwd(), 'public', 'images', 'LOGO.png');
    if (fs.existsSync(logoPath)) {
      const fileBuffer = fs.readFileSync(logoPath);
      return `data:image/png;base64,${fileBuffer.toString('base64')}`;
    }
  } catch (err) {
    console.error('[Invoice Generator] Could not load logo image from filesystem:', err);
  }
  return null;
}

/**
 * Helper to get stamp base64 if running in Node.js server
 */
function getStampBase64(): string | null {
  try {
    const stampPath = path.join(process.cwd(), 'public', 'images', 'stamp.png');
    if (fs.existsSync(stampPath)) {
      const fileBuffer = fs.readFileSync(stampPath);
      return `data:image/png;base64,${fileBuffer.toString('base64')}`;
    }
  } catch (err) {
    console.error('[Invoice Generator] Could not load stamp image from filesystem:', err);
  }
  return null;
}

export function generateInvoicePDFDocument(data: InvoiceData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Page Dimensions & Frame Margins
  const frameX = 12;
  const frameY = 10;
  const frameW = 186;
  const frameH = 277;
  const rightEdge = frameX + frameW; // 198mm

  // Brand Palette
  const orangePrimary: [number, number, number] = [255, 107, 0]; // #FF6B00
  const orangeText: [number, number, number] = [255, 119, 0]; // #FF7700
  const blackText: [number, number, number] = [0, 0, 0];
  const signatureBlue: [number, number, number] = [37, 99, 235]; // #2563EB

  // ==========================================
  // 1. OUTER BLACK RECTANGULAR BORDER
  // ==========================================
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.6);
  doc.rect(frameX, frameY, frameW, frameH);

  // ==========================================
  // 2. HEADER: LOGO & COMPANY INFORMATION
  // ==========================================
  const logoBase64 = getLogoBase64();
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', frameX + 4, frameY + 4, 30, 30);
    } catch (e) {
      // Fallback Vector Orange Circle
      doc.setFillColor(...orangePrimary);
      doc.circle(frameX + 19, frameY + 19, 14, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('W', frameX + 19, frameY + 23, { align: 'center' });
    }
  } else {
    doc.setFillColor(...orangePrimary);
    doc.circle(frameX + 19, frameY + 19, 14, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('W', frameX + 19, frameY + 23, { align: 'center' });
  }

  // Company Details (Right of Logo)
  const headerTextX = frameX + 40;
  let currentY = frameY + 11;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...blackText);
  doc.text('Wanderphilia Experiences Pvt. Ltd', headerTextX, currentY);

  currentY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...blackText);
  doc.text('262/64 Laxmi Vihar Building. Walkeshwar Mumbai.', headerTextX, currentY);

  currentY += 5.5;
  doc.text('EmailID: ', headerTextX, currentY);
  const emailLabelWidth = doc.getTextWidth('EmailID: ');
  doc.setTextColor(...orangeText);
  doc.text('experiences@wanderphilia.com', headerTextX + emailLabelWidth, currentY);

  currentY += 5.5;
  doc.setTextColor(...blackText);
  doc.text('Instagram: Wanderphiliaa.', headerTextX, currentY);

  // ==========================================
  // 3. ORANGE BANNER: "INVOICE"
  // ==========================================
  const bannerY = frameY + 36;
  const bannerHeight = 10;

  doc.setFillColor(...orangePrimary);
  doc.rect(frameX, bannerY, frameW, bannerHeight, 'F');

  // Banner top and bottom black borders
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.6);
  doc.line(frameX, bannerY, rightEdge, bannerY);
  doc.line(frameX, bannerY + bannerHeight, rightEdge, bannerY + bannerHeight);

  // Text "INVOICE"
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...blackText);
  doc.text('INVOICE', frameX + frameW / 2, bannerY + 6.8, { align: 'center' });

  // ==========================================
  // 4. CLIENT & TAX META GRID (TWO COLUMNS)
  // ==========================================
  const metaY = bannerY + bannerHeight; // frameY + 46 (56mm)
  const metaHeight = 36;
  const metaDividerX = frameX + 76; // 88mm

  // Horizontal bottom border of meta section
  doc.line(frameX, metaY + metaHeight, rightEdge, metaY + metaHeight);

  // Vertical divider between Client and Tax info
  doc.line(metaDividerX, metaY, metaDividerX, metaY + metaHeight);

  // Left Column: Client / Traveler Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...blackText);
  const clientName = data.customerName || 'Valued Traveler';
  doc.text(clientName, frameX + 4, metaY + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  let clientY = metaY + 11.5;
  if (data.customerAddress) {
    const splitAddr = doc.splitTextToSize(data.customerAddress, metaDividerX - frameX - 8);
    doc.text(splitAddr, frameX + 4, clientY);
    clientY += splitAddr.length * 4;
  } else {
    if (data.customerMobile) {
      doc.text(`Phone: ${data.customerMobile}`, frameX + 4, clientY);
      clientY += 4;
    }
    if (data.customerEmail) {
      doc.text(`Email: ${data.customerEmail}`, frameX + 4, clientY);
      clientY += 4;
    }
    if (data.customerGstNo) {
      doc.text(`Client GST: ${data.customerGstNo}`, frameX + 4, clientY);
      clientY += 4;
    }
    if (data.customerPanNo) {
      doc.text(`Client PAN: ${data.customerPanNo}`, frameX + 4, clientY);
      clientY += 4;
    }
    doc.text(`Destination: ${data.destination || 'Luxury Tour'}`, frameX + 4, clientY);
    clientY += 4;
    if (data.itineraryId) {
      doc.text(`Booking Ref: ${data.itineraryId}`, frameX + 4, clientY);
    }
  }

  // Right Column: GST, Invoice No, Date, SAC Code
  const rightLabelX = metaDividerX + 12;
  const rightValX = metaDividerX + 44;
  let taxY = metaY + 6.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...blackText);

  doc.text('GST ID-', rightLabelX, taxY);
  doc.text(data.gstId || '27AAAFB9852F2ZE', rightValX, taxY);

  taxY += 6.5;
  doc.text('INVOICE NO.', rightLabelX, taxY);
  doc.text(data.invoiceNumber || 'CORP./2026/004', rightValX, taxY);

  taxY += 6.5;
  doc.text('INVOICE DATE', rightLabelX, taxY);
  doc.text(data.invoiceDate || '24 March 2026', rightValX, taxY);

  taxY += 6.5;
  doc.text('SAC Code', rightLabelX, taxY);
  doc.text(data.sacCode || '998556', rightValX, taxY);

  // ==========================================
  // 5. MAIN TABLE (DESCRIPTION & AMOUNT)
  // ==========================================
  const tableHeaderY = metaY + metaHeight; // 92mm
  const tableHeaderHeight = 9;
  const colDivider1 = metaDividerX; // 88mm
  const colDivider2 = frameX + 130; // 142mm
  const tableContentHeight = 44;
  const tableBottomY = tableHeaderY + tableHeaderHeight + tableContentHeight; // 145mm

  // Table header bottom line
  doc.line(frameX, tableHeaderY + tableHeaderHeight, rightEdge, tableHeaderY + tableHeaderHeight);

  // Table vertical columns
  doc.line(colDivider1, tableHeaderY, colDivider1, tableBottomY);
  doc.line(colDivider2, tableHeaderY, colDivider2, tableBottomY);

  // Headers
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...blackText);
  doc.text('Description', frameX + 4, tableHeaderY + 6.2);
  doc.text('Amount ( INR )', colDivider1 + 14, tableHeaderY + 6.2);

  // Table Row 1: Tour / Package Particulars
  let itemY = tableHeaderY + tableHeaderHeight + 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  const descLine1 = data.tripTitle || `${data.destination} Tour Package (${data.noOfNights || 4}N / ${data.noOfDays || 5}D)`;
  doc.text(descLine1, frameX + 4, itemY);

  itemY += 4.5;
  if (data.travelStartDate) {
    const datesStr = `${data.travelStartDate}${data.travelEndDate ? ` - ${data.travelEndDate}` : ''}`;
    doc.text(`Dates: ${datesStr} | Guests: ${data.adults || data.numberOfGuests || 2} Pax`, frameX + 4, itemY);
    itemY += 4.5;
  }

  let paymentLabel = 'Tour Package Payment';
  if (data.paymentType === 'token') {
    paymentLabel = 'Token Booking Amount (10%)';
  } else if (data.paymentType === 'advance') {
    paymentLabel = 'Advance Booking Amount (50%)';
  } else if (data.paymentType === 'remaining_advance') {
    paymentLabel = 'Remaining Advance Payment (40%)';
  } else if (data.paymentType === 'remaining_balance') {
    paymentLabel = 'Remaining Balance Payment';
  } else if (data.paymentType === 'full') {
    paymentLabel = 'Full Package Payment (100%)';
  }

  doc.text(`Payment: ${paymentLabel}`, frameX + 4, itemY);

  if (data.paymentId) {
    itemY += 4.5;
    doc.text(`Razorpay Ref: ${data.paymentId}`, frameX + 4, itemY);
  }

  // Amount column Row 1
  const isPartial = data.balanceDue > 0;
  const gstPct = data.gstPercentage !== undefined ? data.gstPercentage : 5;
  const tcsPct = data.tcsPercentage !== undefined ? data.tcsPercentage : 2;
  const taxMultiplier = 1 + (gstPct + tcsPct) / 100;

  const currentPay = data.paidAmount || data.totalPackageAmount;
  const calculatedBase = data.baseAmount && !isPartial 
    ? data.baseAmount 
    : Math.round(currentPay / taxMultiplier);
  const formattedBaseCost = calculatedBase.toLocaleString('en-IN');
  doc.text(formattedBaseCost, rightEdge - 5, tableHeaderY + tableHeaderHeight + 7, { align: 'right' });

  // Table Row 2: 5% GST
  const gstRowY = tableHeaderY + tableHeaderHeight + 28;
  doc.text(`GST (${gstPct}%)`, frameX + 4, gstRowY);
  const calculatedGst = data.gstAmount !== undefined && !isPartial 
    ? data.gstAmount 
    : Math.round(calculatedBase * (gstPct / 100));
  doc.text(calculatedGst.toLocaleString('en-IN'), rightEdge - 5, gstRowY, { align: 'right' });

  // Table Row 3: 2% TCS
  const tcsRowY = tableHeaderY + tableHeaderHeight + 36;
  doc.text(`TCS (${tcsPct}%)`, frameX + 4, tcsRowY);
  const calculatedTcs = data.tcsAmount !== undefined && !isPartial 
    ? data.tcsAmount 
    : (currentPay - calculatedBase - calculatedGst > 0 ? (currentPay - calculatedBase - calculatedGst) : Math.round(calculatedBase * (tcsPct / 100)));
  doc.text(calculatedTcs.toLocaleString('en-IN'), rightEdge - 5, tcsRowY, { align: 'right' });

  // ==========================================
  // 6. TOTAL PAYABLE ROW
  // ==========================================
  const totalRowY = tableBottomY; // 145mm
  const totalRowHeight = 9;

  doc.line(frameX, totalRowY, rightEdge, totalRowY);
  doc.line(frameX, totalRowY + totalRowHeight, rightEdge, totalRowY + totalRowHeight);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text('Total Payable', frameX + 4, totalRowY + 6.2);

  const totalPayableAmount = data.paidAmount || data.totalPackageAmount;
  doc.text(totalPayableAmount.toLocaleString('en-IN'), rightEdge - 5, totalRowY + 6.2, { align: 'right' });

  // ==========================================
  // 7. IN RUPEES (AMOUNT IN WORDS) ROW
  // ==========================================
  const wordsRowY = totalRowY + totalRowHeight; // 154mm
  const wordsRowHeight = 10;

  doc.line(frameX, wordsRowY + wordsRowHeight, rightEdge, wordsRowY + wordsRowHeight);

  const amountInWords = numberToWordsINR(totalPayableAmount);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`In Rupees:  ${amountInWords} Only.`, frameX + 4, wordsRowY + 6.5);

  // ==========================================
  // 8. NOTE & JURISDICTION
  // ==========================================
  const noteY = wordsRowY + wordsRowHeight + 14; // 178mm
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...blackText);
  doc.text('Note:', frameX + 4, noteY);
  doc.text('All disputed are subject to Mumbai Jurisdiction.', frameX + 4, noteY + 7);

  // ==========================================
  // 9. SIGNATURE, FOUNDER & OFFICIAL ROUND STAMP
  // ==========================================
  const signSectionX = frameX + 112; // 124mm
  const signBaseY = frameY + 215; // 225mm

  // A. Cursive Signature (Bhavin)
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(14);
  doc.setTextColor(...signatureBlue);
  doc.text('Bhavin', signSectionX + 2, signBaseY - 1);

  // B. Signatory Text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...blackText);
  doc.text('Wanderphilia', signSectionX, signBaseY + 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Bhavin Thakkar', signSectionX, signBaseY + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Founder Partner', signSectionX, signBaseY + 24);

  // C. Official Wanderphilia Round Stamp (Exact Uploaded Stamp Image)
  const stampBase64 = getStampBase64();
  const stampX = rightEdge - 36; // 162mm
  const stampY = signBaseY - 2; // 223mm
  const stampSize = 30; // 30mm x 30mm

  if (stampBase64) {
    try {
      doc.addImage(stampBase64, 'PNG', stampX, stampY, stampSize, stampSize);
    } catch (e) {
      console.error('[Invoice Generator] Error embedding stamp image:', e);
      // Fallback
      doc.setDrawColor(...orangePrimary);
      doc.setLineWidth(0.8);
      doc.circle(stampX + 15, stampY + 15, 14, 'S');
      doc.circle(stampX + 15, stampY + 15, 11.5, 'S');
    }
  } else {
    // Vector fallback
    const stampCenterX = rightEdge - 22;
    const stampCenterY = signBaseY + 12;
    doc.setDrawColor(...orangePrimary);
    doc.setLineWidth(0.8);
    doc.circle(stampCenterX, stampCenterY, 14, 'S');
    doc.circle(stampCenterX, stampCenterY, 11.5, 'S');
  }

  return doc;
}

/**
 * Generates an Invoice PDF and returns it as a Node.js Buffer
 */
export async function generateInvoicePDFBuffer(data: InvoiceData): Promise<Buffer> {
  const doc = generateInvoicePDFDocument(data);
  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}

/**
 * Helper to generate a standardized Invoice Number matching Wanderphilia format
 */
export function generateInvoiceNumber(prefix: string = 'CORP.'): string {
  const year = new Date().getFullYear();
  const random = Math.floor(100 + Math.random() * 900);
  return `${prefix}/${year}/${random}`;
}
