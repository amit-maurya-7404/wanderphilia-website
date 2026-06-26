import { NextResponse } from 'next/server';
import { getZohoAccessToken, getZohoApiUrl, getDestinationFromTrip } from '@/lib/zoho';

export const dynamic = 'force-dynamic';

interface InitiateRequest {
  fullName?: string;
  mobileNumber?: string;
  email?: string;
  tripSlug?: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as InitiateRequest | null;
    
    if (!body) {
      return NextResponse.json(
        { error: 'Invalid or missing request body.' },
        { status: 400 }
      );
    }

    const { fullName, mobileNumber, email, tripSlug } = body;

    // Validate request payload
    if (!fullName || typeof fullName !== 'string' || fullName.trim() === '') {
      return NextResponse.json(
        { error: 'fullName is required and must be a non-empty string.' },
        { status: 400 }
      );
    }
    if (!mobileNumber || typeof mobileNumber !== 'string' || mobileNumber.trim() === '') {
      return NextResponse.json(
        { error: 'mobileNumber is required and must be a non-empty string.' },
        { status: 400 }
      );
    }
    if (!email || typeof email !== 'string' || email.trim() === '') {
      return NextResponse.json(
        { error: 'email is required and must be a non-empty string.' },
        { status: 400 }
      );
    }
    if (!tripSlug || typeof tripSlug !== 'string' || tripSlug.trim() === '') {
      return NextResponse.json(
        { error: 'tripSlug is required and must be a non-empty string.' },
        { status: 400 }
      );
    }

    // 1. Fetch Zoho Access Token (uses cached token if valid)
    const accessToken = await getZohoAccessToken();

    // 2. Build target URL
    const url = getZohoApiUrl('/crm/v3/Leads');

    // 3. Make POST request to Zoho CRM Leads Endpoint
    const destination = getDestinationFromTrip(tripSlug);

    const crmResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [
          {
            Last_Name: fullName.trim(),
            Phone: mobileNumber.trim(),
            Email: email.trim(),
            Lead_Status: 'New Enquiry',
            Event_Category: tripSlug.trim(),
            Lead_Source: 'Website',
            Destinations: destination || '',
          },
        ],
      }),
    });

    if (!crmResponse.ok) {
      const errorText = await crmResponse.text();
      console.error('[Zoho CRM Lead Creation HTTP Error]:', crmResponse.status, errorText);
      return NextResponse.json(
        { error: `Zoho CRM API returned error status ${crmResponse.status}` },
        { status: 502 }
      );
    }

    const resData = await crmResponse.json();
    
    // Parse Zoho CRM response
    if (!resData.data || !Array.isArray(resData.data) || resData.data.length === 0) {
      console.error('[Zoho CRM Lead Creation Payload Error]: Invalid response payload:', resData);
      return NextResponse.json(
        { error: 'Failed to create lead due to invalid response from CRM.' },
        { status: 502 }
      );
    }

    const recordResult = resData.data[0];
    if (recordResult.status === 'error') {
      console.error('[Zoho CRM Lead Creation Error]:', recordResult);
      return NextResponse.json(
        { error: recordResult.message || 'CRM Lead insertion failed.' },
        { status: 400 }
      );
    }

    const leadId = recordResult.details?.id;
    if (!leadId) {
      console.error('[Zoho CRM Lead ID Missing]:', recordResult);
      return NextResponse.json(
        { error: 'Zoho CRM did not return a valid Lead ID.' },
        { status: 502 }
      );
    }

    // Return the Zoho Lead ID and success status to the frontend
    return NextResponse.json({
      success: true,
      leadId: leadId,
    });
  } catch (error: any) {
    console.error('[POST /api/checkout/initiate] Internal Server Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
