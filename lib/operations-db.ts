import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as path from 'path';
import { OperationsBooking, OperationsSummaryStats, OperationsStatus } from '@/types/operations';
import { getDb } from '@/lib/mongodb';

const LOCAL_OPS_DB_PATH = path.join(process.cwd(), 'data', 'operations-bookings.json');

/**
 * Ensures local JSON file exists as mirror / fallback
 */
async function ensureLocalOpsDb() {
  const dir = path.dirname(LOCAL_OPS_DB_PATH);
  if (!fs.existsSync(dir)) {
    await fsPromises.mkdir(dir, { recursive: true });
  }
  if (!fs.existsSync(LOCAL_OPS_DB_PATH)) {
    await fsPromises.writeFile(LOCAL_OPS_DB_PATH, JSON.stringify([], null, 2), 'utf8');
  }
}

/**
 * Reads local JSON fallback
 */
async function readLocalOpsDb(): Promise<OperationsBooking[]> {
  await ensureLocalOpsDb();
  try {
    const raw = await fsPromises.readFile(LOCAL_OPS_DB_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('[Local Ops DB Read Error]:', err);
    return [];
  }
}

/**
 * Writes local JSON fallback
 */
async function writeLocalOpsDb(data: OperationsBooking[]): Promise<void> {
  await ensureLocalOpsDb();
  try {
    await fsPromises.writeFile(LOCAL_OPS_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('[Local Ops DB Write Error]:', err);
  }
}

export function ensureValidTransportCost(b: OperationsBooking): OperationsBooking {
  return b;
}

/**
 * Fetch all operations bookings with optional filtering and search
 */
export async function getAllOperationsBookings(
  statusFilter?: string,
  searchQuery?: string
): Promise<OperationsBooking[]> {
  let mongoList: OperationsBooking[] = [];
  let localList: OperationsBooking[] = [];

  try {
    const db = await getDb();
    const collection = db.collection<OperationsBooking>('operations_bookings');
    mongoList = await collection.find({}).sort({ updatedAt: -1 }).toArray();
  } catch (mongoErr) {
    console.warn('[MongoDB Ops Query Fallback to Local]:', mongoErr);
  }

  try {
    localList = await readLocalOpsDb();
  } catch (localErr) {
    console.warn('[Local Ops DB Query Error]:', localErr);
  }

  // Merge MongoDB and Local records by unique booking key (id, inquiryId, bookingId)
  const bookingMap = new Map<string, OperationsBooking>();

  const getRecordKey = (b: OperationsBooking) => (b.id || b.inquiryId || b.bookingId || '').trim();

  // Populate from local list first
  localList.forEach(b => {
    const key = getRecordKey(b);
    if (key) bookingMap.set(key, b);
  });

  // Merge MongoDB records (prefer whichever record has the latest updatedAt)
  mongoList.forEach(b => {
    const key = getRecordKey(b);
    if (key) {
      const existing = bookingMap.get(key);
      if (!existing) {
        bookingMap.set(key, b);
      } else {
        const timeMongo = new Date(b.updatedAt || 0).getTime();
        const timeLocal = new Date(existing.updatedAt || 0).getTime();
        if (timeMongo >= timeLocal) {
          bookingMap.set(key, b);
        }
      }
    }
  });

  let list = Array.from(bookingMap.values());

  // Apply Status Filter
  if (statusFilter && statusFilter !== 'all') {
    list = list.filter(b => b.opsStatus === statusFilter);
  }

  // Apply Search Query
  if (searchQuery && searchQuery.trim().length > 0) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(b => {
      return (
        (b.customerName && b.customerName.toLowerCase().includes(q)) ||
        (b.inquiryId && b.inquiryId.toLowerCase().includes(q)) ||
        (b.bookingId && b.bookingId.toLowerCase().includes(q)) ||
        (b.destination && b.destination.toLowerCase().includes(q)) ||
        (b.customerMobile && b.customerMobile.includes(q)) ||
        (b.customerEmail && b.customerEmail.toLowerCase().includes(q)) ||
        (b.utrNumber && b.utrNumber.toLowerCase().includes(q))
      );
    });
  }

  // Ensure valid transport costs
  const mappedList = list.map(ensureValidTransportCost);

  // Sort descending by updatedAt
  return mappedList.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

/**
 * Get single operations booking by ID or Inquiry ID
 */
export async function getOperationsBookingById(id: string): Promise<OperationsBooking | null> {
  if (!id) return null;
  const cleanId = id.trim();

  try {
    const db = await getDb();
    const collection = db.collection<OperationsBooking>('operations_bookings');
    const doc = await collection.findOne({
      $or: [
        { id: cleanId },
        { inquiryId: cleanId },
        { bookingId: cleanId },
        { zohoLeadId: cleanId }
      ]
    });
    if (doc) return ensureValidTransportCost(doc);
  } catch (mongoErr) {
    console.warn('[MongoDB Ops Find Error, using local fallback]:', mongoErr);
  }

  // Fallback to local
  const localList = await readLocalOpsDb();
  const match = localList.find(
    b =>
      b.id === cleanId ||
      b.inquiryId === cleanId ||
      b.bookingId === cleanId ||
      b.zohoLeadId === cleanId
  );
  return match ? ensureValidTransportCost(match) : null;
}

/**
 * Save new or update full operations booking
 */
export async function saveOperationsBooking(booking: OperationsBooking): Promise<OperationsBooking> {
  const now = new Date().toISOString();
  booking.updatedAt = now;
  if (!booking.createdAt) booking.createdAt = now;

  // 1. Calculate live margins before saving
  const hotelTotal = (booking.hotels || []).reduce((sum, h) => sum + (Number(h.b2bTotalCost) || 0), 0);
  const transportTotal = Number(booking.transport?.b2bTotalCost) || 0;
  
  let experiencesTotal = 0;
  if (Array.isArray(booking.dayActivities)) {
    booking.dayActivities.forEach((day: any) => {
      if (Array.isArray(day?.experiences)) {
        day.experiences.forEach((exp: any) => {
          if (typeof exp === 'object' && exp !== null) {
            const payer = exp.paidBy || 'wanderphilia';
            if (payer === 'wanderphilia') {
              experiencesTotal += Number(exp.cost) || 0;
            }
          }
        });
      }
    });
  }

  const totalB2B = hotelTotal + transportTotal + experiencesTotal;
  const revenue = Number(booking.totalQuotationAmount) || 0;
  const marginAmt = revenue - totalB2B;
  const marginPct = revenue > 0 ? Math.round((marginAmt / revenue) * 100) : 0;

  booking.totalB2BHotelCost = hotelTotal;
  booking.totalB2BTransportCost = transportTotal;
  booking.totalB2BCost = totalB2B;
  booking.grossMarginAmount = marginAmt;
  booking.grossMarginPercentage = marginPct;

  // 2. Try MongoDB
  try {
    const db = await getDb();
    const collection = db.collection<OperationsBooking>('operations_bookings');

    // Extract _id to prevent immutable _id errors
    const { _id, ...docWithoutId } = booking as any;

    const filterConditions: any[] = [];
    if (booking.id) filterConditions.push({ id: booking.id });
    if (booking.inquiryId) filterConditions.push({ inquiryId: booking.inquiryId });
    if (booking.bookingId) filterConditions.push({ bookingId: booking.bookingId });
    if (_id) filterConditions.push({ _id });

    const filter = filterConditions.length > 0 ? { $or: filterConditions } : { id: booking.id };

    await collection.updateOne(
      filter,
      { $set: docWithoutId },
      { upsert: true }
    );
  } catch (mongoErr) {
    console.warn('[MongoDB Save Ops Error, mirroring to local]:', mongoErr);
  }

  // 3. Always mirror to local file
  try {
    const localList = await readLocalOpsDb();
    const idx = localList.findIndex(b =>
      b.id === booking.id ||
      (booking.inquiryId && b.inquiryId === booking.inquiryId) ||
      (booking.bookingId && b.bookingId === booking.bookingId)
    );
    if (idx >= 0) {
      localList[idx] = booking;
    } else {
      localList.unshift(booking);
    }
    await writeLocalOpsDb(localList);
  } catch (localErr) {
    console.error('[Local Ops DB Mirror Error]:', localErr);
  }

  return booking;
}

/**
 * Patch partial fields in an existing operations booking
 */
export async function updateOperationsBooking(
  id: string,
  updates: Partial<OperationsBooking>
): Promise<OperationsBooking | null> {
  let existing = await getOperationsBookingById(id);
  if (!existing && updates.id) {
    existing = await getOperationsBookingById(updates.id);
  }
  if (!existing && updates.inquiryId) {
    existing = await getOperationsBookingById(updates.inquiryId);
  }
  if (!existing && updates.bookingId) {
    existing = await getOperationsBookingById(updates.bookingId);
  }
  if (!existing) return null;

  const merged: OperationsBooking = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return await saveOperationsBooking(merged);
}

/**
 * Computes high-level summary metrics for Operations Dashboard
 */
export async function getOperationsStats(): Promise<OperationsSummaryStats> {
  const allBookings = await getAllOperationsBookings('all');

  let totalClientRevenue = 0;
  let totalB2BCost = 0;

  const stats: OperationsSummaryStats = {
    totalBookings: allBookings.length,
    pendingOps: 0,
    inProgress: 0,
    issues: 0,
    confirmed: 0,
    syncedToFinance: 0,
    totalClientRevenue: 0,
    totalB2BCost: 0,
    totalProjectedProfit: 0,
  };

  allBookings.forEach(b => {
    switch (b.opsStatus) {
      case 'pending_ops':
        stats.pendingOps++;
        break;
      case 'in_progress':
        stats.inProgress++;
        break;
      case 'issue':
        stats.issues++;
        break;
      case 'ops_confirmed':
        stats.confirmed++;
        break;
      case 'synced_to_finance':
        stats.syncedToFinance++;
        break;
    }

    totalClientRevenue += Number(b.totalQuotationAmount) || 0;
    totalB2BCost += Number(b.totalB2BCost) || 0;
  });

  stats.totalClientRevenue = totalClientRevenue;
  stats.totalB2BCost = totalB2BCost;
  stats.totalProjectedProfit = totalClientRevenue - totalB2BCost;

  return stats;
}
