import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, phone, title, price } = await request.json()

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      )
    }

    // Use Resend for email sending (recommended, free tier available)
    // Install: npm install resend
    // Get API key from: https://resend.com
    
    // For now, using a simple nodemailer fallback or webhook approach
    // You can replace this with your preferred email service

    const emailContent = `
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
      .alert { background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 4px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2 style="margin: 0; font-size: 20px;">New Callback Request</h2>
        <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Summer Holiday Sale is LIVE</p>
      </div>
      
      <div class="section">
        <h3>Trip Details</h3>
        <div class="field"><strong>Trip:</strong> ${title}</div>
        <div class="field"><strong>Price:</strong> INR ${price.toLocaleString('en-IN')}</div>
      </div>

      <div class="section">
        <h3>Customer Information</h3>
        <div class="field"><strong>Name:</strong> ${name}</div>
        <div class="field"><strong>Phone:</strong> ${phone}</div>
      </div>

      <div class="alert">
        <p style="margin: 0; font-size: 14px; color: #1e40af;">
          <strong>Action Required:</strong> Please contact this customer at the provided phone number to discuss their trip booking.
        </p>
      </div>
    </div>
  </body>
</html>
    `

    // Option 1: Using Resend (recommended)
    if (process.env.RESEND_API_KEY) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM || 'noreply@wanderphilia.com',
            to: 'experiences@wanderphilia.com',
            subject: `Callback Request: ${title}`,
            html: emailContent,
            reply_to: phone,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to send email via Resend')
        }

        return NextResponse.json(
          { message: 'Email sent successfully' },
          { status: 200 }
        )
      } catch (err) {
        console.error('Resend error:', err)
      }
    }

    // Option 2: Using Mailgun or similar webhook
    if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
      const formData = new FormData()
      formData.append('from', `Wanderphilia <noreply@${process.env.MAILGUN_DOMAIN}>`)
      formData.append('to', 'experiences@wanderphilia.com')
      formData.append('subject', `Callback Request: ${title}`)
      formData.append('html', emailContent)
      formData.append('reply-to', phone)

      const auth = Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString('base64')

      try {
        const response = await fetch(
          `https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${auth}`,
            },
            body: formData,
          }
        )

        if (response.ok) {
          return NextResponse.json(
            { message: 'Email sent successfully' },
            { status: 200 }
          )
        }
      } catch (err) {
        console.error('Mailgun error:', err)
      }
    }

    // Option 3: Fallback - log to database or external service
    console.log('Callback request received:', { name, phone, title, price })

    return NextResponse.json(
      { message: 'Request received. Please configure email service.' },
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
