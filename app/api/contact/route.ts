import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Send email to admin
    const adminEmailContent = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; }
      .container { max-width: 600px; margin: 0 auto; }
      .header { background: linear-gradient(135deg, #ff9500 0%, #ffb84d 100%); color: white; padding: 24px; border-radius: 12px; margin-bottom: 24px; }
      .section { background: #f8f8f8; padding: 24px; border-radius: 12px; margin-bottom: 24px; }
      .section h3 { margin: 0 0 16px 0; font-size: 16px; color: #333; }
      .field { margin: 8px 0; color: #555; }
      .field strong { color: #333; }
      .message { background: white; border: 1px solid #ddd; padding: 16px; border-radius: 8px; margin-top: 12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2 style="margin: 0; font-size: 20px;">New Contact Form Submission</h2>
        <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Wanderphilia Travel Portal</p>
      </div>
      
      <div class="section">
        <h3>Customer Information</h3>
        <div class="field"><strong>Name:</strong> ${name}</div>
        <div class="field"><strong>Email:</strong> ${email}</div>
        <div class="field"><strong>Phone:</strong> ${phone || 'Not provided'}</div>
      </div>

      <div class="section">
        <h3>Message</h3>
        <div class="message">${message.replace(/\n/g, '<br>')}</div>
      </div>
    </div>
  </body>
</html>
    `

    const adminResult = await sendEmail({
      to: 'experiences@wanderphilia.com',
      subject: `New Contact Form Submission from ${name}`,
      html: adminEmailContent,
      replyTo: email,
    })

    // Send confirmation email to customer
    const customerEmailContent = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; }
      .container { max-width: 600px; margin: 0 auto; }
      .header { background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; padding: 24px; border-radius: 12px; margin-bottom: 24px; }
      .section { background: #f8f8f8; padding: 24px; border-radius: 12px; margin-bottom: 24px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2 style="margin: 0; font-size: 20px;">We Received Your Message</h2>
        <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Wanderphilia</p>
      </div>
      
      <div class="section">
        <p>Hi ${name},</p>
        <p>Thank you for reaching out to Wanderphilia! We've received your message and will get back to you as soon as possible.</p>
        <p>Our team typically responds within 24 hours during business days.</p>
        <p>Best regards,<br><strong>Wanderphilia Team</strong></p>
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
      { success: true, message: 'Email sent successfully' },
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
