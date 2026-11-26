import { NextRequest, NextResponse } from 'next/server';
import { getOperationsBookingById, updateOperationsBooking } from '@/lib/operations-db';
import { isAuthorizedOperationsRequest } from '@/lib/operations-auth';
import { pushOperationsToZohoFinance } from '@/lib/zoho-booking-automation';
import { uploadProofUrlToZohoRecords } from '@/lib/zoho-attachments';

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

    // Merge live changes sent from operations page so manual transport cost, hotels, and experiences are strictly preserved
    const effectiveBooking: any = {
      ...booking,
      hotels: (Array.isArray(body.hotels) && body.hotels.length > 0) ? body.hotels : booking.hotels,
      transport: body.transport ? { ...booking.transport, ...body.transport } : booking.transport,
      dayActivities: (Array.isArray(body.dayActivities) && body.dayActivities.length > 0) ? body.dayActivities : booking.dayActivities,
      experiencesTotalCost: body.experiencesTotalCost !== undefined ? Number(body.experiencesTotalCost) : booking.experiencesTotalCost,
      experiencesListWithCost: body.experiencesListWithCost !== undefined ? String(body.experiencesListWithCost) : booking.experiencesListWithCost,
      extraAmountPaidByTransportVendor: body.extraAmountPaidByTransportVendor !== undefined ? Number(body.extraAmountPaidByTransportVendor) : booking.extraAmountPaidByTransportVendor,
      extraAmountDetails: body.extraAmountDetails !== undefined ? String(body.extraAmountDetails) : booking.extraAmountDetails,
    };
    if (body.transportCost !== undefined && effectiveBooking.transport) {
      effectiveBooking.transport.b2bTotalCost = Number(body.transportCost);
    }

    // Compulsory Proof Verification for Manual Cost Overrides
    const missingProofs: string[] = [];
    (effectiveBooking.hotels || []).forEach((h: any, idx: number) => {
      if (h.isManualCost && !h.proofUrl) {
        missingProofs.push(`Hotel: ${h.hotelName || h.city || `Hotel #${idx + 1}`}`);
      }
    });
    if (effectiveBooking.transport?.isManualCost && !effectiveBooking.transport.proofUrl) {
      missingProofs.push(`Transport: ${effectiveBooking.transport.vehicleType || 'Vehicle'}`);
    }
    (effectiveBooking.dayActivities || []).forEach((day: any, dIdx: number) => {
      (day.experiences || []).forEach((exp: any) => {
        const cost = typeof exp === 'object' ? Number(exp.cost || 0) : 0;
        const isManual = typeof exp === 'object' && Boolean(exp.isManualCost);
        const hasProof = typeof exp === 'object' && Boolean(exp.proofUrl);
        if (isManual && cost > 0 && !hasProof) {
          const name = typeof exp === 'object' ? (exp.name || exp.title || 'Experience') : String(exp);
          missingProofs.push(`Experience (Day ${day.dayNumber || dIdx + 1}): ${name}`);
        }
      });
    });

    if (missingProofs.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Mandatory Proof Required: Manual cost override detected without proof screenshot:\n• ${missingProofs.join('\n• ')}\nPlease upload all vendor rate screenshots / proof documents before syncing to Finance.`,
          missingProofs,
        },
        { status: 400 }
      );
    }

    // Call Zoho Finance Sync
    const syncRes = await pushOperationsToZohoFinance(effectiveBooking);

    if (!syncRes.success && !syncRes.financeId) {
      return NextResponse.json(
        {
          success: false,
          error: syncRes.error || 'Failed to sync record to Zoho CRM Finance module. Check logs.',
        },
        { status: 502 }
      );
    }

    // Upload all proofs (client payment + vendor proofs) as attachments to Booking (Deals) & Finance
    const dealId = booking.bookingId;
    const financeId = syncRes.financeId || booking.zohoFinanceId;
    const targets: Array<{ module: string; id: string }> = [];
    if (dealId) targets.push({ module: 'Deals', id: String(dealId) });
    if (financeId) targets.push({ module: 'Finance', id: String(financeId) });

    if (targets.length > 0) {
      try {
        // 1. Client payment proof
        if (effectiveBooking.paymentProofUrl) {
          await uploadProofUrlToZohoRecords(
            effectiveBooking.paymentProofUrl,
            `Client_Payment_Proof_${(effectiveBooking.customerName || 'Client').replace(/[^a-zA-Z0-9]/g, '_')}.jpg`,
            targets
          );
        }

        // 2. Hotel proofs
        for (const h of effectiveBooking.hotels || []) {
          if (h.proofUrl) {
            const hName = (h.hotelName || h.city || 'Hotel').replace(/[^a-zA-Z0-9]/g, '_');
            await uploadProofUrlToZohoRecords(
              h.proofUrl,
              `Hotel_Proof_${hName}.jpg`,
              targets
            );
          }
        }

        // 3. Transport proof
        if (effectiveBooking.transport?.proofUrl) {
          const tName = (effectiveBooking.transport.vendorName || effectiveBooking.transport.vehicleType || 'Transport').replace(/[^a-zA-Z0-9]/g, '_');
          await uploadProofUrlToZohoRecords(
            effectiveBooking.transport.proofUrl,
            `Transport_Proof_${tName}.jpg`,
            targets
          );
        }

        // 4. Experience proofs
        for (const day of effectiveBooking.dayActivities || []) {
          for (const exp of day.experiences || []) {
            if (typeof exp === 'object' && exp.proofUrl) {
              const expName = (exp.name || exp.title || 'Experience').replace(/[^a-zA-Z0-9]/g, '_');
              await uploadProofUrlToZohoRecords(
                exp.proofUrl,
                `Experience_Proof_${expName}.jpg`,
                targets
              );
            }
          }
        }
      } catch (attachErr) {
        console.warn('[Sync Finance Proofs Attachment Warning]:', attachErr);
      }
    }

    const now = new Date().toISOString();
    const updated = await updateOperationsBooking(booking.id, {
      ...effectiveBooking,
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
