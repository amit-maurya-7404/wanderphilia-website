import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ItineraryDocument } from '@/types/itinerary';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('query') || searchParams.get('id') || '').trim();

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection<ItineraryDocument>('itineraries');

    // Search existing itineraries by Zoho Lead ID, Inquiry ID, Mobile, or Slug
    const filter: any = {
      $or: [
        { 'rawZohoData.id': query },
        { 'rawZohoData.rawLeadData.id': query },
        { 'rawZohoData.leadId': query },
        { inquiryId: { $regex: `^${query}$`, $options: 'i' } },
        { 'leadDetails.inquiryId': { $regex: `^${query}$`, $options: 'i' } },
        { 'leadDetails.mobile': query },
        { 'leadDetails.phone': query },
        { id: query },
        { slug: query }
      ]
    };

    const matchingDocs = await collection.find(filter).sort({ createdAt: -1 }).toArray();

    // Group options by option number (1, 2, 3) or slug
    const optionsMap: Record<number, any> = {};

    matchingDocs.forEach((doc, idx) => {
      let optNum = (doc as any).optionNumber;
      if (!optNum) {
        // If slug has pattern "name-2-hash", extract option number
        const matchOpt = doc.slug?.match(/-(\d+)-[a-z0-9]+$/i) || doc.id?.match(/-(\d+)-[a-z0-9]+$/i);
        if (matchOpt) {
          optNum = parseInt(matchOpt[1], 10);
        } else {
          optNum = idx === 0 ? 1 : idx + 1;
        }
      }

      if (!optionsMap[optNum]) {
        optionsMap[optNum] = {
          optionNumber: optNum,
          id: doc.id || doc.slug,
          slug: doc.slug || doc.id,
          title: doc.title || `${doc.destination} Itinerary (Option ${optNum})`,
          destination: doc.destination,
          leadName: doc.leadDetails?.name || doc.leadDetails?.firstName,
          finalQuotationAmount: doc.finalQuotationAmount || doc.perAdultPrice,
          createdAt: doc.createdAt,
          url: `/itinerary/${doc.slug || doc.id}`
        };
      }
    });

    const existingOptions = Object.values(optionsMap);

    return NextResponse.json({
      success: true,
      query,
      hasExisting: existingOptions.length > 0,
      existingOptions,
      createdOptionNumbers: existingOptions.map(o => o.optionNumber)
    });
  } catch (error: any) {
    console.error('[Check Lead Options Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to check lead options' },
      { status: 500 }
    );
  }
}
