import { NextRequest, NextResponse } from 'next/server';
import {
  getAllOperationsBookings,
  saveOperationsBooking,
  getOperationsStats
} from '@/lib/operations-db';
import { isAuthorizedOperationsRequest } from '@/lib/operations-auth';
import { OperationsBooking } from '@/types/operations';
import { syncBookingAndTaskOnPayment } from '@/lib/zoho-booking-automation';

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
      };
    });

    // Construct Transport item
    const transportDays = Number(body.noOfDays || body.transport?.totalDays || 1);
    const transportCost = Number(body.transport?.b2bTotalCost || body.transportCost || 0);
    const transport = {
      vehicleType: String(body.vehicleType || body.transport?.vehicleType || 'Dedicated Private Cab').trim(),
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

    const newBooking: OperationsBooking = {
      id: uniqueId,
      bookingId: body.bookingId || body.dealId || undefined,
      inquiryId: inquiryId || uniqueId,
      zohoLeadId: body.zohoLeadId || undefined,
      zohoOperationsId: body.zohoOperationsId || undefined,
      zohoFinanceId: body.zohoFinanceId || undefined,
      customerName,
      customerMobile: body.customerMobile || body.phone || undefined,
      customerEmail: body.customerEmail || body.email || undefined,
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
      paymentMode: body.paymentMode || 'bank_transfer',
      utrNumber: body.utrNumber || body.transactionId || '',
      paymentDate: body.paymentDate || new Date().toISOString().split('T')[0],
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
      specialRequirements: body.specialRequirements || '',

      totalB2BHotelCost: 0,
      totalB2BTransportCost: 0,
      totalB2BCost: 0,
      grossMarginAmount: 0,
      grossMarginPercentage: 0,

      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    // Save locally and in MongoDB
    const saved = await saveOperationsBooking(newBooking);

    // Asynchronous background attempt to sync with Zoho CRM Deals / Operations Task
    let zohoSyncResult: any = null;
    try {
      zohoSyncResult = await syncBookingAndTaskOnPayment({
        itineraryId: saved.inquiryId,
        itineraryUrl: saved.itineraryUrl,
        paymentId: saved.utrNumber || `BANK-${Date.now()}`,
        orderId: `ORD-${saved.inquiryId}`,
        paymentType: saved.paymentMode,
        paidAmount: saved.advanceAmountPaid,
        newTotalPaid: saved.advanceAmountPaid,
        newBalanceDue: saved.balancePendingAmount,
        totalQuotationAmount: saved.totalQuotationAmount,
        invoiceNumber: `INV-${saved.inquiryId}`,
        zohoLeadId: saved.zohoLeadId,
        customerName: saved.customerName,
        customerEmail: saved.customerEmail,
        customerMobile: saved.customerMobile,
        destination: saved.destination,
        travelStartDate: saved.travelStartDate,
        travelEndDate: saved.travelEndDate,
        duration: saved.duration,
        numberOfGuests: saved.numberOfGuests,
        adults: saved.adults,
        kids: saved.kids,
        roomsCount: saved.roomsCount,
        sharingType: saved.sharingType,
        vehicleType: saved.transport.vehicleType,
        noOfDays: saved.noOfDays,
        noOfNights: saved.noOfNights,
        hotels: saved.hotels.map(h => ({
          hotelName: h.hotelName,
          city: h.city,
          nights: h.nights,
          roomCategory: h.roomCategory,
        })),
      });

      if (zohoSyncResult && zohoSyncResult.dealId) {
        saved.bookingId = zohoSyncResult.dealId;
        saved.zohoOperationsId = zohoSyncResult.operationsId || saved.zohoOperationsId;
        saved.zohoFinanceId = zohoSyncResult.financeId || saved.zohoFinanceId;
        await saveOperationsBooking(saved);
      }
    } catch (zohoErr) {
      console.warn('[Zoho Booking Handover Async Sync Warning]:', zohoErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Booking successfully confirmed and handed over to Operations.',
      booking: saved,
      zohoDealId: saved.bookingId,
      zohoOperationsId: saved.zohoOperationsId,
    });
  } catch (error) {
    console.error('[Operations Booking POST Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create operations booking.' },
      { status: 500 }
    );
  }
}
