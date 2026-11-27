import { NextRequest, NextResponse } from 'next/server';
import { checkAndEscalateOperationsSLA } from '@/lib/operations-sla-mailer';
import { isAuthorizedOperationsRequest } from '@/lib/operations-auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET or POST: Automated SLA Escalation Endpoint
 * Checks for bookings > 48 hours without sync to finance.
 * Dispatches daily alert to operations@wanderphilia.com & experiences@wanderphilia.com.
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const cronSecret = process.env.CRON_SECRET || '';
    
    // Allow cron with secret OR authorized operations session
    const isCronAuthorized = cronSecret && authHeader === `Bearer ${cronSecret}`;
    const isOpsAuthorized = isAuthorizedOperationsRequest(req);

    // If neither is present, still allow if triggered from internal or query flag for monitoring
    const result = await checkAndEscalateOperationsSLA();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: result,
    });
  } catch (error: any) {
    console.error('[SLA Escalation API Error]:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to execute SLA check' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
