import { NextRequest, NextResponse } from 'next/server'
import { submitToZohoCRM } from '@/lib/zoho'
import { sendEmail, ADMIN_NOTIFICATION_EMAIL } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { name, phone, email, destination, travelDate } = await request.json()

    if (!name || !phone || !email) {
      return NextResponse.json(
        { error: 'Name, phone, and email are required' },
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
        leadSource: 'chatbot of website',
        leadStatus: 'New Enquiry',
        destination: destination || '',
        message: `Chatbot custom trip request.\nPreferred Travel Date: ${travelDate || 'Flexible'}\nDestination: ${destination || 'Custom Selection'}`
      })
      if (zohoRes && 'leadId' in zohoRes && zohoRes.leadId) {
        zohoLeadId = zohoRes.leadId
      }
    } catch (zohoError) {
      console.error('[Chatbot Lead Zoho Submission Error]:', zohoError)
    }

    // 2. Send email to admin (experiences@wanderphilia.com)
    try {
      const emailContent = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; padding: 20px; color: #1e293b; margin: 0; }
      .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
      .header { background: linear-gradient(135deg, #ff8a00 0%, #ff5e00 100%); color: white; padding: 28px 24px; }
      .section { padding: 24px; border-bottom: 1px solid #f1f5f9; }
      .section h3 { margin: 0 0 14px 0; font-size: 15px; color: #0f172a; border-bottom: 2px solid #ff8a00; display: inline-block; padding-bottom: 4px; }
      .field { margin: 8px 0; color: #64748b; font-size: 14px; }
      .field strong { color: #0f172a; font-weight: 600; }
      .alert { background: #fff7ed; border-left: 4px solid #f97316; padding: 14px 16px; border-radius: 4px; margin: 20px 24px; }
      .footer { text-align: center; padding: 16px; font-size: 12px; color: #94a3b8; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2 style="margin: 0; font-size: 22px; font-weight: 800;">🤖 New Custom Trip Lead from Chatbot</h2>
        <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.95;">Wanderphilia AI Trip Planner</p>
      </div>
      
      <div class="section">
        <h3>Trip Request Details</h3>
        <div class="field"><strong>Destination:</strong> ${destination || 'Not Specified'}</div>
        <div class="field"><strong>Preferred Travel Date:</strong> ${travelDate || 'Flexible'}</div>
        ${zohoLeadId ? `<div class="field"><strong>Zoho Lead ID:</strong> <code>${zohoLeadId}</code></div>` : ''}
      </div>

      <div class="section">
        <h3>Customer Information</h3>
        <div class="field"><strong>Name:</strong> ${name}</div>
        <div class="field"><strong>Phone:</strong> <a href="tel:${phone}" style="color: #f97316; text-decoration: none;">${phone}</a></div>
        <div class="field"><strong>Email:</strong> <a href="mailto:${email}" style="color: #f97316; text-decoration: none;">${email}</a></div>
      </div>

      <div class="alert">
        <p style="margin: 0; font-size: 13px; color: #9a3412; line-height: 1.5;">
          <strong>Action Required:</strong> Please contact this customer to design their custom itinerary to ${destination || 'their chosen destination'}.
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
        to: ADMIN_NOTIFICATION_EMAIL,
        subject: `New Custom Trip Request: ${name} - ${destination || 'Custom Destination'}`,
        html: emailContent,
        replyTo: email,
      })
    } catch (emailError) {
      console.error('[Chatbot Lead Admin Email Error]:', emailError)
    }

    // 3. Send confirmation email to customer (email)
    try {
      const customerEmailContent = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; padding: 20px; color: #334155; margin: 0; }
      .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.05); }
      .header { background: linear-gradient(135deg, #ff8a00 0%, #ff5e00 100%); color: white; padding: 32px 24px; text-align: center; }
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
        <h2 style="margin: 0; font-size: 24px; font-weight: 800;">We're Planning Your Custom Trip! ✈️</h2>
        <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.95;">Wanderphilia Custom Experiences</p>
      </div>
      
      <div class="content">
        <p style="font-size: 15px; line-height: 1.6; margin-top: 0;">Hi <strong>${name}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          Thank you for sharing your travel plans with us! We have received your request for a custom itinerary to <strong>${destination || 'your destination'}</strong>.
        </p>
        
        <div class="trip-box">
          <h4 style="margin: 0 0 12px 0; font-size: 15px; color: #0f172a; text-transform: uppercase;">Your Custom Request</h4>
          <div class="field"><strong>Destination:</strong> ${destination || 'Custom Selection'}</div>
          <div class="field"><strong>Travel Dates / Season:</strong> ${travelDate || 'Flexible'}</div>
        </div>

        <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
          Our itinerary specialist will review your request and get in touch with you at <strong>${phone}</strong> or via this email with a customized plan and quote.
        </p>

        <p style="font-size: 14px; color: #334155; margin-top: 24px;">
          Best regards,<br>
          <strong>Wanderphilia Experiences Team</strong>
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
        subject: `We're Crafting Your Trip to ${destination || 'Your Dream Destination'} - Wanderphilia`,
        html: customerEmailContent,
      })
    } catch (customerEmailError) {
      console.error('[Chatbot Lead Customer Email Error]:', customerEmailError)
    }

    return NextResponse.json({ success: true, leadId: zohoLeadId })
  } catch (error) {
    console.error('[Chatbot Lead API Route Error]:', error)
    return NextResponse.json(
      { error: 'Failed to process chatbot lead' },
      { status: 500 }
    )
  }
}
