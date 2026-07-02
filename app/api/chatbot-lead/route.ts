import { NextRequest, NextResponse } from 'next/server'
import { submitToZohoCRM } from '@/lib/zoho'
import { sendEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { name, phone, email, destination, travelDate } = await request.json()

    if (!name || !phone || !email) {
      return NextResponse.json(
        { error: 'Name, phone, and email are required' },
        { status: 400 }
      )
    }

    // Submit to Zoho CRM
    try {
      await submitToZohoCRM({
        name,
        email,
        phone,
        leadSource: 'chatbot of website',
        destination: destination || '',
        message: `Preferred Travel Date: ${travelDate || 'Flexible'}\nDestination: ${destination || 'Custom Selection'}`
      })
    } catch (zohoError) {
      console.error('[Chatbot Lead Zoho Submission Error]:', zohoError)
    }

    // Send email to admin
    try {
      const emailContent = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; }
      .container { max-width: 600px; margin: 0 auto; }
      .header { background: linear-gradient(135deg, #ff8a00 0%, #ff5e00 100%); color: white; padding: 24px; border-radius: 12px; margin-bottom: 24px; }
      .section { background: #f8f8f8; padding: 24px; border-radius: 12px; margin-bottom: 24px; }
      .section h3 { margin: 0 0 16px 0; font-size: 16px; color: #333; }
      .field { margin: 8px 0; color: #555; }
      .field strong { color: #333; }
      .alert { background: #f0f9ff; border-left: 4px solid #ff8a00; padding: 16px; border-radius: 4px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2 style="margin: 0; font-size: 20px;">New Custom Trip Lead from Chatbot</h2>
        <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Wanderphilia Travel Portal</p>
      </div>
      
      <div class="section">
        <h3>Trip Request Details</h3>
        <div class="field"><strong>Destination:</strong> ${destination || 'Not Specified'}</div>
        <div class="field"><strong>Preferred Travel Date:</strong> ${travelDate || 'Flexible'}</div>
      </div>

      <div class="section">
        <h3>Customer Information</h3>
        <div class="field"><strong>Name:</strong> ${name}</div>
        <div class="field"><strong>Phone:</strong> ${phone}</div>
        <div class="field"><strong>Email:</strong> ${email}</div>
      </div>

      <div class="alert">
        <p style="margin: 0; font-size: 14px; color: #b45309;">
          <strong>Action Required:</strong> Please contact this customer to design their custom itinerary to ${destination || 'their destination'}.
        </p>
      </div>
    </div>
  </body>
</html>
      `

      await sendEmail({
        to: 'experiences@wanderphilia.com',
        subject: `New Custom Trip Request: ${destination || 'Custom Destination'}`,
        html: emailContent,
        replyTo: email,
      })
    } catch (emailError) {
      console.error('[Chatbot Lead Email Alert Error]:', emailError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Chatbot Lead API Route Error]:', error)
    return NextResponse.json(
      { error: 'Failed to process chatbot lead' },
      { status: 500 }
    )
  }
}
