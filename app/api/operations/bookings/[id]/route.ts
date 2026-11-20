import { NextRequest, NextResponse } from 'next/server';
import { getOperationsBookingById, updateOperationsBooking } from '@/lib/operations-db';
import { isAuthorizedOperationsRequest } from '@/lib/operations-auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteProps) {
  try {
    if (!isAuthorizedOperationsRequest(req)) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
    }

    const { id } = await params;
    const booking = await getOperationsBookingById(id);

    if (!booking) {
      return NextResponse.json({ success: false, error: 'Operations booking not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error('[Operations Booking GET by ID Error]:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch booking.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteProps) {
  try {
    if (!isAuthorizedOperationsRequest(req)) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
    }

    const { id } = await params;
    const updates = await req.json().catch(() => null);

    if (!updates) {
      return NextResponse.json({ success: false, error: 'Missing updates payload.' }, { status: 400 });
    }

    const updated = await updateOperationsBooking(id, updates);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Booking not found or update failed.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Operations booking updated successfully.',
      booking: updated,
    });
  } catch (error) {
    console.error('[Operations Booking PATCH Error]:', error);
    return NextResponse.json({ success: false, error: 'Failed to update booking.' }, { status: 500 });
  }
}
