import { NextRequest, NextResponse } from 'next/server';
import { getOperationsBookingById, updateOperationsBooking } from '@/lib/operations-db';
import { isAuthorizedOperationsRequest } from '@/lib/operations-auth';
import { pushOperationsToZohoFinance } from '@/lib/zoho-booking-automation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    if (!isAuthorizedOperationsRequest(req)) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json({ success: false, error: 'Booking ID is required.' }, { status: 400 });
    }

    const booking = await getOperationsBookingById(bookingId);
    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking record not found.' }, { status: 404 });
    }

    // Call Zoho Finance Sync
    const syncRes = await pushOperationsToZohoFinance(booking);

    if (!syncRes.success && !syncRes.financeId) {
      return NextResponse.json(
        {
          success: false,
          error: syncRes.error || 'Failed to sync record to Zoho CRM Finance module. Check logs.',
        },
        { status: 502 }
      );
    }

    const now = new Date().toISOString();
    const updated = await updateOperationsBooking(booking.id, {
      opsStatus: 'synced_to_finance',
      zohoFinanceId: syncRes.financeId || booking.zohoFinanceId,
      syncedToFinanceAt: now,
      financeSyncResponse: syncRes,
    });

    return NextResponse.json({
      success: true,
      message: 'Booking details successfully pushed to Zoho CRM Finance module!',
      financeId: syncRes.financeId,
      booking: updated,
    });
  } catch (error: any) {
    console.error('[Operations Sync Finance Route Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error during finance sync.' },
      { status: 500 }
    );
  }
}
