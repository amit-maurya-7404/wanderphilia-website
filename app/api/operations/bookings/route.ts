import { NextRequest, NextResponse } from 'next/server';
import {
  getAllOperationsBookings,
  saveOperationsBooking,
  getOperationsStats
} from '@/lib/operations-db';
import { isAuthorizedOperationsRequest } from '@/lib/operations-auth';
import { OperationsBooking } from '@/types/operations';
import { syncBookingAndTaskOnPayment } from '@/lib/zoho-booking-automation';
import {
  uploadZohoLeadAttachment,
  addZohoLeadNote,
  updateZohoLeadPaymentStatus,
  findZohoLeadId,
} from '@/lib/zoho';
import {
  generateInvoicePDFBuffer,
  InvoiceData,
} from '@/lib/invoice-generator';
import { getDb } from '@/lib/mongodb';
import { sendEmail, ADMIN_NOTIFICATION_EMAIL } from '@/lib/email';
import { isInternationalTrip } from '@/lib/ai-itinerary';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET: Retrieve list of operations bookings & dashboard metrics
 */
export async function GET(req: NextRequest) {
  try {
    const isAuth = isAuthorizedOperationsRequest(req);
    if (!isAuth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Valid Operations PIN session required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status') || 'all';
    const searchQuery = searchParams.get('q') || searchParams.get('search') || '';

    const [bookings, stats] = await Promise.all([
      getAllOperationsBookings(statusFilter, searchQuery),
      getOperationsStats(),
    ]);

    return NextResponse.json({
      success: true,
      bookings,
      stats,
      count: bookings.length,
    });
  } catch (error) {
    console.error('[Operations Bookings GET Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch operations bookings.' },
      { status: 500 }
    );
  }
}

