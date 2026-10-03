import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getDb } from '@/lib/mongodb';
import { ItineraryDocument } from '@/types/itinerary';

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
      itineraryId,
      leadId,
      paymentType = 'advance', // 'advance' | 'full'
      customAmount,
      customerName,
      customerEmail,
      customerMobile,
      destination,
    } = body;

    if (!itineraryId) {
      return NextResponse.json(
        { error: 'itineraryId is required.' },
        { status: 400 }
      );
    }

    // Fetch itinerary to verify quotation amount
    const db = await getDb();
    const collection = db.collection<ItineraryDocument>('itineraries');
    const itinerary = await collection.findOne({
      $or: [{ id: itineraryId }, { slug: itineraryId }]
    });

    // Determine final quotation amount
    let totalQuotation = 0;
    if (itinerary) {
      totalQuotation = Number(
        itinerary.finalQuotationAmount ??
        itinerary.rawZohoData?.finalQuotationAmount ??
        itinerary.rawZohoData?.Final_Quotation_Amount ??
        itinerary.rawZohoData?.Total_Package_Cost ??
        itinerary.rawZohoData?.Quotation_Amount ??
        0
      );
    }

    if (totalQuotation === 0 && customAmount) {
      totalQuotation = Number(customAmount);
    }

    if (totalQuotation <= 0) {
      return NextResponse.json(
        { error: 'Quotation amount is not available for this itinerary.' },
        { status: 400 }
      );
    }

    // Calculate amount to charge (in INR)
    let payableAmount = 0;
    if (paymentType === 'advance') {
      payableAmount = Math.round(totalQuotation * 0.5); // 50% Advance
    } else {
      payableAmount = totalQuotation; // 100% Full Payment
    }

    if (payableAmount < 1) {
      return NextResponse.json(
        { error: 'Invalid payable amount calculated.' },
        { status: 400 }
      );
    }

    const razorpayKeyId =
      process.env.RAZORPAY_ITINERARY_KEY_ID ||
      process.env.NEXT_PUBLIC_RAZORPAY_ITINERARY_KEY_ID ||
      process.env.RAZORPAY_KEY_ID ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const razorpayKeySecret =
      process.env.RAZORPAY_ITINERARY_KEY_SECRET ||
      process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('Razorpay keys are missing from environment variables.');
      return NextResponse.json(
        { error: 'Razorpay keys are not configured on server.' },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });

    // Receipt ID <= 40 chars
    const cleanId = String(itineraryId).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
    const timestamp = Date.now().toString().slice(-6);
    const receiptId = `rcpt_${cleanId}_${timestamp}`.slice(0, 40);

    const order = await razorpay.orders.create({
      amount: Math.round(payableAmount * 100), // amount in paise
      currency: 'INR',
      receipt: receiptId,
      notes: {
        itineraryId: String(itineraryId),
        leadId: String(leadId || itinerary?.inquiryId || itinerary?.rawZohoData?.id || ''),
        paymentType: String(paymentType),
        totalPackageAmount: String(totalQuotation),
        payableAmount: String(payableAmount),
        customerName: String(customerName || itinerary?.leadDetails?.name || ''),
        customerEmail: String(customerEmail || itinerary?.leadDetails?.email || ''),
        customerMobile: String(customerMobile || itinerary?.leadDetails?.mobile || ''),
        destination: String(destination || itinerary?.destination || ''),
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: payableAmount,
      amountPaise: order.amount,
      currency: order.currency,
      keyId: razorpayKeyId,
      paymentType,
      totalQuotation,
      payableAmount,
      balanceDue: Math.max(0, totalQuotation - payableAmount),
      itineraryId,
    });
  } catch (error: any) {
    console.error('[POST /api/itinerary/payment/order Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create Razorpay order' },
      { status: 500 }
    );
  }
}
