import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, ADMIN_NOTIFICATION_EMAIL } from '@/lib/email'
import { submitToZohoCRM } from '@/lib/zoho'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    const fullMessage = subject ? `Subject: ${subject}\n\n${message}` : message

    // 1. Submit to Zoho CRM
    let zohoLeadId: string | undefined
    try {
      const zohoRes = await submitToZohoCRM({
        name,
        email,
        phone,
        message: fullMessage,
        leadSource: 'Website Contact Us',
        leadStatus: 'New Enquiry'
      })
      if (zohoRes && 'leadId' in zohoRes && zohoRes.leadId) {
        zohoLeadId = zohoRes.leadId
      }
    } catch (zohoError) {
      console.error('[Contact Form Zoho Submission Error]:', zohoError)
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
      .message-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin-top: 12px; font-size: 14px; line-height: 1.6; color: #334155; }
      .footer { text-align: center; padding: 16px; font-size: 12px; color: #94a3b8; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2 style="margin: 0; font-size: 22px; font-weight: 800;">✉️ New Contact Form Message</h2>
        <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.95;">Wanderphilia Contact Page</p>
      </div>
      
      <div class="section">
        <h3>Customer Information</h3>
        <div class="field"><strong>Name:</strong> ${name}</div>
        <div class="field"><strong>Email:</strong> <a href="mailto:${email}" style="color: #ff5e00; text-decoration: none;">${email}</a></div>
        <div class="field"><strong>Phone:</strong> ${phone ? `<a href="tel:${phone}" style="color: #ff5e00; text-decoration: none;">${phone}</a>` : 'Not provided'}</div>
        ${subject ? `<div class="field"><strong>Subject:</strong> ${subject}</div>` : ''}
        ${zohoLeadId ? `<div class="field"><strong>Zoho Lead ID:</strong> <code>${zohoLeadId}</code></div>` : ''}
      </div>

      <div class="section">
        <h3>Message Content</h3>
        <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
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
      subject: `New Contact Form Submission: ${name}${subject ? ` - ${subject}` : ''}`,
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
      .footer { text-align: center; padding: 20px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2 style="margin: 0; font-size: 24px; font-weight: 800;">We've Received Your Message! ✈️</h2>
        <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.95;">Wanderphilia Support</p>
      </div>
      
      <div class="content">
        <p style="font-size: 15px; line-height: 1.6; margin-top: 0;">Hi <strong>${name}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          Thank you for getting in touch with Wanderphilia! We have received your query and our team will get back to you promptly within 24 hours.
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          If your request is urgent, you can also reach us via WhatsApp or phone anytime.
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
      subject: `We Received Your Message - Wanderphilia`,
      html: customerEmailContent,
    })

    return NextResponse.json(
      { success: true, message: 'Message sent successfully. Confirmation email dispatched.', leadId: zohoLeadId },
      { status: 200 }
    )
  } catch (error) {
    console.error('Email sending error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to send email' },
      { status: 500 }
    )
  }
}
