import fs from 'fs';
import path from 'path';
import { getDb } from '@/lib/mongodb';

const SEQUENCE_FILE = path.join(process.cwd(), 'data', 'manual-sequence.json');

/**
 * Retrieves and increments the persistent sequential counter for manual itineraries.
 * First attempts atomic increment in MongoDB 'counters' collection.
 * Falls back safely to 'data/manual-sequence.json' on local or file-based environments.
 */
export async function getNextManualItinerarySequence(): Promise<number> {
  // 1. Try MongoDB atomic increment if available
  try {
    const db = await getDb();
    if (db) {
      const counterCollection = db.collection('counters');
      const result = await counterCollection.findOneAndUpdate(
        { _id: 'manual_itinerary_sequence' as any },
        { $inc: { seq: 1 } },
        { upsert: true, returnDocument: 'after' }
      );
      const seqVal = (result as any)?.value?.seq ?? (result as any)?.seq;
      if (typeof seqVal === 'number' && seqVal > 0) {
        try {
          fs.writeFileSync(SEQUENCE_FILE, JSON.stringify({ lastSequence: seqVal }, null, 2), 'utf-8');
        } catch {}
        return seqVal;
      }
    }
  } catch {
    // MongoDB unavailable or running in offline mode, fall back to file
  }

  // 2. File-based fallback counter
  try {
    let current = 0;
    if (fs.existsSync(SEQUENCE_FILE)) {
      const data = JSON.parse(fs.readFileSync(SEQUENCE_FILE, 'utf-8'));
      current = Number(data.lastSequence) || 0;
    }
    const next = current + 1;
    fs.writeFileSync(SEQUENCE_FILE, JSON.stringify({ lastSequence: next }, null, 2), 'utf-8');
    return next;
  } catch {
    return Math.floor((Date.now() - 1700000000000) / 1000);
  }
}

/**
 * Formats a clean, collision-free, human-readable sequential manual itinerary ID / slug.
 * Examples:
 * - Lead Name "Heer", Option 1: "heer-001"
 * - Lead Name "Heer", Option 2: "heer-opt2-001"
 * - Lead Name "Amit", Option 1: "amit-002"
 * - No Lead Name, Destination "Spiti": "spiti-003"
 * - Fallback: "man-004"
 */
export function formatSequentialManualId({
  sequence,
  leadName,
  optionNumber,
  destination
}: {
  sequence: number;
  leadName?: string;
  optionNumber?: number;
  destination?: string;
}): string {
  const seqPadded = String(sequence).padStart(3, '0');

  let nameSlug = '';
  if (leadName) {
    nameSlug = String(leadName)
      .replace(/^(Mr\.|Mr|Mrs\.|Mrs|Ms\.|Ms|Dr\.|Dr|Shri)\s+/i, '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (nameSlug.length > 20) {
      nameSlug = nameSlug.slice(0, 20).replace(/-+$/, '');
    }
  }

  const optPart = optionNumber && optionNumber > 1 ? `-opt${optionNumber}` : '';

  if (nameSlug) {
    return `${nameSlug}${optPart}-${seqPadded}`;
  }

  if (destination) {
    const destSlug = String(destination)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 15)
      .replace(/^-+|-+$/g, '');
    return `${destSlug}${optPart}-${seqPadded}`;
  }

  return `man${optPart}-${seqPadded}`;
}
