import { NextRequest, NextResponse } from 'next/server';
import { getOperationsBookingById } from '@/lib/operations-db';
import { isAuthorizedOperationsRequest } from '@/lib/operations-auth';
import { generateVoucherPDFBuffer } from '@/lib/voucher-pdf';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const isAuth = isAuthorizedOperationsRequest(req);
    if (!isAuth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Valid Operations PIN session required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get('id') || searchParams.get('bookingId') || '';

    if (!bookingId) {
      return NextResponse.json({ success: false, error: 'Booking ID is required.' }, { status: 400 });
    }

    const booking = await getOperationsBookingById(bookingId);
    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking record not found.' }, { status: 404 });
    }

    const pdfBuffer = await generateVoucherPDFBuffer(booking);
    const cleanInq = (booking.inquiryId || 'WND').toUpperCase();
    const filename = `Wanderphilia-Confirmation-Voucher-${cleanInq}.pdf`;

    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error('[Voucher PDF Route Error]:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Error generating voucher PDF.' },
      { status: 500 }
    );
  }
}
