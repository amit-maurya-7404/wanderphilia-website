import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ItineraryDocument } from '@/types/itinerary';

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

    const existingOptions: Record<number, {
      id: string;
      slug: string;
      url: string;
      optionNumber: number;
      title: string;
      destination: string;
      quote: number | null;
      advancePaid: number | null;
      balanceDue: number | null;
      createdAt: string;
      updatedAt: string;
    }> = {};

    for (const doc of docs) {
      let optNum = doc.optionNumber;
      if (!optNum) {
        if (doc.slug?.includes('-2-') || doc.id?.includes('-2-')) optNum = 2;
        else if (doc.slug?.includes('-3-') || doc.id?.includes('-3-')) optNum = 3;
        else optNum = 1;
      }
      optNum = Number(optNum) || 1;

      // Keep the most recently updated document for this option
      if (!existingOptions[optNum]) {
        const targetId = doc.slug || doc.id;
        const createdDate = doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString();
        const updatedDate = doc.updatedAt ? new Date(doc.updatedAt).toISOString() : createdDate;

        existingOptions[optNum] = {
          id: targetId,
          slug: targetId,
          url: `/itinerary/${targetId}`,
          optionNumber: optNum,
          title: doc.title || `${doc.destination || 'Luxury'} Itinerary`,
          destination: doc.destination || 'Rajasthan',
          quote: doc.finalQuotationAmount ?? doc.rawZohoData?.Final_Quotation_Amount ?? null,
          advancePaid: doc.advanceAmountPaid ?? doc.rawZohoData?.Advance_Amount_Paid ?? null,
          balanceDue: doc.balancePendingAmount ?? doc.rawZohoData?.Balance_Pending_Amount ?? null,
          createdAt: createdDate,
          updatedAt: updatedDate
        };
      }
    }

    return NextResponse.json({
      success: true,
      foundCount: docs.length,
      existingOptions,
      hasOptions: Object.keys(existingOptions).length > 0
    });
  } catch (error: any) {
    console.error('[Check Itinerary Options Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal error checking existing itinerary options.' },
      { status: 500 }
    );
  }
}
