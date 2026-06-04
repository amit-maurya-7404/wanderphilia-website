import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getZohoAccessToken, getZohoApiUrl } from '@/lib/zoho';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // 1. Webhook Signature Validation (if secret is configured in Vercel dashboard)
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (signature !== expectedSignature) {
        console.error('[Razorpay Webhook Error]: Invalid signature verification.');
        return NextResponse.json(
          { error: 'Webhook signature verification failed.' },
          { status: 400 }
        );
      }
    }

    // Parse payload
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (parseErr) {
      console.error('[Razorpay Webhook Error]: Failed to parse payload JSON:', parseErr);
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    // 2. Filter for payment.captured event
    if (body.event !== 'payment.captured') {
      console.log(`[Razorpay Webhook]: Ignored event type: ${body.event}`);
      return NextResponse.json({
        success: true,
        message: `Ignored event type: ${body.event}`,
      });
    }

    // Extract customer's email from the payment entity
    const email = body.payload?.payment?.entity?.email;
    if (!email) {
      console.warn('[Razorpay Webhook Warning]: Customer email not found in payment payload.');
      return NextResponse.json({
        success: true,
        message: 'No email found in event payload. Skipping Zoho update.',
      });
    }

    // Fetch Zoho CRM Access Token (caching logic inside helper)
    const accessToken = await getZohoAccessToken();

    // 3. Step A (Search): Find the existing Lead ID by Email in Zoho CRM
    const searchUrl = getZohoApiUrl(`/crm/v3/Leads/search?email=${encodeURIComponent(email)}`);
    console.log(`[Razorpay Webhook]: Searching lead in Zoho CRM for email: ${email}`);

    const searchResponse = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
      },
    });

    // Zoho CRM search returns 204 No Content if no records match the criteria
    if (searchResponse.status === 204) {
      console.warn(`[Razorpay Webhook Warning]: No lead found in Zoho CRM matching email: ${email}`);
      return NextResponse.json({
        success: true,
        message: `No lead found matching email: ${email}. Zoho update skipped.`,
      });
    }

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error('[Razorpay Webhook Zoho Search HTTP Error]:', searchResponse.status, errorText);
      return NextResponse.json(
        { error: 'Failed to search lead in Zoho CRM API.' },
        { status: 502 } // Return 502 Bad Gateway to allow Razorpay retry if it's a server failure
      );
    }

    const searchData = await searchResponse.json();
    if (!searchData.data || !Array.isArray(searchData.data) || searchData.data.length === 0) {
      console.warn(`[Razorpay Webhook Warning]: Search response data empty for email: ${email}`);
      return NextResponse.json({
        success: true,
        message: `No lead found matching email: ${email}. Zoho update skipped.`,
      });
    }

    // Extract the existing lead's record ID
    const leadId = searchData.data[0].id;
    if (!leadId) {
      console.warn(`[Razorpay Webhook Warning]: Lead record found but does not contain an ID for email: ${email}`);
      return NextResponse.json({
        success: true,
        message: `Invalid lead record format for email: ${email}. Zoho update skipped.`,
      });
    }

    // 4. Step B (Update): Make PUT request to update the Lead status to "Booking"
    const updateUrl = getZohoApiUrl(`/crm/v3/Leads/${leadId}`);
    console.log(`[Razorpay Webhook]: Updating Zoho CRM lead ${leadId} status to 'Booking'`);

    const updateResponse = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [
          {
            Lead_Status: 'Booking',
          },
        ],
      }),
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('[Razorpay Webhook Zoho Update HTTP Error]:', updateResponse.status, errorText);
      return NextResponse.json(
        { error: `Failed to update lead status in Zoho CRM: ${updateResponse.statusText}` },
        { status: 502 }
      );
    }

    const updateData = await updateResponse.json();
    if (!updateData.data || !Array.isArray(updateData.data) || updateData.data.length === 0) {
      console.error('[Razorpay Webhook Zoho Update Payload Error]: Invalid update response:', updateData);
      return NextResponse.json(
        { error: 'Failed to update lead due to invalid response from CRM.' },
        { status: 502 }
      );
    }

    const recordResult = updateData.data[0];
    if (recordResult.status === 'error') {
      console.error('[Razorpay Webhook Zoho Update Error]:', recordResult);
      return NextResponse.json(
        { error: recordResult.message || 'CRM lead status update failed.' },
        { status: 400 }
      );
    }

    console.log(`[Razorpay Webhook]: Successfully updated Zoho Lead status to 'Booking' for ID ${leadId}`);
    return NextResponse.json({
      success: true,
      message: `Successfully updated Zoho Lead ${leadId} status to 'Booking'.`,
    });
  } catch (error: any) {
    console.error('[POST /api/webhooks/razorpay] Internal Webhook Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Webhook Server Error' },
      { status: 500 }
    );
  }
}
