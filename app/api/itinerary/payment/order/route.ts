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

    // Fetch itinerary from DB or manual catalog to strictly verify quotation amount on server
    const db = await getDb();
    const collection = db.collection<ItineraryDocument>('itineraries');
    const itinerary = await collection.findOne({
      $or: [{ id: itineraryId }, { slug: itineraryId }]
    });

    // Determine final quotation amount from server records ONLY
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

    if (totalQuotation === 0) {
      const { getManualItinerary } = await import('@/data/manual-itineraries');
      const manual = getManualItinerary(itineraryId);
      if (manual && manual.finalQuotationAmount) {
        totalQuotation = Number(manual.finalQuotationAmount);
      }
    }

    if (totalQuotation <= 0) {
      return NextResponse.json(
        { error: 'Valid quotation amount not found for this itinerary on server.' },
        { status: 400 }
      );
    }

    // Fetch current paid amount from itinerary
    const currentPaid = Number(
      itinerary?.advanceAmountPaid ??
      itinerary?.rawZohoData?.Advance_Amount_Paid ??
      itinerary?.rawZohoData?.advanceAmountPaid ??
      0
    );

    const tokenAmount = Math.round(totalQuotation * 0.1); // 10% Token
    const fiftyPercentAmount = Math.round(totalQuotation * 0.5); // 50% Total Advance
    const remainingAdvanceAmount = Math.max(0, fiftyPercentAmount - currentPaid); // 40% if 10% paid
    const remainingBalanceAmount = Math.max(0, totalQuotation - currentPaid); // Remaining balance

    // Calculate amount to charge (in INR)
    let payableAmount = 0;
    if (paymentType === 'token') {
      payableAmount = tokenAmount;
    } else if (paymentType === 'advance') {
      payableAmount = fiftyPercentAmount;
    } else if (paymentType === 'remaining_advance') {
      payableAmount = remainingAdvanceAmount;
    } else if (paymentType === 'remaining_balance' || paymentType === 'balance') {
      payableAmount = remainingBalanceAmount;
    } else {
      // 'full'
      payableAmount = currentPaid > 0 ? remainingBalanceAmount : totalQuotation;
    }

    if (payableAmount < 1) {
      return NextResponse.json(
        { error: 'No balance payable for this selected option or amount is already paid.' },
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
        customerGstNo: String(body.customerGstNo || body.gstNo || ''),
        customerPanNo: String(body.customerPanNo || body.panNo || ''),
        destination: String(destination || itinerary?.destination || ''),
      },
    });

    const totalPaidAfter = currentPaid + payableAmount;
    const balanceDueAfter = Math.max(0, totalQuotation - totalPaidAfter);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: payableAmount,
      amountPaise: order.amount,
      currency: order.currency,
      keyId: razorpayKeyId,
      paymentType,
      totalQuotation,
      currentPaid,
      payableAmount,
      totalPaidAfter,
      balanceDue: balanceDueAfter,
      balanceDueAfter,
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
