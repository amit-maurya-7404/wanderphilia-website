import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ItineraryDocument } from '@/types/itinerary';
import { getAllOperationsBookings } from '@/lib/operations-db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const inquiryId = (searchParams.get('inquiryId') || searchParams.get('query') || '').trim();
    const leadId = (searchParams.get('leadId') || '').trim();
    const mobile = (searchParams.get('mobile') || searchParams.get('phone') || '').trim();

    if (!inquiryId && !leadId) {
      return NextResponse.json(
        { success: false, error: 'Please provide inquiryId or leadId query parameter.' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection<ItineraryDocument>('itineraries');

    const orConditions: any[] = [];

    if (inquiryId && inquiryId.trim().length >= 2) {
      const cleanInq = inquiryId.trim();
      orConditions.push(
        { inquiryId: cleanInq },
        { 'rawZohoData.Inquiry_ID': cleanInq },
        { 'rawZohoData.inquiryId': cleanInq },
        { 'leadDetails.inquiryId': cleanInq },
        { inquiryId: { $regex: `^${cleanInq}$`, $options: 'i' } },
        { 'rawZohoData.Inquiry_ID': { $regex: `^${cleanInq}$`, $options: 'i' } }
      );
    }

    if (leadId && leadId.trim().length >= 10) {
      const cleanLeadId = leadId.trim();
      orConditions.push(
        { zohoLeadId: cleanLeadId },
        { 'rawZohoData.id': cleanLeadId },
        { 'rawZohoData.Lead_ID': cleanLeadId }
      );
    }

    if (orConditions.length === 0) {
      return NextResponse.json({
        success: true,
        foundCount: 0,
        existingOptions: {},
        hasOptions: false
      });
    }

    const docs = await collection.find({ $or: orConditions }).sort({ updatedAt: -1, createdAt: -1 }).toArray();

    const existingOptions: Record<number, any> = {};

    for (const doc of docs) {
      let optNum = doc.optionNumber;
      if (!optNum) {
        const slugOrId = doc.slug || doc.id || '';
        const match = slugOrId.match(/-([1-8])-[a-z0-9]+$/i) || slugOrId.match(/-([1-8])-/);
        if (match) {
          optNum = parseInt(match[1], 10);
        } else {
          optNum = 1;
        }
      }
      optNum = Number(optNum) || 1;

      // Keep the most recently updated document for this option
      if (!existingOptions[optNum]) {
        const targetId = doc.slug || doc.id;
        const createdDate = doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString();
        const updatedDate = doc.updatedAt ? new Date(doc.updatedAt).toISOString() : createdDate;
        const dAny = doc as any;

        existingOptions[optNum] = {
          id: targetId,
          slug: targetId,
          url: `/itinerary/${targetId}`,
          optionNumber: optNum,
          title: doc.title || `Option ${optNum} - ${doc.destination || 'Luxury'} Itinerary`,
          destination: doc.destination || 'Rajasthan',
          destinationType: doc.destinationType || dAny.rawZohoData?.Destination_Type || 'India',
          quote: doc.finalQuotationAmount ?? dAny.rawZohoData?.Final_Quotation_Amount ?? null,
          finalQuotationAmount: doc.finalQuotationAmount ?? dAny.rawZohoData?.Final_Quotation_Amount ?? null,
          baseQuotationAmount: doc.baseQuotationAmount ?? dAny.leadDetails?.baseQuotationAmount ?? null,
          marginPercentage: doc.marginPercentage ?? dAny.leadDetails?.marginPercentage ?? 10,
          perAdultPrice: doc.perAdultPrice ?? dAny.leadDetails?.perAdultPrice ?? null,
          perKidPrice: doc.perKidPrice ?? dAny.leadDetails?.perKidPrice ?? null,
          advancePaid: doc.advanceAmountPaid ?? dAny.rawZohoData?.Advance_Amount_Paid ?? null,
          balanceDue: doc.balancePendingAmount ?? dAny.rawZohoData?.Balance_Pending_Amount ?? null,
          hotels: dAny.hotels || [],
          dayActivities: dAny.dayActivities || dAny.dayRows || dAny.dayPlans || [],
          dayPlans: dAny.dayPlans || [],
          manualDayPlans: dAny.manualDayPlans || [],
          isManualItinerary: Boolean(dAny.isManualItinerary),
          creationMode: dAny.creationMode || (dAny.isManualItinerary ? 'manual' : 'sheet'),
          vehicleType: dAny.vehicleType || dAny.vehicle || dAny.rawZohoData?.Vehicle_Type || 'Dedicated Private Cab',
          mealPlan: doc.mealPlan || dAny.stay?.mealPlan || 'Breakfast & Dinner',
          noOfDays: doc.noOfDays || dAny.dayPlans?.length || 5,
          noOfNights: doc.noOfNights || 4,
          adults: doc.adults ?? dAny.leadDetails?.adults ?? 2,
          kids: doc.kids ?? dAny.leadDetails?.kids ?? 0,
          kidsDetails: dAny.kidsDetails || dAny.childrenDetails || [],
          roomsCount: dAny.roomsCount || dAny.leadDetails?.roomsCount || 1,
          sharingType: dAny.sharingType || dAny.leadDetails?.sharingType || 'Double Sharing',
          travelStyle: doc.travelStyle || 'Family Trip',
          startDate: dAny.leadDetails?.startDate || doc.startDate || '',
          endDate: dAny.leadDetails?.endDate || doc.endDate || '',
          departureCity: dAny.departureCity || dAny.leadDetails?.departureCity || '',
          inclusions: doc.inclusions || [],
          exclusions: doc.exclusions || [],
          flightQuotations: doc.flightQuotations || [],
          hotelCostDetails: doc.hotelCostDetails || null,
          specialRequirements: (doc as any).specialRequirements || '',
          createdAt: createdDate,
          updatedAt: updatedDate
        };
      }
    }

    // Check if this inquiry or lead has already been handed over to Operations
    let isHandedOver = false;
    let handedOverDetails: any = null;

    try {
      const opsBookings = await getAllOperationsBookings();
      const matchedBooking = opsBookings.find(b => {
        const bInq = (b.inquiryId || '').toLowerCase().trim();
        const bLead = (b.zohoLeadId || '').trim();
        const cInq = inquiryId.toLowerCase().trim();
        const cLead = leadId.trim();
        return (cInq && (bInq === cInq || bInq.includes(cInq) || cInq.includes(bInq))) ||
               (cLead && bLead && bLead === cLead);
      });

      if (matchedBooking) {
        isHandedOver = true;
        handedOverDetails = {
          bookingId: matchedBooking.bookingId || matchedBooking.id,
          optionNumber: matchedBooking.selectedOptionNumber || 1,
          optionTitle: matchedBooking.selectedOptionTitle || `Option ${matchedBooking.selectedOptionNumber || 1}`,
          advanceAmountPaid: matchedBooking.advanceAmountPaid || 0,
          totalQuotationAmount: matchedBooking.totalQuotationAmount || 0,
          balancePendingAmount: matchedBooking.balancePendingAmount || 0,
          utrNumber: matchedBooking.utrNumber || '',
          paymentDate: matchedBooking.paymentDate || '',
          handedOverAt: matchedBooking.handedOverAt || matchedBooking.createdAt,
          salesRepName: matchedBooking.salesRepName || '',
          zohoDealId: matchedBooking.bookingId,
          zohoOperationsId: matchedBooking.zohoOperationsId,
        };
      } else {
        const bookedDoc = docs.find(d => {
          const dAny = d as any;
          return Boolean(
            dAny.zohoOperationsId ||
            dAny.zohoDealId ||
            (Array.isArray(dAny.payments) && dAny.payments.length > 0) ||
            (dAny.rawZohoData?.Lead_Status === 'Booking' || dAny.rawZohoData?.Lead_Status === 'Confirmed')
          );
        });

        if (bookedDoc) {
          const bAny = bookedDoc as any;
          isHandedOver = true;
          handedOverDetails = {
            bookingId: bAny.zohoDealId || bAny.id,
            optionNumber: bookedDoc.optionNumber || 1,
            optionTitle: bookedDoc.title || `Option ${bookedDoc.optionNumber || 1}`,
            advanceAmountPaid: bookedDoc.advanceAmountPaid || 0,
            totalQuotationAmount: bookedDoc.finalQuotationAmount || 0,
            balancePendingAmount: bookedDoc.balancePendingAmount || 0,
            utrNumber: bAny.rawZohoData?.Last_Payment_Id || bAny.payments?.[0]?.paymentId || '',
            paymentDate: bAny.rawZohoData?.Payment_Date || bAny.payments?.[0]?.paidAt || '',
            handedOverAt: bookedDoc.updatedAt || bookedDoc.createdAt,
            zohoDealId: bAny.zohoDealId,
            zohoOperationsId: bAny.zohoOperationsId,
          };
        }
      }
    } catch (opsErr) {
      console.warn('[Check Options Ops Lookup Warning]:', opsErr);
    }

    // Attach handed over status to specific options
    if (isHandedOver && handedOverDetails?.optionNumber) {
      const bookedOptNum = Number(handedOverDetails.optionNumber);
      if (existingOptions[bookedOptNum]) {
        existingOptions[bookedOptNum].isHandedOver = true;
      }
    }

    return NextResponse.json({
      success: true,
      foundCount: docs.length,
      existingOptions,
      hasOptions: Object.keys(existingOptions).length > 0,
      isHandedOver,
      handedOverDetails,
    });
  } catch (error: any) {
    console.error('[Check Itinerary Options Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal error checking existing itinerary options.' },
      { status: 500 }
    );
  }
}
