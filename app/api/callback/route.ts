import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { name, phone, email, title, price } = await request.json()

    if (!name || !phone || !email) {
      return NextResponse.json(
        { error: 'Name, phone, and email are required' },
        { status: 400 }
      )
    }

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
        <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Wanderphilia Travel Portal</p>
      </div>
      
      <div class="section">
        <h3>Trip Details</h3>
        <div class="field"><strong>Trip:</strong> ${title}</div>
        <div class="field"><strong>Price:</strong> INR ${price ? price.toLocaleString('en-IN') : 'N/A'}</div>
      </div>

      <div class="section">
        <h3>Customer Information</h3>
        <div class="field"><strong>Name:</strong> ${name}</div>
        <div class="field"><strong>Phone:</strong> ${phone}</div>
        <div class="field"><strong>Email:</strong> ${email}</div>
      </div>

      <div class="alert">
        <p style="margin: 0; font-size: 14px; color: #1e40af;">
          <strong>Action Required:</strong> Please contact this customer at the provided phone number or email to discuss their trip booking.
        </p>
      </div>
    </div>
  </body>
</html>
    `

    // Send email to admin
    const adminEmailResult = await sendEmail({
      to: 'experiences@wanderphilia.com',
      subject: `New Callback Request: ${title}`,
      html: emailContent,
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
      .section h3 { margin: 0 0 16px 0; font-size: 16px; color: #333; }
      .field { margin: 8px 0; color: #555; }
      .field strong { color: #333; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2 style="margin: 0; font-size: 20px;">Thanks for Your Interest!</h2>
        <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Wanderphilia</p>
      </div>
      
      <div class="section">
        <p>Hi ${name},</p>
        <p>We've received your callback request for <strong>${title}</strong>. Our travel experts will contact you shortly at <strong>${phone}</strong> to help you plan your perfect trip.</p>
        
        <h3>Your Trip Details</h3>
        <div class="field"><strong>Trip:</strong> ${title}</div>
        <div class="field"><strong>Price:</strong> INR ${price ? price.toLocaleString('en-IN') : 'N/A'}</div>
      </div>

      <div class="section">
        <p>If you have any questions in the meantime, feel free to reply to this email or visit our website.</p>
        <p>Best regards,<br><strong>Wanderphilia Team</strong></p>
      </div>
    </div>
  </body>
</html>
    `

    const customerEmailResult = await sendEmail({
      to: email,
      subject: `Callback Request Received - Wanderphilia`,
      html: customerEmailContent,
    })

    if (adminEmailResult.success) {
      return NextResponse.json(
        { message: 'Callback request received. Confirmation email sent.' },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { error: 'Failed to send email', details: adminEmailResult.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error processing callback:', error)
    return NextResponse.json(
      { error: 'Failed to process callback request' },
      { status: 500 }
    )
  }
}
