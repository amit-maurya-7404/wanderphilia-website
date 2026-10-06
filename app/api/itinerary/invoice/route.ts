import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ItineraryDocument } from '@/types/itinerary';
import { generateInvoicePDFBuffer, InvoiceData } from '@/lib/invoice-generator';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id') || searchParams.get('itineraryId') || '';

    if (!id) {
      return NextResponse.json(
        { error: 'Please provide an itinerary ID parameter.' },
        { status: 400 }
      );
    }

    let itineraryData: ItineraryDocument | null = null;
    try {
      const db = await getDb();
      const collection = db.collection<ItineraryDocument>('itineraries');
      itineraryData = await collection.findOne({
        $or: [{ id: id }, { slug: id }]
      });
    } catch (dbErr) {
      console.error('[Invoice API DB notice]:', dbErr);
    }

    if (!itineraryData) {
      const { getManualItinerary, manualItineraryToDocument } = await import('@/data/manual-itineraries');
      const manual = getManualItinerary(id);
      if (manual) {
        itineraryData = manualItineraryToDocument(manual);
      }
    }

    if (!itineraryData) {
      return NextResponse.json(
        { error: `Itinerary not found for ID: ${id}` },
        { status: 404 }
      );
    }

    const itinerary = itineraryData;

    const totalQuotationAmount = Number(
      itinerary.finalQuotationAmount ??
      itinerary.rawZohoData?.finalQuotationAmount ??
      itinerary.rawZohoData?.Final_Quotation_Amount ??
      itinerary.rawZohoData?.Total_Package_Cost ??
      0
    );

    const advancePaid = Number(
      itinerary.advanceAmountPaid ??
      itinerary.rawZohoData?.Advance_Amount_Paid ??
      0
    );

    const balanceDue = Number(
      itinerary.balancePendingAmount ??
      itinerary.rawZohoData?.Balance_Pending_Amount ??
      Math.max(0, totalQuotationAmount - advancePaid)
    );

    const latestPayment = itinerary.payments && itinerary.payments.length > 0
      ? itinerary.payments[itinerary.payments.length - 1]
      : null;

    const invoiceNumber = String(
      latestPayment?.invoiceNumber ||
      itinerary.rawZohoData?.Invoice_Number ||
      `INV-WND-2026-${id.slice(-5).toUpperCase()}`
    );
    const invoiceDate = new Date(itinerary.updatedAt || new Date()).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const invoiceData: InvoiceData = {
      invoiceNumber,
      invoiceDate,
      paymentId: String(latestPayment?.paymentId || itinerary.rawZohoData?.Last_Payment_Id || 'PAY-VERIFIED'),
      orderId: String(latestPayment?.orderId || itinerary.rawZohoData?.Last_Order_Id || 'ORD-VERIFIED'),
      itineraryId: itinerary.id,
      inquiryId: itinerary.inquiryId,
      customerName: latestPayment?.customerName || itinerary.leadDetails?.name || itinerary.rawZohoData?.Full_Name || 'Aneesh',
      customerEmail: latestPayment?.customerEmail || itinerary.leadDetails?.email || itinerary.rawZohoData?.Email || '',
      customerMobile: latestPayment?.customerMobile || itinerary.leadDetails?.mobile || itinerary.rawZohoData?.Mobile || '',
      customerGstNo: latestPayment?.customerGstNo,
      customerPanNo: latestPayment?.customerPanNo,
      destination: itinerary.destination,
      tripTitle: itinerary.title,
      travelStartDate: itinerary.leadDetails?.startDate,
      travelEndDate: itinerary.leadDetails?.endDate,
      noOfDays: itinerary.noOfDays,
      noOfNights: itinerary.noOfNights,
      numberOfGuests: itinerary.leadDetails?.guests,
      adults: itinerary.adults,
      kids: itinerary.kids,
      vehicleType: itinerary.vehicleType,
      roomCategory: itinerary.roomCategory,
      paymentType: latestPayment?.paymentType || (advancePaid < totalQuotationAmount && advancePaid > 0 ? 'advance' : 'full'),
      totalPackageAmount: totalQuotationAmount,
      paidAmount: latestPayment?.amount || (advancePaid > 0 ? advancePaid : totalQuotationAmount),
      balanceDue,
      baseAmount: itinerary.baseAmount,
      gstPercentage: itinerary.gstPercentage,
      gstAmount: itinerary.gstAmount,
      tcsPercentage: itinerary.tcsPercentage,
      tcsAmount: itinerary.tcsAmount,
    };

    const pdfBuffer = await generateInvoicePDFBuffer(invoiceData);

    const safeInvoiceNum = invoiceNumber.replace(/[\/\\]/g, '_');

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Wanderphilia_Invoice_${safeInvoiceNum}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('[GET /api/itinerary/invoice Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}
