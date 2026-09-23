import { NextRequest, NextResponse } from 'next/server';
import { fetchZohoLeadById } from '@/lib/zoho-fetch';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('id') || searchParams.get('query') || searchParams.get('inquiryId') || '';

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Please provide a leadId or inquiryId query parameter.' },
        { status: 400 }
      );
    }

    const leadData = await fetchZohoLeadById(query);

    if (!leadData) {
      return NextResponse.json(
        { success: false, error: `No Zoho CRM lead found matching query: "${query}"` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      lead: leadData
    });
  } catch (error) {
    console.error('[Fetch Zoho Lead API Error]:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal error fetching lead' },
      { status: 500 }
    );
  }
}
