import { NextRequest, NextResponse } from 'next/server';
import { fetchZohoLeadById } from '@/lib/zoho-fetch';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('id') || searchParams.get('query') || searchParams.get('inquiryId') || '';

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Please provide a leadId or inquiryId query parameter.' },
        {
          status: 400,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );
    }

    const leadData = await fetchZohoLeadById(query);

    if (!leadData) {
      return NextResponse.json(
        { success: false, error: `No Zoho CRM lead found matching query: "${query}"` },
        {
          status: 404,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        lead: leadData,
        fetchedAt: new Date().toISOString()
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  } catch (error) {
    console.error('[Fetch Zoho Lead API Error]:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal error fetching lead' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  }
}
