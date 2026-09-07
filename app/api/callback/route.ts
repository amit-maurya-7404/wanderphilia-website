import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { submitToZohoCRM, getDestinationFromTrip } from '@/lib/zoho'
import { trips } from '@/lib/data'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const name = body.name || 'Traveler'
    const phone = body.phone
    const email = body.email
    const tripSlug = body.tripSlug || body.slug || ''
    const exactTrip = trips.find(t => t.slug === tripSlug || t.title === (body.title || body.tripTitle))
    const title = body.title || body.tripTitle || (exactTrip ? exactTrip.title : 'Wanderphilia Trip')
    const price = body.price || (exactTrip ? exactTrip.price : undefined)
    const destination = body.destination || (exactTrip ? exactTrip.destination : getDestinationFromTrip(title))
    const source = body.source || 'Website Callback Request'

    if (!phone || !email) {
      return NextResponse.json(
        { error: 'Phone and email are required' },
        { status: 400 }
      )
    }

    // 1. Submit to Zoho CRM
    let zohoLeadId: string | undefined
    try {
      const zohoRes = await submitToZohoCRM({
        name,
        email,
        phone,
        leadSource: source,
        leadStatus: 'New Enquiry',
        tripTitle: title,
        tripSlug: tripSlug || (exactTrip ? exactTrip.slug : undefined),
        tripPrice: price,
        destination: destination,
        message: `Callback request received for ${title} (${destination || 'General inquiry'})`
      })
      if (zohoRes && 'leadId' in zohoRes && zohoRes.leadId) {
        zohoLeadId = zohoRes.leadId
      }
    } catch (zohoError) {
      console.error('[Callback Request Zoho Submission Error]:', zohoError)
    }

    // 2. Send email to admin (experiences@wanderphilia.com)
    const adminEmailContent = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; padding: 20px; color: #1e293b; margin: 0; }
      .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
      .header { background: linear-gradient(135deg, #ff9500 0%, #ff5e00 100%); color: white; padding: 28px 24px; }
      .section { padding: 24px; border-bottom: 1px solid #f1f5f9; }
      .section h3 { margin: 0 0 14px 0; font-size: 15px; color: #0f172a; border-bottom: 2px solid #ff9500; display: inline-block; padding-bottom: 4px; }
      .field { margin: 8px 0; color: #64748b; font-size: 14px; }
      .field strong { color: #0f172a; font-weight: 600; }
      .alert { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 14px 16px; border-radius: 4px; margin: 20px 24px; }
      .footer { text-align: center; padding: 16px; font-size: 12px; color: #94a3b8; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2 style="margin: 0; font-size: 22px; font-weight: 800;">📞 New Callback Request</h2>
        <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.95;">Source: ${source}</p>
      </div>
      
      <div class="section">
        <h3>Trip Information</h3>
        <div class="field"><strong>Trip:</strong> ${title}</div>
        <div class="field"><strong>Destination:</strong> ${destination || 'Not Specified'}</div>
        <div class="field"><strong>Price:</strong> ${price ? `INR ${price.toLocaleString('en-IN')}` : 'N/A'}</div>
        ${zohoLeadId ? `<div class="field"><strong>Zoho Lead ID:</strong> <code>${zohoLeadId}</code></div>` : ''}
      </div>

      <div class="section">
        <h3>Customer Details</h3>
        <div class="field"><strong>Name:</strong> ${name}</div>
        <div class="field"><strong>Phone:</strong> <a href="tel:${phone}" style="color: #ff5e00; text-decoration: none;">${phone}</a></div>
        <div class="field"><strong>Email:</strong> <a href="mailto:${email}" style="color: #ff5e00; text-decoration: none;">${email}</a></div>
      </div>

      <div class="alert">
        <p style="margin: 0; font-size: 13px; color: #166534; line-height: 1.5;">
          <strong>Action Required:</strong> Please contact this traveler at the provided phone number or email to assist with their trip inquiry.
        </p>
      </div>

      <div class="footer">
        Wanderphilia Travel Portal &copy; 2026
      </div>
    </div>
  </body>
</html>
    `

    await sendEmail({
      to: 'experiences@wanderphilia.com',
      subject: `New Callback Request: ${name} - ${title}`,
      html: adminEmailContent,
      replyTo: email,
    })

    // 3. Send confirmation email to customer (email)
    const customerEmailContent = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; padding: 20px; color: #334155; margin: 0; }
      .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.05); }
      .header { background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; padding: 32px 24px; text-align: center; }
      .content { padding: 32px 24px; }
      .trip-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0; }
      .field { margin: 8px 0; font-size: 14px; }
      .field strong { color: #0f172a; }
      .footer { text-align: center; padding: 20px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2 style="margin: 0; font-size: 24px; font-weight: 800;">Thanks for Your Interest! ✈️</h2>
        <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.95;">Wanderphilia Travel Experiences</p>
      </div>
      
      <div class="content">
        <p style="font-size: 15px; line-height: 1.6; margin-top: 0;">Hi <strong>${name}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          We've received your callback request for <strong>${title}</strong>. Our dedicated travel experts will call you shortly on <strong>${phone}</strong> to help design and finalize your perfect trip.
        </p>
        
        <div class="trip-box">
          <h4 style="margin: 0 0 12px 0; font-size: 15px; color: #0f172a; text-transform: uppercase;">Trip Details</h4>
          <div class="field"><strong>Trip:</strong> ${title}</div>
          <div class="field"><strong>Destination:</strong> ${destination || 'Custom Selection'}</div>
          ${price ? `<div class="field"><strong>Starting Price:</strong> INR ${price.toLocaleString('en-IN')}</div>` : ''}
        </div>

        <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
          Have questions or want to customize your dates? Feel free to reply directly to this email or reach us anytime at <a href="mailto:experiences@wanderphilia.com" style="color: #0891b2; text-decoration: none; font-weight: 600;">experiences@wanderphilia.com</a>.
        </p>

        <p style="font-size: 14px; color: #334155; margin-top: 24px;">
          Best regards,<br>
          <strong>Wanderphilia Team</strong>
        </p>
      </div>

      <div class="footer">
        <strong>Wanderphilia Experiences</strong> &copy; 2026. All rights reserved.
      </div>
    </div>
  </body>
</html>
    `

    await sendEmail({
      to: email,
      subject: `Callback Request Received: ${title} - Wanderphilia`,
      html: customerEmailContent,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Callback request received. Confirmation email sent.',
        leadId: zohoLeadId
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing callback:', error)
    return NextResponse.json(
      { error: 'Failed to process callback request' },
      { status: 500 }
    )
  }
}
