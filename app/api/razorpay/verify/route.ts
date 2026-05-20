import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { sendWhatsApp } from '@/lib/whatsapp'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      fullName,
      emailAddress,
      mobileNumber,
      tripTitle,
      totalAmount,
      startDate,
      endDate
    } = body

    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('Razorpay secret is missing from environment variables.')
      return NextResponse.json(
        { error: 'Razorpay secret key is not configured.' },
        { status: 500 }
      )
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (generatedSignature === razorpay_signature) {
      // Payment verified. Trigger notifications and include status details in the response.
      const notificationResult = await triggerNotifications({
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        fullName: fullName || 'Traveler',
        emailAddress: emailAddress,
        mobileNumber: mobileNumber,
        tripTitle: tripTitle || 'Wanderphilia Tour Package',
        totalAmount: totalAmount || 0,
        startDate: startDate || 'TBA',
        endDate: endDate || 'TBA'
      }).catch(err => {
        console.error('Failed to trigger post-payment notifications:', err)
        return {
          customerEmailSuccess: false,
          ownerEmailSuccess: false,
          customerWhatsAppSuccess: false,
          ownerWhatsAppSuccess: false,
          errors: [err.message || String(err)],
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        notificationResult,
      })
    } else {
      return NextResponse.json({ success: false, message: 'Payment verification failed' }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Error verifying payment:', error)
    return NextResponse.json({ error: error.message || 'Failed to verify payment' }, { status: 500 })
  }
}

interface NotificationParams {
  paymentId: string
  orderId: string
  fullName: string
  emailAddress?: string
  mobileNumber?: string
  tripTitle: string
  totalAmount: number
  startDate: string
  endDate: string
}

async function triggerNotifications(params: NotificationParams) {
  const {
    paymentId,
    orderId,
    fullName,
    emailAddress,
    mobileNumber,
    tripTitle,
    totalAmount,
    startDate,
    endDate
  } = params

  const adminEmail = 'experiences@wanderphilia.com'
  const formattedAmount = Number(totalAmount).toLocaleString('en-IN')
  const errors: string[] = []
  let customerEmailSuccess = false
  let ownerEmailSuccess = false
  let customerWhatsAppSuccess = false
  let ownerWhatsAppSuccess = false

  // --- 1. SEND EMAILS ---
  if (emailAddress) {
    // A. Email to Customer
    const customerEmailContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; padding: 20px; color: #334155; }
    .card { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden; }
    .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 32px 24px; text-align: center; }
    .content { padding: 32px 24px; }
    .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .table td { padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
    .table td.label { color: #64748b; font-size: 13px; text-transform: uppercase; font-weight: bold; }
    .table td.value { text-align: right; color: #1e293b; font-weight: 600; }
    .footer { text-align: center; padding: 24px; font-size: 12px; color: #94a3b8; border-t: 1px solid #f1f5f9; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2 style="margin: 0; font-size: 24px; font-weight: 800;">Booking Confirmed!</h2>
      <p style="margin: 8px 0 0 0; opacity: 0.9;">Pack your bags, ${fullName}! Your adventure is booked.</p>
    </div>
    <div class="content">
      <p>Hi ${fullName},</p>
      <p>Thank you for choosing Wanderphilia. We are excited to guide you on this journey. Your payment has been received and verified successfully.</p>
      
      <table class="table">
        <tr>
          <td class="label">Trip Name</td>
          <td class="value">${tripTitle}</td>
        </tr>
        <tr>
          <td class="label">Travel Dates</td>
          <td class="value">${startDate} to ${endDate}</td>
        </tr>
        <tr>
          <td class="label">Total Paid</td>
          <td class="value" style="color: #059669; font-size: 18px; font-weight: 800;">₹${formattedAmount}</td>
        </tr>
        <tr>
          <td class="label">Payment ID</td>
          <td class="value" style="font-family: monospace; font-size: 12px;">${paymentId}</td>
        </tr>
        <tr>
          <td class="label">Order ID</td>
          <td class="value" style="font-family: monospace; font-size: 12px;">${orderId}</td>
        </tr>
      </table>

      <p style="font-size: 14px; color: #64748b; margin-top: 24px;">Our travel coordinator will get in touch with you shortly to assist with itineraries, travel checklists, and preparation details.</p>
    </div>
    <div class="footer">
      Wanderphilia Experiences Private Limited &copy; 2026. All rights reserved.
    </div>
  </div>
</body>
</html>
`

    let customerResult
    try {
      customerResult = await sendEmail({
        to: emailAddress,
        subject: `Booking Confirmed: ${tripTitle} - Wanderphilia`,
        html: customerEmailContent,
      })
    } catch (err: any) {
      console.error('Error sending customer confirmation email:', err)
      errors.push(`customerEmail: ${err.message || String(err)}`)
      customerResult = { success: false, error: err }
    }

    customerEmailSuccess = !!customerResult?.success
    if (!customerEmailSuccess && customerResult?.error) {
      errors.push(`customerEmail: ${customerResult.error.message || String(customerResult.error)}`)
    }
  }

  // B. Email to Owner
  const ownerEmailContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px; }
    .card { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: #0f172a; color: white; padding: 24px; }
    .content { padding: 24px; }
    .field { margin-bottom: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; }
    .label { font-size: 12px; color: #64748b; font-weight: bold; }
    .value { font-size: 14px; color: #0f172a; font-weight: 600; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2 style="margin: 0; font-size: 20px;">🔔 New Booking Received</h2>
      <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.8;">Action required: Assign traveler coordinator</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Trip Booked</div>
        <div class="value">${tripTitle}</div>
      </div>
      <div class="field">
        <div class="label">Dates</div>
        <div class="value">${startDate} to ${endDate}</div>
      </div>
      <div class="field">
        <div class="label">Amount Paid</div>
        <div class="value" style="color: #059669; font-size: 16px;">₹${formattedAmount}</div>
      </div>
      <div class="field">
        <div class="label">Customer Name</div>
        <div class="value">${fullName}</div>
      </div>
      <div class="field">
        <div class="label">Customer Phone</div>
        <div class="value">${mobileNumber || 'Not provided'}</div>
      </div>
      <div class="field">
        <div class="label">Customer Email</div>
        <div class="value">${emailAddress || 'Not provided'}</div>
      </div>
      <div class="field">
        <div class="label">Razorpay Payment ID</div>
        <div class="value" style="font-family: monospace;">${paymentId}</div>
      </div>
    </div>
  </div>
</body>
</html>
`

  let ownerResult
  try {
    ownerResult = await sendEmail({
      to: adminEmail,
      subject: `🔔 New Booking Alert: ${fullName} - ${tripTitle}`,
      html: ownerEmailContent,
    })
  } catch (err: any) {
    console.error('Error sending admin confirmation email:', err)
    errors.push(`ownerEmail: ${err.message || String(err)}`)
    ownerResult = { success: false, error: err }
  }

  ownerEmailSuccess = !!ownerResult?.success
  if (!ownerEmailSuccess && ownerResult?.error) {
    errors.push(`ownerEmail: ${ownerResult.error.message || String(ownerResult.error)}`)
  }


  // --- 2. SEND WHATSAPP MESSAGES ---
  
  // A. WhatsApp to Customer
  if (mobileNumber) {
    const customerMsg = `Hey *${fullName}*! 🌟\n\nYour booking for *${tripTitle}* starting on *${startDate}* has been successfully confirmed!\n\n*Booking Summary:*\n• *Dates:* ${startDate} to ${endDate}\n• *Total Paid:* ₹${formattedAmount} (GST Inc.)\n• *Payment ID:* ${paymentId}\n\nOur tour coordinator will reach out to you on this number shortly. Thank you for choosing Wanderphilia! ✈️`
    
    try {
    await sendWhatsApp({
      to: mobileNumber,
      message: customerMsg,
    })
    customerWhatsAppSuccess = true
  } catch (err: any) {
    console.error('Error sending customer WhatsApp:', err)
    errors.push(`customerWhatsApp: ${err.message || String(err)}`)
  }
  }

  // B. WhatsApp to Owner
  const ownerMsg = `🔔 *New Booking Confirmed!*\n\n• *Trip:* ${tripTitle}\n• *Dates:* ${startDate} to ${endDate}\n• *Amount:* ₹${formattedAmount}\n• *Customer:* ${fullName}\n• *Phone:* ${mobileNumber || 'N/A'}\n• *Email:* ${emailAddress || 'N/A'}\n• *Payment ID:* ${paymentId}\n\nPlease check the admin dashboard and assign a coordinator.`

  try {
    await sendWhatsApp({
      to: '919217664099', // Owner's WhatsApp Number
      message: ownerMsg,
    })
    ownerWhatsAppSuccess = true
  } catch (err: any) {
    console.error('Error sending owner WhatsApp:', err)
    errors.push(`ownerWhatsApp: ${err.message || String(err)}`)
  }

  return {
    customerEmailSuccess,
    ownerEmailSuccess,
    customerWhatsAppSuccess,
    ownerWhatsAppSuccess,
    errors,
  }
}
