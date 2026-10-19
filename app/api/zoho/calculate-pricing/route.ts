import { NextRequest, NextResponse } from 'next/server';
import {
  calculateLeadPricingAndItinerary1,
  calculateLeadPricingOffline,
  OfflinePricingInput
} from '@/lib/zoho-pricing';
import { fetchZohoLeadById } from '@/lib/zoho-fetch';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get('id') || searchParams.get('leadId') || searchParams.get('query') || '';
    const updateZoho = searchParams.get('updateZoho') === 'true';

    if (!leadId) {
      return NextResponse.json(
        { success: false, error: 'Please provide a leadId or query parameter.' },
        { status: 400 }
      );
    }

    const lead = await fetchZohoLeadById(leadId);
    if (!lead) {
      return NextResponse.json(
        { success: false, error: `Lead ${leadId} not found.` },
        { status: 404 }
      );
    }

    const pricing = await calculateLeadPricingAndItinerary1(lead.rawLeadData, undefined, { updateZoho });

    return NextResponse.json({
      success: true,
      leadId: lead.leadId,
      inquiryId: lead.inquiryId,
      pricing,
      calculatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Calculate Pricing API Error (GET)]:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal error calculating pricing' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Mode 1: Calculate for an existing Zoho Lead by ID
    if (body.leadId || body.rawLeadData) {
      const leadData = body.rawLeadData || (await fetchZohoLeadById(body.leadId))?.rawLeadData;
      if (!leadData) {
        return NextResponse.json(
          { success: false, error: 'Lead not found or invalid leadId provided.' },
          { status: 404 }
        );
      }
      const pricing = await calculateLeadPricingAndItinerary1(leadData, undefined, {
        updateZoho: Boolean(body.updateZoho)
      });
      return NextResponse.json({
        success: true,
        pricing,
        calculatedAt: new Date().toISOString()
      });
    }

    // Mode 2: Calculate from provided client/subform state (Offline Deluge Formula)
    const offlineInput: OfflinePricingInput = {
      adults: Number(body.adults) || 1,
      kids: Number(body.kids) || 0,
      noOfDays: Number(body.noOfDays) || 1,
      sharingType: body.sharingType || 'Double Sharing',
      globalTargetCat: body.globalTargetCat || body.hotelCategory || 'Deluxe',
      kidsDetails: Array.isArray(body.kidsDetails) ? body.kidsDetails : [],
      hotels: Array.isArray(body.hotels) ? body.hotels : [],
      vehicle: body.vehicle || { dailyCost: Number(body.vehicleDailyCost) || 4500, name: body.vehicleType },
      dayRows: Array.isArray(body.dayRows) ? body.dayRows : []
    };

    const pricing = calculateLeadPricingOffline(offlineInput);

    return NextResponse.json({
      success: true,
      pricing,
      calculatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Calculate Pricing API Error (POST)]:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal error calculating pricing' },
      { status: 500 }
    );
  }
}
