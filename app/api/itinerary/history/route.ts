import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ItineraryDocument } from '@/types/itinerary';
import { getAllManualItineraries } from '@/data/manual-itineraries';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get('search') || '').toLowerCase().trim();
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    const db = await getDb();
    const collection = db.collection<ItineraryDocument>('itineraries');

    // 1. Fetch from MongoDB
    const docs = await collection.find({}).sort({ createdAt: -1, _id: -1 }).limit(limit).toArray();

    // 2. Fetch Manual Itineraries
    const manualList = getAllManualItineraries();

    // 3. Format MongoDB Documents
    const dbItems = docs.map((doc) => {
      const createdDate = doc.createdAt ? new Date(doc.createdAt) : new Date();
      const updatedDate = doc.updatedAt ? new Date(doc.updatedAt) : createdDate;

      let optNum = doc.optionNumber;
      if (!optNum) {
        if (doc.slug?.includes('-2-') || doc.id?.includes('-2-')) optNum = 2;
        else if (doc.slug?.includes('-3-') || doc.id?.includes('-3-')) optNum = 3;
        else optNum = 1;
      }

      const travelerName =
        doc.leadDetails?.name ||
        doc.leadDetails?.firstName ||
        doc.rawZohoData?.Full_Name ||
        doc.rawZohoData?.name ||
        'Valued Traveler';

      const inquiryId =
        doc.inquiryId ||
        doc.leadDetails?.inquiryId ||
        doc.rawZohoData?.Inquiry_ID ||
        doc.rawZohoData?.inquiryId ||
        '';

      const finalQuote =
        doc.finalQuotationAmount ??
        doc.rawZohoData?.Final_Quotation_Amount ??
        doc.perAdultPrice ??
        null;

      return {
        id: doc.id || doc.slug,
        slug: doc.slug || doc.id,
        url: `/itinerary/${doc.slug || doc.id}`,
        title: doc.title || `${doc.destination || 'Luxury'} Itinerary`,
        destination: doc.destination || 'India',
        travelerName,
        inquiryId,
        optionNumber: optNum,
        finalQuotationAmount: finalQuote,
        perAdultPrice: doc.perAdultPrice || null,
        perKidPrice: doc.perKidPrice || null,
        days: doc.noOfDays || doc.dayPlans?.length || 0,
        nights: doc.noOfNights || 0,
        hotelName: doc.hotelName || doc.stay?.hotelName || '',
        roomCategory: doc.roomCategory || doc.stay?.roomCategory || '',
        vehicleType: doc.leadDetails?.vehicleType || doc.rawZohoData?.Vehicle_Type || '',
        category: 'zoho' as const,
        source: 'Zoho CRM / AI Generated',
        createdAt: createdDate.toISOString(),
        updatedAt: updatedDate.toISOString(),
        rawDate: createdDate.getTime()
      };
    });

    // 4. Format Manual Documents
    const manualItems = manualList.map((m) => {
      // Use fixed recent baseline date for manual itineraries
      const defaultDate = m.id.includes('updated')
        ? new Date('2026-10-16T00:30:00.000Z')
        : m.id.includes('new')
        ? new Date('2026-10-15T18:00:00.000Z')
        : new Date('2026-10-14T12:00:00.000Z');

      return {
        id: m.id,
        slug: m.slug,
        url: `/itinerary/${m.id}`,
        title: m.title,
        destination: m.destination,
        travelerName: m.leadName || 'Valued Traveler',
        inquiryId: m.leadDetails?.inquiryId || '',
        optionNumber: 1,
        finalQuotationAmount: m.finalQuotationAmount || (m.pricingTable ? m.pricingTable.grandTotal : null),
        perAdultPrice: m.perAdultPrice || null,
        perKidPrice: m.perKidPrice || null,
        days: m.numDays,
        nights: m.numNights,
        hotelName: m.accommodations?.map(a => a.hotelName).join(', ') || '',
        roomCategory: m.accommodations?.[0]?.roomCategory || '',
        vehicleType: m.vehicleType || '',
        category: 'manual' as const,
        source: 'Curated Manual Itinerary',
        createdAt: defaultDate.toISOString(),
        updatedAt: defaultDate.toISOString(),
        rawDate: defaultDate.getTime()
      };
    });

    // 5. Deduplicate (if manual has same id as MongoDB, prefer MongoDB)
    const existingIds = new Set(dbItems.map(i => i.id.toLowerCase()));
    const filteredManual = manualItems.filter(m => !existingIds.has(m.id.toLowerCase()));

    // 6. Merge & Sort by newest date first
    let allItineraries = [...dbItems, ...filteredManual].sort((a, b) => b.rawDate - a.rawDate);

    // Apply search filter if provided
    if (search) {
      allItineraries = allItineraries.filter(item =>
        item.travelerName.toLowerCase().includes(search) ||
        item.destination.toLowerCase().includes(search) ||
        item.id.toLowerCase().includes(search) ||
        item.slug.toLowerCase().includes(search) ||
        item.inquiryId.toLowerCase().includes(search) ||
        item.title.toLowerCase().includes(search)
      );
    }

    // Stats
    const totalCount = allItineraries.length;
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const todayCount = allItineraries.filter(i => i.rawDate >= startOfToday).length;

    const destinationsSet = new Set(allItineraries.map(i => i.destination).filter(Boolean));

    return NextResponse.json({
      success: true,
      totalCount,
      zohoCount: dbItems.length,
      manualCount: filteredManual.length,
      todayCount,
      destinationsCount: destinationsSet.size,
      itineraries: allItineraries,
      zohoItineraries: dbItems,
      manualItineraries: filteredManual
    });
  } catch (error: any) {
    console.error('[Itinerary History API Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch itinerary history' },
      { status: 500 }
    );
  }
}
