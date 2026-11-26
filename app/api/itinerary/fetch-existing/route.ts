import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ItineraryDocument } from '@/types/itinerary';
import { getManualItinerary, manualItineraryToDocument } from '@/data/manual-itineraries';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

/**
 * GET /api/itinerary/fetch-existing?query=...
 * Finds an existing generated manual or sheet itinerary by ID, slug, URL, or inquiryId.
 * Used by Sales Hub and Sheet Itinerary pages to sync/load already created itineraries
 * so team members can edit and update them directly.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawQuery = (searchParams.get('query') || searchParams.get('id') || searchParams.get('inquiryId') || '').trim();

    if (!rawQuery) {
      return NextResponse.json(
        { success: false, found: false, error: 'Query parameter is required.' },
        { status: 400 }
      );
    }

    // 1. Clean query string (strip URL domain, path, trailing slashes, or query params)
    let cleanQuery = rawQuery;
    if (cleanQuery.includes('/itinerary/')) {
      const parts = cleanQuery.split('/itinerary/');
      cleanQuery = parts[1]?.split('?')[0]?.split('#')[0]?.replace(/\/$/, '') || cleanQuery;
    }
    cleanQuery = cleanQuery.trim().replace(/^https?:\/\/[^\/]+\//, '').replace(/\/$/, '');

    // 2. First check MongoDB "itineraries" collection
    try {
      const db = await getDb();
      if (db) {
        const collection = db.collection<ItineraryDocument>('itineraries');

        // Escape regex special chars
        const escaped = cleanQuery.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`^${escaped}$`, 'i');

        const doc = await collection.findOne({
          $or: [
            { id: cleanQuery },
            { slug: cleanQuery },
            { id: regex },
            { slug: regex },
            { inquiryId: cleanQuery },
            { inquiryId: regex },
            { 'rawZohoData.inquiryId': cleanQuery },
            { 'rawZohoData.inquiryId': regex },
            { 'rawZohoData.Inquiry_ID': cleanQuery },
            { 'rawZohoData.Inquiry_ID': regex },
            { zohoLeadId: cleanQuery },
            { 'rawZohoData.id': cleanQuery }
          ]
        });

        if (doc) {
          return NextResponse.json({
            success: true,
            found: true,
            source: 'mongodb',
            itinerary: {
              ...doc,
              _id: doc._id?.toString(),
              createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
              updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date().toISOString()
            }
          });
        }
      }
    } catch (dbErr) {
      console.warn('[Fetch Existing Itinerary DB Warn]:', dbErr);
    }

    // 3. Check local manual itineraries
    const localManual = getManualItinerary(cleanQuery);
    if (localManual) {
      const doc = manualItineraryToDocument(localManual);
      return NextResponse.json({
        success: true,
        found: true,
        source: 'local-manual',
        itinerary: doc
      });
    }

    return NextResponse.json({
      success: false,
      found: false,
      message: `No existing itinerary found matching "${cleanQuery}".`
    });
  } catch (error: any) {
    console.error('[Fetch Existing Itinerary Error]:', error);
    return NextResponse.json(
      { success: false, found: false, error: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
