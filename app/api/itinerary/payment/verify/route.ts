import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { getDb } from '@/lib/mongodb';
import { ItineraryDocument } from '@/types/itinerary';
import {
  generateInvoicePDFBuffer,
  generateInvoiceNumber,
  InvoiceData
} from '@/lib/invoice-generator';
import {
  uploadZohoLeadAttachment,
  addZohoLeadNote,
  updateZohoLeadPaymentStatus,
  findZohoLeadId
} from '@/lib/zoho';
import { sendEmail, ADMIN_NOTIFICATION_EMAIL } from '@/lib/email';
import { sendWhatsApp } from '@/lib/whatsapp';
import { contactPhoneDisplay } from '@/lib/contact';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { error: 'Invalid or missing request body.' },
        { status: 400 }
      );
    }

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      itineraryId,
      leadId: passedLeadId,
      paymentType = 'advance',
      customerName: passedCustomerName,
      customerEmail: passedCustomerEmail,
      customerMobile: passedCustomerMobile,
      destination: passedDestination,
    } = body;

    const razorpaySecret =
      process.env.RAZORPAY_ITINERARY_KEY_SECRET ||
      process.env.RAZORPAY_KEY_SECRET;
    const razorpayKeyId =
      process.env.RAZORPAY_ITINERARY_KEY_ID ||
      process.env.NEXT_PUBLIC_RAZORPAY_ITINERARY_KEY_ID ||
      process.env.RAZORPAY_KEY_ID ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    if (!razorpaySecret || !razorpayKeyId) {
      console.error('Razorpay keys missing from environment.');
      return NextResponse.json(
        { error: 'Razorpay keys not configured on server.' },
        { status: 500 }
      );
    }

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required Razorpay verification parameters.' },
        { status: 400 }
      );
    }

    // 1. Verify Razorpay Signature (HMAC SHA256)
    const expectedSignature = crypto
      .createHmac('sha256', razorpaySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    const actualBuffer = Buffer.from(razorpay_signature, 'utf8');

    const signatureValid =
      expectedBuffer.length === actualBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, actualBuffer);

    if (!signatureValid) {
      console.error('[Itinerary Payment Verify Error] Signature mismatch.');
      return NextResponse.json(
        { success: false, error: 'Payment signature verification failed.' },
        { status: 400 }
      );
    }

    // 2. Fetch Payment from Razorpay API
    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpaySecret,
    });

    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    const paidAmount = Number(payment.amount) / 100;

    if (payment.status === 'authorized') {
      try {
        await razorpay.payments.capture(razorpay_payment_id, payment.amount, payment.currency || 'INR');
        console.log(`[Razorpay Payment Captured] Successfully captured payment ${razorpay_payment_id}`);
      } catch (capErr) {
        console.warn('[Razorpay Capture Warning]:', capErr);
      }
    } else if (payment.status !== 'captured') {
      console.warn(`[Razorpay Payment Status]: ${payment.status} for ${razorpay_payment_id}`);
    }

    // 3. Retrieve Itinerary from MongoDB
    const db = await getDb();
    const collection = db.collection<ItineraryDocument>('itineraries');
    const itinerary = itineraryId
      ? await collection.findOne({ $or: [{ id: itineraryId }, { slug: itineraryId }] })
      : null;

    // Resolve details
    const customerName =
      passedCustomerName ||
      itinerary?.leadDetails?.name ||
      itinerary?.rawZohoData?.Full_Name ||
      [itinerary?.rawZohoData?.First_Name, itinerary?.rawZohoData?.Last_Name].filter(Boolean).join(' ') ||
      'Valued Traveler';

    const customerEmail =
      passedCustomerEmail ||
      itinerary?.leadDetails?.email ||
      itinerary?.rawZohoData?.Email ||
      payment.email ||
      '';

    const customerMobile =
      passedCustomerMobile ||
      itinerary?.leadDetails?.mobile ||
      itinerary?.rawZohoData?.Mobile ||
      itinerary?.rawZohoData?.Phone ||
      payment.contact ||
      '';

    const destination =
      passedDestination ||
      itinerary?.destination ||
      itinerary?.rawZohoData?.Destinations ||
      itinerary?.rawZohoData?.Destination ||
      'India';

    let totalQuotationAmount = Number(
      itinerary?.finalQuotationAmount ??
      itinerary?.rawZohoData?.finalQuotationAmount ??
      itinerary?.rawZohoData?.Final_Quotation_Amount ??
      itinerary?.rawZohoData?.Total_Package_Cost ??
      itinerary?.rawZohoData?.Quotation_Amount ??
      0
    );

    if (totalQuotationAmount === 0 && itineraryId) {
      const { getManualItinerary } = await import('@/data/manual-itineraries');
      const manual = getManualItinerary(itineraryId);
      if (manual && manual.finalQuotationAmount) {
        totalQuotationAmount = Number(manual.finalQuotationAmount);
      }
    }

    if (totalQuotationAmount === 0 && paidAmount > 0) {
      totalQuotationAmount = paymentType === 'token' ? paidAmount * 10 : (paymentType === 'advance' ? paidAmount * 2 : paidAmount);
    }

    const previousPaid = Number(
      itinerary?.advanceAmountPaid ??
      itinerary?.rawZohoData?.Advance_Amount_Paid ??
      itinerary?.rawZohoData?.advanceAmountPaid ??
      0
    );

    const newTotalPaid = previousPaid + paidAmount;
    const newBalanceDue = Math.max(0, totalQuotationAmount - newTotalPaid);
    const paymentStage = newBalanceDue <= 0
      ? 'fully_paid'
      : (newTotalPaid >= Math.round(totalQuotationAmount * 0.5) ? 'advance_paid' : 'token_paid');

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const invoiceNumber = generateInvoiceNumber('CORP.');
    const safeInvoiceNum = invoiceNumber.replace(/[\/\\]/g, '_');

    // Resolve human-readable installment label
    let installmentLabel = 'Package Payment';
    if (paymentType === 'token') installmentLabel = '10% Token Booking Amount';
    else if (paymentType === 'advance') installmentLabel = '50% Booking Advance';
    else if (paymentType === 'remaining_advance') installmentLabel = 'Remaining Advance (40%)';
    else if (paymentType === 'remaining_balance' || paymentType === 'balance') installmentLabel = 'Remaining Balance Payment';
    else if (paymentType === 'full') installmentLabel = '100% Full Tour Payment';

    // 4. Construct Invoice Data Structure
    const invoiceData: InvoiceData = {
      invoiceNumber,
      invoiceDate: formattedDate,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      itineraryId: itineraryId || itinerary?.id || 'Custom Itinerary',
      inquiryId: itinerary?.inquiryId || itinerary?.rawZohoData?.Inquiry_ID || undefined,
      leadId: String(passedLeadId || itinerary?.rawZohoData?.id || ''),
      customerName,
      customerEmail,
      customerMobile,
      destination,
      tripTitle: itinerary?.title || `${itinerary?.noOfNights || 4}N / ${itinerary?.noOfDays || 5}D Royal ${destination} Tour`,
      travelStartDate: itinerary?.leadDetails?.startDate || itinerary?.rawZohoData?.Preferred_Start_date || undefined,
      travelEndDate: itinerary?.leadDetails?.endDate || itinerary?.rawZohoData?.Travel_End_Date || undefined,
      noOfDays: itinerary?.noOfDays || itinerary?.dayPlans?.length || 5,
      noOfNights: itinerary?.noOfNights || (itinerary?.noOfDays ? itinerary.noOfDays - 1 : 4),
      numberOfGuests: itinerary?.leadDetails?.guests || itinerary?.rawZohoData?.Number_Of_Guest || 2,
      adults: itinerary?.adults || itinerary?.rawZohoData?.Adults || 2,
      kids: itinerary?.kids || itinerary?.rawZohoData?.Kids || 0,
      vehicleType: itinerary?.vehicleType || itinerary?.rawZohoData?.Vehicle_Type || 'Private AC Vehicle',
      roomCategory: itinerary?.roomCategory || itinerary?.rawZohoData?.Preferred_Room_Category || 'Luxury Handpicked',
      paymentType: paymentType || 'advance',
      totalPackageAmount: totalQuotationAmount,
      paidAmount,
      balanceDue: newBalanceDue,
    };

    // 5. Generate Official Tax Invoice PDF Buffer (Server-Side)
    const pdfBuffer = await generateInvoicePDFBuffer(invoiceData);
    const invoiceFileName = `Wanderphilia_Invoice_${safeInvoiceNum}.pdf`;

    // 6. Push to Zoho CRM (Attachment, Field Updates & Note)
    let zohoAttachmentSuccess = false;
    let zohoLeadId = passedLeadId || (itinerary?.rawZohoData?.id ? String(itinerary.rawZohoData.id) : null);

    // If no direct Zoho Lead ID, attempt to search lead in Zoho CRM
    if (!zohoLeadId) {
      zohoLeadId = await findZohoLeadId({
        inquiryId: itinerary?.inquiryId || itinerary?.rawZohoData?.Inquiry_ID,
        email: customerEmail,
        mobile: customerMobile,
      });
    }

    if (zohoLeadId && /^\d+$/.test(zohoLeadId)) {
      console.log(`[Zoho CRM Integration] Processing Lead ID: ${zohoLeadId}`);

      // A. Upload PDF Attachment to Lead
      try {
        const attachRes = await uploadZohoLeadAttachment(zohoLeadId, pdfBuffer, invoiceFileName);
        zohoAttachmentSuccess = !!attachRes.success;
      } catch (attachErr) {
        console.error('[Zoho CRM Attachment Upload Error]:', attachErr);
      }

      // B. Update Lead Status and Amounts in Zoho CRM
      try {
        await updateZohoLeadPaymentStatus(zohoLeadId, {
          leadStatus: newBalanceDue <= 0 ? 'Confirmed' : 'Booking',
          advanceAmountPaid: newTotalPaid,
          balancePendingAmount: newBalanceDue,
        });
      } catch (updateErr) {
        console.error('[Zoho CRM Lead Update Error]:', updateErr);
      }

      // C. Add Detailed Installment Note to Lead Record
      try {
        const noteTitle = `${installmentLabel} via Razorpay (₹${paidAmount.toLocaleString('en-IN')})`;
        const noteContent =
          `Online Payment of ₹${paidAmount.toLocaleString('en-IN')} received successfully via Razorpay.\n\n` +
          `• Payment ID: ${razorpay_payment_id}\n` +
          `• Order ID: ${razorpay_order_id}\n` +
          `• Invoice Number: ${invoiceNumber}\n` +
          `• Payment Type: ${installmentLabel}\n` +
          `• Amount Paid in this Installment: ₹${paidAmount.toLocaleString('en-IN')}\n` +
          `• Total Paid So Far: ₹${newTotalPaid.toLocaleString('en-IN')}\n` +
          `• Total Package Cost: ₹${totalQuotationAmount.toLocaleString('en-IN')}\n` +
          `• Remaining Balance: ₹${newBalanceDue.toLocaleString('en-IN')}\n` +
          `• Date & Time: ${formattedDate}\n\n` +
          `Official Invoice PDF "${invoiceFileName}" has been uploaded to this lead's Attachments.`;

        await addZohoLeadNote(zohoLeadId, noteTitle, noteContent);
      } catch (noteErr) {
        console.error('[Zoho CRM Note Error]:', noteErr);
      }
    } else {
      console.warn(`[Zoho CRM Warning] No valid Zoho Lead ID found to attach invoice. Query: ${customerEmail} / ${customerMobile}`);
    }

    // 7. Update MongoDB Itinerary Record
    const paymentRecord = {
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentType: paymentType || 'advance',
      amount: paidAmount,
      totalPaidAfter: newTotalPaid,
      balanceDueAfter: newBalanceDue,
      paidAt: now.toISOString(),
      invoiceNumber,
      invoiceFileName,
      status: 'paid',
      customerName,
      customerEmail,
      customerMobile,
    };

    if (itinerary) {
      try {
        await collection.updateOne(
          { _id: itinerary._id },
          {
            $set: {
              status: 'active',
              advanceAmountPaid: newTotalPaid,
              balancePendingAmount: newBalanceDue,
              paymentStage,
              rawZohoData: {
                ...(itinerary.rawZohoData || {}),
                Lead_Status: newBalanceDue <= 0 ? 'Confirmed' : 'Booking',
                Advance_Amount_Paid: newTotalPaid,
                Balance_Pending_Amount: newBalanceDue,
                Payment_Status: newBalanceDue <= 0 ? 'Fully Paid' : 'Partially Paid',
                Last_Payment_Id: razorpay_payment_id,
                Last_Order_Id: razorpay_order_id,
                Invoice_Number: invoiceNumber,
                Payment_Date: now.toISOString(),
              },
              updatedAt: now,
            },
            $push: {
              payments: paymentRecord as any,
            },
          }
        );
      } catch (dbErr) {
        console.error('[MongoDB Update Error]:', dbErr);
      }
    }

    // 8. Send Dual Emails with PDF Invoice Attachment
    // A. Customer Confirmation Email with Invoice
    if (customerEmail) {
      try {
        const customerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 20px; color: #1e293b; margin: 0; }
    .card { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
    .header { background: linear-gradient(135deg, #6E1E14 0%, #8A261A 100%); color: #ffffff; padding: 32px 24px; text-align: center; }
    .content { padding: 32px 24px; }
    .badge { display: inline-block; background: #22c55e; color: #ffffff; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; margin-bottom: 10px; }
    .table { width: 100%; border-collapse: collapse; margin: 18px 0; }
    .table td { padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .table td.label { color: #64748b; font-weight: 600; width: 40%; }
    .table td.value { color: #0f172a; font-weight: 700; text-align: right; }
    .alert-box { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 12px; margin-top: 20px; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="badge">✓ Payment Received & Booking Secured</div>
      <h2 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff;">Booking Confirmed! ✈️</h2>
      <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.95;">Thank you for choosing Wanderphilia, ${customerName}!</p>
    </div>
    
    <div class="content">
      <p style="font-size: 15px; line-height: 1.6; margin-top: 0;">
        Hi <strong>${customerName}</strong>,
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #475569;">
        We have successfully received your payment of <strong style="color: #16a34a; font-size: 16px;">₹${paidAmount.toLocaleString('en-IN')}</strong> for your luxury tour to <strong>${destination}</strong>. Your official payment receipt / tax invoice is attached with this email.
      </p>

      <table class="table">
        <tr>
          <td class="label">Invoice Number</td>
          <td class="value" style="color: #6E1E14; font-family: monospace;">${invoiceNumber}</td>
        </tr>
        <tr>
          <td class="label">Destination</td>
          <td class="value">${destination}</td>
        </tr>
        <tr>
          <td class="label">Payment Installment</td>
          <td class="value">${installmentLabel}</td>
        </tr>
        <tr>
          <td class="label">Amount Paid Today</td>
          <td class="value" style="color: #16a34a; font-size: 16px;">₹${paidAmount.toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td class="label">Total Paid So Far</td>
          <td class="value" style="color: #0f172a; font-weight: 800;">₹${newTotalPaid.toLocaleString('en-IN')} / ₹${totalQuotationAmount.toLocaleString('en-IN')}</td>
        </tr>
        ${newBalanceDue > 0 ? `
        <tr>
          <td class="label">Remaining Balance</td>
          <td class="value" style="color: #6E1E14;">₹${newBalanceDue.toLocaleString('en-IN')}</td>
        </tr>
        ` : `
        <tr>
          <td class="label">Payment Status</td>
          <td class="value" style="color: #16a34a;">100% Fully Cleared</td>
        </tr>
        `}
        <tr>
          <td class="label">Razorpay Payment ID</td>
          <td class="value" style="font-family: monospace; font-size: 12px;">${razorpay_payment_id}</td>
        </tr>
        <tr>
          <td class="label">Payment Date</td>
          <td class="value">${formattedDate}</td>
        </tr>
      </table>

      <div class="alert-box">
        <p style="margin: 0; font-size: 13px; color: #166534; line-height: 1.6;">
          <strong>Next Steps:</strong><br>
          • Your hotel stays and chauffeur transport are now being locked in with our luxury partners.<br>
          • Your personal Wanderphilia trip coordinator will reach out to you on <strong>${customerMobile}</strong> shortly with your full day-by-day confirmation kit.
        </p>
      </div>

      <p style="font-size: 13px; color: #64748b; margin-top: 24px; line-height: 1.5;">
        Please find your official Tax Invoice attached as a PDF (<strong>${invoiceFileName}</strong>). For any immediate questions, reply to this email or chat with us on WhatsApp at <strong>+91 ${contactPhoneDisplay}</strong>.
      </p>
    </div>

    <div class="footer">
      <strong>Wanderphilia Experiences Private Limited</strong> &copy; 2026. All rights reserved.
    </div>
  </div>
</body>
</html>
        `;

        await sendEmail({
          to: customerEmail,
          subject: `Booking Confirmed: ${destination} Tour - Wanderphilia (Invoice #${invoiceNumber})`,
          html: customerEmailHtml,
          attachments: [
            {
              filename: invoiceFileName,
              content: pdfBuffer,
              contentType: 'application/pdf',
            },
          ],
        });
      } catch (custEmailErr) {
        console.error('[Customer Email Error]:', custEmailErr);
      }
    }

    // B. Admin Alert Email with Invoice Attached
    try {
      const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px; }
    .card { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: #6E1E14; color: white; padding: 24px; }
    .content { padding: 24px; }
    .field { margin-bottom: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; }
    .label { font-size: 12px; color: #64748b; font-weight: bold; }
    .value { font-size: 14px; color: #0f172a; font-weight: 600; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2 style="margin: 0; font-size: 20px;">💰 ${installmentLabel} Received via Itinerary</h2>
      <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.85;">Customer completed payment on itinerary page</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Customer Name</div>
        <div class="value">${customerName}</div>
      </div>
      <div class="field">
        <div class="label">Destination</div>
        <div class="value">${destination}</div>
      </div>
      <div class="field">
        <div class="label">Amount Paid in this Installment</div>
        <div class="value" style="color: #16a34a; font-size: 16px;">₹${paidAmount.toLocaleString('en-IN')}</div>
      </div>
      <div class="field">
        <div class="label">Total Paid To Date</div>
        <div class="value" style="font-weight: bold; font-size: 15px;">₹${newTotalPaid.toLocaleString('en-IN')}</div>
      </div>
      <div class="field">
        <div class="label">Total Package Cost</div>
        <div class="value">₹${totalQuotationAmount.toLocaleString('en-IN')}</div>
      </div>
      <div class="field">
        <div class="label">Remaining Balance Due</div>
        <div class="value" style="color: #6E1E14;">₹${newBalanceDue.toLocaleString('en-IN')}</div>
      </div>
      <div class="field">
        <div class="label">Payment Type</div>
        <div class="value">${installmentLabel}</div>
      </div>
      <div class="field">
        <div class="label">Customer Mobile</div>
        <div class="value">${customerMobile || 'N/A'}</div>
      </div>
      <div class="field">
        <div class="label">Customer Email</div>
        <div class="value">${customerEmail || 'N/A'}</div>
      </div>
      <div class="field">
        <div class="label">Razorpay Payment ID</div>
        <div class="value" style="font-family: monospace;">${razorpay_payment_id}</div>
      </div>
      <div class="field">
        <div class="label">Zoho CRM Lead ID</div>
        <div class="value" style="font-family: monospace;">${zohoLeadId || 'Not matched'} (Attachment status: ${zohoAttachmentSuccess ? 'Uploaded' : 'Pending'})</div>
      </div>
      <div class="field">
        <div class="label">Invoice No</div>
        <div class="value" style="font-family: monospace;">${invoiceNumber}</div>
      </div>
    </div>
  </div>
</body>
</html>
      `;

      await sendEmail({
        to: ADMIN_NOTIFICATION_EMAIL,
        subject: `🔔 ${installmentLabel} Received: ${customerName} - ₹${paidAmount.toLocaleString('en-IN')} (${destination})`,
        html: adminEmailHtml,
        replyTo: customerEmail || undefined,
        attachments: [
          {
            filename: invoiceFileName,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      });
    } catch (adminEmailErr) {
      console.error('[Admin Email Error]:', adminEmailErr);
    }

    // 9. Send WhatsApp Notifications
    const origin =
      req.headers.get('origin') ||
      (req.headers.get('host') ? `http://${req.headers.get('host')}` : '') ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      'https://wanderphilia.com';

    const invoiceDownloadUrl = `${origin}/api/itinerary/invoice?id=${encodeURIComponent(itineraryId || itinerary?.id || '')}`;

    if (customerMobile) {
      const custMsg =
        `Hey *${customerName}*! 🌟\n\n` +
        `Your payment of *₹${paidAmount.toLocaleString('en-IN')}* (${installmentLabel}) for your *${destination}* luxury tour has been received successfully!\n\n` +
        `*Payment Summary:*\n` +
        `• *Invoice No:* ${invoiceNumber}\n` +
        `• *Type:* ${installmentLabel}\n` +
        `• *Paid Today:* ₹${paidAmount.toLocaleString('en-IN')}\n` +
        `• *Total Paid to Date:* ₹${newTotalPaid.toLocaleString('en-IN')} / ₹${totalQuotationAmount.toLocaleString('en-IN')}\n` +
        (newBalanceDue > 0 ? `• *Remaining Balance:* ₹${newBalanceDue.toLocaleString('en-IN')}\n` : `• *Status:* 100% Fully Paid & Cleared 🎉\n`) +
        `• *Payment ID:* ${razorpay_payment_id}\n\n` +
        `📄 *Download Your Official Invoice PDF:* \n${invoiceDownloadUrl}\n\n` +
        `A copy has also been sent to your email (${customerEmail || 'provided email'}). Our tour coordinator will connect with you on this number to assist with travel preparations. Thank you for choosing Wanderphilia! ✈️`;

      try {
        await sendWhatsApp({
          to: customerMobile,
          message: custMsg,
          documentUrl: invoiceDownloadUrl,
          documentFileName: invoiceFileName,
        });
      } catch (waErr) {
        console.error('[WhatsApp Customer Error]:', waErr);
      }
    }

    // WhatsApp to Owner
    const ownerMsg =
      `💰 *New Payment Received via Itinerary!*\n\n` +
      `• *Customer:* ${customerName}\n` +
      `• *Destination:* ${destination}\n` +
      `• *Paid Today:* ₹${paidAmount.toLocaleString('en-IN')}\n` +
      `• *Total Paid to Date:* ₹${newTotalPaid.toLocaleString('en-IN')}\n` +
      `• *Type:* ${installmentLabel}\n` +
      `• *Remaining Balance:* ₹${newBalanceDue.toLocaleString('en-IN')}\n` +
      `• *Phone:* ${customerMobile || 'N/A'}\n` +
      `• *Email:* ${customerEmail || 'N/A'}\n` +
      `• *Invoice No:* ${invoiceNumber}\n` +
      `• *Zoho Lead ID:* ${zohoLeadId || 'N/A'}\n` +
      `• *Payment ID:* ${razorpay_payment_id}\n` +
      `• *Invoice Link:* ${invoiceDownloadUrl}`;

    try {
      await sendWhatsApp({
        to: '919217664099',
        message: ownerMsg,
        documentUrl: invoiceDownloadUrl,
        documentFileName: invoiceFileName,
      });
    } catch (waErr) {
      console.error('[WhatsApp Owner Error]:', waErr);
    }

    // 10. Return Response
    return NextResponse.json({
      success: true,
      message: 'Payment verified and invoice dispatched successfully.',
      invoiceNumber,
      invoiceBase64: pdfBuffer.toString('base64'),
      invoiceFileName,
      paidAmount,
      totalPaid: newTotalPaid,
      balanceDue: newBalanceDue,
      paymentStage,
      totalPackageAmount: totalQuotationAmount,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      zohoAttached: zohoAttachmentSuccess,
      zohoLeadId,
    });
  } catch (error: any) {
    console.error('[POST /api/itinerary/payment/verify Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