/**
 * POST: Sales Handover -> Confirms booking and creates Operations entry
 * Converts Zoho CRM Lead into Booking/Deal, updates status, generates invoice & pushes to Ops.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, error: 'Missing request body payload.' },
        { status: 400 }
      );
    }

    const inquiryId = String(body.inquiryId || body.Inquiry_ID || '').trim();
    const customerName = String(body.customerName || body.clientName || 'Valued Guest').trim();
    const customerMobile = String(body.customerMobile || body.phone || '').trim();
    const customerEmail = String(body.customerEmail || body.email || '').trim();
    const destination = String(body.destination || '').trim();

    if (!inquiryId && !customerName) {
      return NextResponse.json(
        { success: false, error: 'Inquiry ID or Customer Name is required.' },
        { status: 400 }
      );
    }

    const uniqueId = `OPS-${inquiryId ? inquiryId.replace(/[^a-zA-Z0-9-_]/g, '') : Date.now()}`;
    const selectedOptNum = Number(body.selectedOptionNumber || body.optionNumber || 1);

    // Calculate advance & balance
    const totalQuotation = Number(body.totalQuotationAmount || body.quotationAmount || 0);
    const advancePaid = Number(body.advanceAmountPaid || body.advancePaid || 0);
    const balanceDue = Math.max(0, totalQuotation - advancePaid);
    const paymentMode = String(body.paymentMode || 'bank_transfer');
    const utrNumber = String(body.utrNumber || body.transactionId || '').trim();
    const paymentDate = String(body.paymentDate || new Date().toISOString().split('T')[0]);

    // Construct Hotels array with B2B costs
    const hotels = (Array.isArray(body.hotels) ? body.hotels : []).map((h: any, idx: number) => {
      const nights = Number(h.nights) || 1;
      const rooms = Number(h.roomsCount || body.roomsCount || 1);
      const b2bCost = Number(h.b2bTotalCost || h.totalCost || (h.b2bCostPerNight ? h.b2bCostPerNight * nights * rooms : 0));
      return {
        id: h.id || `hotel-${idx + 1}`,
        city: String(h.city || 'City').trim(),
        nights,
        hotelName: String(h.hotelName || h.name || 'Selected Property').trim(),
        hotelId: h.hotelId || undefined,
        roomCategory: String(h.roomCategory || h.category || 'Deluxe Room').trim(),
        roomsCount: rooms,
        sharingType: h.sharingType || body.sharingType || 'Double Sharing',
        b2bCostPerNight: h.b2bCostPerNight ? Number(h.b2bCostPerNight) : (nights > 0 ? Math.round(b2bCost / nights) : b2bCost),
        b2bTotalCost: b2bCost,
        clientQuotationCost: Number(h.clientQuotationCost || 0),
        status: h.status || 'requested',
        confirmationNumber: h.confirmationNumber || '',
        notes: h.notes || '',
        isManualCost: Boolean(h.isManualCost),
        stayDates: h.stayDates || undefined,
      };
    });

    // Construct Transport item
    const transportDays = Number(body.noOfDays || body.transport?.totalDays || 1);
    let transportCost = Number(body.transport?.b2bTotalCost || body.transportCost || 0);
    const vehicleType = String(body.vehicleType || body.transport?.vehicleType || 'Dedicated Private Cab').trim();

    // If transport cost is 0 or not provided, calculate standard default rate
    if (transportCost === 0) {
      const vClean = vehicleType.toLowerCase().replace(/[^a-z0-9]/g, '');
      let ratePerDay = 4000;
      if (vClean.includes('tempo') || vClean.includes('traveller')) ratePerDay = 7500;
      else if (vClean.includes('innova') || vClean.includes('crysta')) ratePerDay = 5500;
      else if (vClean.includes('ertiga') || vClean.includes('rumion') || vClean.includes('rumoin')) ratePerDay = 4500;
      else if (vClean.includes('seden') || vClean.includes('sedan') || vClean.includes('dzire') || vClean.includes('etios')) ratePerDay = 4000;
      transportCost = ratePerDay * transportDays;
    }

    const transport = {
      vehicleType,
      vehicleId: body.transport?.vehicleId || undefined,
      vendorName: String(body.transport?.vendorName || '').trim(),
      vendorId: body.transport?.vendorId || undefined,
      totalDays: transportDays,
      costPerDay: body.transport?.costPerDay ? Number(body.transport.costPerDay) : (transportDays > 0 ? Math.round(transportCost / transportDays) : transportCost),
      b2bTotalCost: transportCost,
      status: body.transport?.status || 'assigned',
      driverName: body.transport?.driverName || '',
      driverMobile: body.transport?.driverMobile || '',
      vehicleNumber: body.transport?.vehicleNumber || '',
      notes: body.transport?.notes || '',
      isManualCost: Boolean(body.transport?.isManualCost),
    };

    // Resolve Zoho Lead ID if not explicitly provided
    let zohoLeadId: string | null = (body.zohoLeadId && /^\d+$/.test(String(body.zohoLeadId).trim()))
      ? String(body.zohoLeadId).trim()
      : null;

    if (!zohoLeadId) {
      try {
        zohoLeadId = await findZohoLeadId({
          inquiryId,
          email: customerEmail,
          mobile: customerMobile,
        });
        if (zohoLeadId) {
          console.log(`[Operations Handover] Resolved Zoho Lead ID: ${zohoLeadId} for Inquiry: ${inquiryId}`);
        }
      } catch (findErr) {
        console.warn('[Zoho Lead Lookup Warning on Handover]:', findErr);
      }
    }

    const newBooking: OperationsBooking = {
      id: uniqueId,
      bookingId: body.bookingId || body.dealId || undefined,
      inquiryId: inquiryId || uniqueId,
      zohoLeadId: zohoLeadId || undefined,
      zohoOperationsId: body.zohoOperationsId || undefined,
      zohoFinanceId: body.zohoFinanceId || undefined,
      customerName,
      customerMobile: customerMobile || undefined,
      customerEmail: customerEmail || undefined,
      destination,
      travelStartDate: body.travelStartDate || body.startDate || '',
      travelEndDate: body.travelEndDate || body.endDate || '',
      duration: body.duration || `${body.noOfNights || 4} Nights / ${body.noOfDays || 5} Days`,
      noOfDays: Number(body.noOfDays || 5),
      noOfNights: Number(body.noOfNights || 4),
      adults: Number(body.adults || 2),
      kids: Number(body.kids || 0),
      numberOfGuests: Number(body.adults || 2) + Number(body.kids || 0),
      roomsCount: Number(body.roomsCount || 1),
      sharingType: body.sharingType || 'Double Sharing',
      selectedOptionNumber: selectedOptNum,
      selectedOptionTitle: body.selectedOptionTitle || `Option ${selectedOptNum}`,
      itineraryUrl: body.itineraryUrl || '',
      itineraryDocId: body.itineraryDocId || undefined,

      // Financials
      totalQuotationAmount: totalQuotation,
      advanceAmountPaid: advancePaid,
      balancePendingAmount: balanceDue,
      paymentMode: (paymentMode as any),
      utrNumber,
      paymentDate,
      paymentProofUrl: body.paymentProofUrl || '',

      // Handover Info
      salesRepName: body.salesRepName || 'Sales Team',
      salesNotes: body.salesNotes || '',
      handedOverAt: new Date().toISOString(),

      // Ops State
      opsStatus: 'pending_ops',
      hotels,
      transport,
      dayActivities: body.dayActivities || [],
      specialRequirements: body.specialRequirements || body.salesNotes || '',

      totalB2BHotelCost: hotels.reduce((sum: number, h: any) => sum + (h.b2bTotalCost || 0), 0),
      totalB2BTransportCost: transport.b2bTotalCost || 0,
      totalB2BCost: hotels.reduce((sum: number, h: any) => sum + (h.b2bTotalCost || 0), 0) + (transport.b2bTotalCost || 0),
      grossMarginAmount: Math.max(0, totalQuotation - (hotels.reduce((sum: number, h: any) => sum + (h.b2bTotalCost || 0), 0) + (transport.b2bTotalCost || 0))),
      grossMarginPercentage: totalQuotation > 0
        ? Math.round(((totalQuotation - (hotels.reduce((sum: number, h: any) => sum + (h.b2bTotalCost || 0), 0) + (transport.b2bTotalCost || 0))) / totalQuotation) * 100)
        : 0,

      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    // 1. Save initially in Operations DB / local mirror
    const saved = await saveOperationsBooking(newBooking);

    // 2. Generate Official Tax Invoice PDF Buffer for Bank Transfer
    const invoiceNumber = `INV-${inquiryId ? inquiryId.replace(/[^a-zA-Z0-9]/g, '') : Date.now()}`;
    const safeInvoiceNum = invoiceNumber.replace(/[^a-zA-Z0-9_-]/g, '_');
    const invoiceFileName = `Wanderphilia_Invoice_${safeInvoiceNum}.pdf`;

    let pdfBuffer: Buffer | null = null;
    try {
      const isIntl = isInternationalTrip(destination);
      const gstPercentage = 5;
      const tcsPercentage = isIntl ? 2 : 0;
      const taxMultiplier = 1 + (gstPercentage + tcsPercentage) / 100;
      const baseAmount = Math.round(totalQuotation / taxMultiplier);
      const gstAmount = Math.round(baseAmount * (gstPercentage / 100));
      const tcsAmount = isIntl ? Math.round(baseAmount * (tcsPercentage / 100)) : 0;

      const invoiceData: InvoiceData = {
        invoiceNumber,
        invoiceDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        paymentId: utrNumber || `BANK-${Date.now()}`,
        orderId: `BANK-TRANSFER-${inquiryId || Date.now()}`,
        itineraryId: inquiryId || 'Custom Itinerary',
        inquiryId: inquiryId || undefined,
        leadId: zohoLeadId || undefined,
        customerName,
        customerEmail,
        customerMobile,
        customerGstNo: body.customerGstNo,
        customerPanNo: body.customerPanNo,
        destination,
        tripTitle: `${destination} Luxury Holiday`,
        travelStartDate: body.travelStartDate || body.startDate,
        travelEndDate: body.travelEndDate || body.endDate,
        noOfDays: Number(body.noOfDays || 5),
        noOfNights: Number(body.noOfNights || 4),
        numberOfGuests: Number(body.adults || 2) + Number(body.kids || 0),
        adults: Number(body.adults || 2),
        kids: Number(body.kids || 0),
        vehicleType: transport.vehicleType,
        roomCategory: hotels[0]?.roomCategory || 'Deluxe Room',
        paymentType: balanceDue <= 0 ? 'full' : 'advance',
        totalPackageAmount: totalQuotation,
        paidAmount: advancePaid,
        balanceDue: balanceDue,
        baseAmount,
        gstPercentage,
        gstAmount,
        tcsPercentage,
        tcsAmount,
      };

      pdfBuffer = await generateInvoicePDFBuffer(invoiceData);
    } catch (invoiceErr) {
      console.warn('[Invoice PDF Generation Warning on Handover]:', invoiceErr);
    }

    // 3. Zoho CRM Lead updates: Status -> 'Booking' / 'Confirmed', Note & Invoice Attachment
    if (zohoLeadId && /^\d+$/.test(zohoLeadId)) {
      // A. Upload PDF Attachment to Lead
      if (pdfBuffer) {
        try {
          await uploadZohoLeadAttachment(zohoLeadId, pdfBuffer, invoiceFileName);
          console.log(`[Zoho CRM Handover] Uploaded invoice ${invoiceFileName} to Lead ${zohoLeadId}`);
        } catch (attachErr) {
          console.warn('[Zoho CRM Handover Attachment Warning]:', attachErr);
        }
      }

      // B. Update Lead Status & Amounts in Zoho CRM
      try {
        await updateZohoLeadPaymentStatus(zohoLeadId, {
          leadStatus: balanceDue <= 0 ? 'Confirmed' : 'Booking',
          advanceAmountPaid: advancePaid,
          balancePendingAmount: balanceDue,
        });
        console.log(`[Zoho CRM Handover] Lead ${zohoLeadId} status set to ${balanceDue <= 0 ? 'Confirmed' : 'Booking'}`);
      } catch (updateErr) {
        console.warn('[Zoho CRM Lead Update Warning]:', updateErr);
      }

      // C. Add Detailed Handover Note to Lead Record
      try {
        const formattedDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
        const noteTitle = `Bank Transfer Handover (₹${advancePaid.toLocaleString('en-IN')}) - Option ${selectedOptNum}`;
        const noteContent =
          `Sales Handover to Operations completed successfully with Bank Transfer.\n\n` +
          `• Client Name: ${customerName}\n` +
          `• Mobile: ${customerMobile || 'N/A'}\n` +
          `• Email: ${customerEmail || 'N/A'}\n` +
          `• Destination: ${destination}\n` +
          `• Selected Option: ${body.selectedOptionTitle || `Option ${selectedOptNum}`}\n` +
          `• Travel Dates: ${body.travelStartDate} to ${body.travelEndDate}\n` +
          `• Duration: ${saved.duration}\n` +
          `• Guests: ${saved.numberOfGuests} (${saved.adults} Adults, ${saved.kids} Kids)\n` +
          `• Payment Mode: ${paymentMode} (Bank Transfer)\n` +
          `• UTR / Bank Reference No: ${utrNumber || 'N/A'}\n` +
          `• Payment Date: ${paymentDate}\n` +
          `• Advance Amount Paid: ₹${advancePaid.toLocaleString('en-IN')}\n` +
          `• Total Package Cost: ₹${totalQuotation.toLocaleString('en-IN')}\n` +
          `• Remaining Balance: ₹${balanceDue.toLocaleString('en-IN')}\n` +
          `• Handed Over By: ${saved.salesRepName}\n` +
          (saved.salesNotes ? `• Sales Notes: ${saved.salesNotes}\n` : '') +
          (saved.itineraryUrl ? `• Itinerary Link: ${saved.itineraryUrl}\n` : '') +
          `• Handover Timestamp: ${formattedDate}\n\n` +
          (pdfBuffer ? `Official Tax Invoice "${invoiceFileName}" generated and uploaded.` : '');

        await addZohoLeadNote(zohoLeadId, noteTitle, noteContent);
      } catch (noteErr) {
        console.warn('[Zoho CRM Handover Note Warning]:', noteErr);
      }
    }

    // 4. Synchronize Booking & Task: Converts Zoho Lead to Deal/Booking, creates Ops entry & 48h Task (Finance is pushed later when Operations confirms)
    let zohoSyncResult: any = null;
    try {
      zohoSyncResult = await syncBookingAndTaskOnPayment({
        skipFinanceSync: true,
        itineraryId: saved.inquiryId,
        itineraryUrl: saved.itineraryUrl,
        paymentId: saved.utrNumber || `BANK-${Date.now()}`,
        orderId: `BANK-TRANSFER-${saved.inquiryId}`,
        paymentType: saved.balancePendingAmount <= 0 ? 'full' : 'advance',
        paidAmount: saved.advanceAmountPaid,
        newTotalPaid: saved.advanceAmountPaid,
        newBalanceDue: saved.balancePendingAmount,
        totalQuotationAmount: saved.totalQuotationAmount,
        invoiceNumber,
        zohoLeadId: zohoLeadId || undefined,
        customerName: saved.customerName,
        customerEmail: saved.customerEmail,
        customerMobile: saved.customerMobile,
        destination: saved.destination,
        travelStartDate: saved.travelStartDate,
        travelEndDate: saved.travelEndDate,
        duration: saved.duration,
        noOfDays: saved.noOfDays,
        noOfNights: saved.noOfNights,
        numberOfGuests: saved.numberOfGuests,
        adults: saved.adults,
        kids: saved.kids,
        kidsDetails: Array.isArray(body.kidsDetails) ? body.kidsDetails : [],
        roomsCount: saved.roomsCount,
        sharingType: saved.sharingType,
        vehicleType: saved.transport.vehicleType,
        transportCost: saved.transport.b2bTotalCost || (saved as any).transportCost || body.transportCost || 0,
        preferredRoomCategory: hotels[0]?.roomCategory || 'Deluxe Room',
        hotelCategory: hotels[0]?.roomCategory || 'Deluxe',
        mealPlan: body.mealPlan || 'Breakfast & Dinner',
        specialRequirements: saved.specialRequirements || saved.salesNotes || '',
        hotels: saved.hotels.map(h => ({
          hotelName: h.hotelName,
          city: h.city,
          nights: h.nights,
          roomCategory: h.roomCategory,
          category: h.roomCategory,
          stayDates: (h as any).stayDates || undefined,
          hotelId: (h as any).hotelId || (h as any).id || undefined,
          b2bCostPerNight: h.b2bCostPerNight || (h as any).basePrice || 0,
          b2bTotalCost: h.b2bTotalCost || ((h.b2bCostPerNight || (h as any).basePrice || 0) * (h.nights || 1) * (saved.roomsCount || 1)),
        })),
        dayActivities: saved.dayActivities || [],
      });

      console.log('[Zoho Booking Handover Sync Result]:', zohoSyncResult);

      if (zohoSyncResult && zohoSyncResult.dealId) {
        saved.bookingId = String(zohoSyncResult.dealId);
        saved.zohoOperationsId = zohoSyncResult.operationsId || saved.zohoOperationsId;
        saved.zohoFinanceId = zohoSyncResult.financeId || saved.zohoFinanceId;
        await saveOperationsBooking(saved);
      }
    } catch (zohoErr) {
      console.warn('[Zoho Booking Handover Async Sync Warning]:', zohoErr);
    }

    // 5. Update MongoDB Itinerary Record (status, payment, rawZohoData)
    try {
      const db = await getDb();
      const itinerariesColl = db.collection('itineraries');
      const cleanInquiryId = saved.inquiryId;

      const paymentRecord = {
        paymentId: saved.utrNumber || `BANK-${Date.now()}`,
        orderId: `BANK-TRANSFER-${saved.inquiryId}`,
        paymentType: saved.balancePendingAmount <= 0 ? 'full' : 'advance',
        amount: saved.advanceAmountPaid,
        totalPaidAfter: saved.advanceAmountPaid,
        balanceDueAfter: saved.balancePendingAmount,
        paidAt: new Date().toISOString(),
        paymentMode: saved.paymentMode,
        utrNumber: saved.utrNumber,
        invoiceNumber,
        status: 'paid',
        customerName: saved.customerName,
        customerEmail: saved.customerEmail,
        customerMobile: saved.customerMobile,
      };

      const updatePayload: Record<string, any> = {
        status: 'active',
        advanceAmountPaid: saved.advanceAmountPaid,
        balancePendingAmount: saved.balancePendingAmount,
        paymentStage: saved.balancePendingAmount <= 0 ? 'full' : 'advance',
        zohoDealId: zohoSyncResult?.dealId || undefined,
        zohoTaskId: zohoSyncResult?.taskId || undefined,
        zohoOperationsId: zohoSyncResult?.operationsId || undefined,
        updatedAt: new Date(),
        'rawZohoData.Lead_Status': saved.balancePendingAmount <= 0 ? 'Confirmed' : 'Booking',
        'rawZohoData.Advance_Amount_Paid': saved.advanceAmountPaid,
        'rawZohoData.Balance_Pending_Amount': saved.balancePendingAmount,
        'rawZohoData.Payment_Status': saved.balancePendingAmount <= 0 ? 'Fully Paid' : 'Partially Paid',
        'rawZohoData.Payment_Mode': saved.paymentMode,
        'rawZohoData.Last_Payment_Id': saved.utrNumber,
        'rawZohoData.Payment_Date': saved.paymentDate,
        'rawZohoData.Zoho_Deal_Id': zohoSyncResult?.dealId || undefined,
        'rawZohoData.Zoho_Task_Id': zohoSyncResult?.taskId || undefined,
        'rawZohoData.Zoho_Operations_Id': zohoSyncResult?.operationsId || undefined,
      };

      await itinerariesColl.updateOne(
        {
          $or: [
            { inquiryId: cleanInquiryId },
            { id: cleanInquiryId },
            ...(saved.itineraryDocId ? [{ _id: saved.itineraryDocId }] : []),
            ...(saved.itineraryUrl ? [{ url: saved.itineraryUrl }, { slug: saved.itineraryUrl.split('/').pop() }] : []),
          ],
        } as any,
        {
          $set: updatePayload,
          $push: { payments: paymentRecord as any },
        }
      );
      console.log(`[MongoDB Handover Sync] Itinerary updated successfully for ${cleanInquiryId}`);
    } catch (mongoUpdateErr) {
      console.warn('[MongoDB Itinerary Update Warning on Handover]:', mongoUpdateErr);
    }

    // 6. Send Customer & Admin Confirmation Emails (if email present)
    if (customerEmail && pdfBuffer) {
      try {
        const formattedDate = new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });

        const customerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 20px; color: #1e293b; margin: 0; }
    .card { max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    .header { background: linear-gradient(135deg, #6E1E14 0%, #8A261A 100%); color: #ffffff; padding: 32px 24px; text-align: center; }
    .content { padding: 32px 24px; }
    .badge { display: inline-block; background: #22c55e; color: #ffffff; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; margin-bottom: 10px; }
    .section-title { font-size: 13px; font-weight: 800; text-transform: uppercase; color: #6E1E14; letter-spacing: 0.5px; margin: 20px 0 8px 0; border-bottom: 1.5px solid #fee2e2; padding-bottom: 6px; }
    .table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    .table td { padding: 10px 12px; font-size: 14px; border-bottom: 1px solid #f1f5f9; }
    .table td.label { font-weight: 600; color: #64748b; width: 40%; }
    .table td.value { font-weight: 700; color: #0f172a; text-align: right; }
    .cta-btn { display: block; width: 100%; box-sizing: border-box; background: #6E1E14; color: #ffffff; text-align: center; padding: 14px 20px; border-radius: 10px; font-weight: 700; text-decoration: none; margin-top: 24px; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="badge">Booking Confirmed & Handed Over</div>
      <h1 style="margin: 0; font-size: 24px; font-weight: 800;">Wanderphilia Holidays</h1>
      <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">Your luxury tour booking is confirmed!</p>
    </div>
    <div class="content">
      <p style="font-size: 15px; line-height: 1.6; margin-top: 0;">
        Dear <strong>${customerName}</strong>,<br><br>
        Thank you for choosing <strong>Wanderphilia</strong>. We have received your payment of <strong>₹${advancePaid.toLocaleString('en-IN')}</strong> via Bank Transfer (UTR: ${utrNumber || 'N/A'}). Your booking has been officially handed over to our Operations team to lock in your hotels and transport.
      </p>

      <div class="section-title">Booking Details</div>
      <table class="table">
        <tr>
          <td class="label">Destination</td>
          <td class="value">${destination}</td>
        </tr>
        <tr>
          <td class="label">Travel Dates</td>
          <td class="value">${saved.travelStartDate} to ${saved.travelEndDate}</td>
        </tr>
        <tr>
          <td class="label">Duration</td>
          <td class="value">${saved.duration}</td>
        </tr>
        <tr>
          <td class="label">Guests</td>
          <td class="value">${saved.numberOfGuests} (${saved.adults} Adults, ${saved.kids} Kids)</td>
        </tr>
        <tr>
          <td class="label">Vehicle</td>
          <td class="value">${saved.transport.vehicleType}</td>
        </tr>
      </table>

      <div class="section-title">Payment Summary</div>
      <table class="table">
        <tr>
          <td class="label">Total Package Price</td>
          <td class="value">₹${totalQuotation.toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td class="label">Advance Paid</td>
          <td class="value" style="color: #16a34a;">₹${advancePaid.toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td class="label">Balance Due</td>
          <td class="value" style="color: ${balanceDue > 0 ? '#b45309' : '#16a34a'};">₹${balanceDue.toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td class="label">Invoice Number</td>
          <td class="value">${invoiceNumber}</td>
        </tr>
        <tr>
          <td class="label">UTR / Reference No</td>
          <td class="value">${utrNumber || 'N/A'}</td>
        </tr>
      </table>

      ${saved.itineraryUrl ? `<a href="${saved.itineraryUrl}" class="cta-btn" style="color:#ffffff;">View Your Live Interactive Itinerary</a>` : ''}
    </div>
    <div class="footer">
      <p style="margin: 0;">Your official tax invoice PDF has been attached to this email.</p>
      <p style="margin: 4px 0 0 0;">Wanderphilia Holidays | India's Most Trusted Luxury Travel Community</p>
    </div>
  </div>
</body>
</html>
        `;

        await sendEmail({
          to: customerEmail,
          subject: `Booking Confirmed: ${destination} Tour | Invoice #${invoiceNumber} - Wanderphilia`,
          html: customerEmailHtml,
          attachments: [
            {
              filename: invoiceFileName,
              content: pdfBuffer,
            },
          ],
        });
        console.log(`[Confirmation Email Success] Sent booking confirmation and invoice to ${customerEmail}`);
      } catch (emailErr) {
        console.warn('[Confirmation Email Warning on Handover]:', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Booking successfully confirmed and handed over to Operations. Zoho Lead updated/converted.',
      booking: saved,
      zohoDealId: saved.bookingId,
      zohoOperationsId: saved.zohoOperationsId,
      leadConverted: Boolean(zohoSyncResult?.leadConverted),
    });
  } catch (error) {
    console.error('[Operations Booking POST Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create operations booking.' },
      { status: 500 }
    );
  }
}
