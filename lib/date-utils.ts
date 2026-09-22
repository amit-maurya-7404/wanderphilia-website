const BATCH_MONTH_MAP: Record<string, number> = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
};

function parseMonthText(str: string): number | null {
  if (!str) return null;
  const cleaned = str.trim().toLowerCase().replace(/[^a-z]/g, '');
  if (cleaned in BATCH_MONTH_MAP) {
    return BATCH_MONTH_MAP[cleaned];
  }
  for (const [key, val] of Object.entries(BATCH_MONTH_MAP)) {
    if (cleaned.startsWith(key) || key.startsWith(cleaned)) {
      return val;
    }
  }
  return null;
}

export function parseBatchDateRange(
  rangeStr: string,
  defaultMonth?: string,
  fallbackYear = new Date().getFullYear()
): { startDate: Date; endDate: Date } | null {
  if (!rangeStr || typeof rangeStr !== 'string') return null;

  // Remove parenthetical labels like "( Eid Holiday )", "( Ganesh Chaturthi Holiday )"
  const cleanStr = rangeStr.replace(/\s*\([^)]*\)/g, '').trim();

  // 1. Check for standard ISO format e.g. "2026-05-16 - 2026-05-21" or "2026-05-16"
  const isoMatches = cleanStr.match(/\d{4}-\d{2}-\d{2}/g);
  if (isoMatches && isoMatches.length > 0) {
    const start = new Date(isoMatches[0] + 'T00:00:00');
    const end = isoMatches.length > 1 ? new Date(isoMatches[1] + 'T23:59:59') : new Date(isoMatches[0] + 'T23:59:59');
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      return { startDate: start, endDate: end };
    }
  }

  // 2. Split into start and end parts
  const parts = cleanStr.split(/\s*[-–—]\s*|\s+to\s+/i).map((s) => s.trim());
  if (parts.length === 0 || !parts[0]) return null;

  const startPart = parts[0];
  const endPart = parts.length > 1 ? parts[1] : parts[0];

  // Extract explicit 4-digit year if present in range string
  const yearMatch = cleanStr.match(/\b(20\d{2})\b/);
  const baseYear = yearMatch ? parseInt(yearMatch[1], 10) : fallbackYear;

  const defaultMonthIdx = defaultMonth ? parseMonthText(defaultMonth) : null;

  const extractDayAndMonth = (part: string, fallbackMonthIndex: number | null) => {
    const noOrdinals = part.replace(/(\d+)(st|nd|rd|th)\b/gi, '$1');
    const dayMatch = noOrdinals.match(/\b\d{1,2}\b/);
    const day = dayMatch ? parseInt(dayMatch[0], 10) : 1;

    const alphaMatch = noOrdinals.match(/[a-zA-Z]+/g);
    let monthIdx: number | null = null;
    if (alphaMatch) {
      for (const word of alphaMatch) {
        const m = parseMonthText(word);
        if (m !== null) {
          monthIdx = m;
          break;
        }
      }
    }

    if (monthIdx === null) {
      monthIdx = fallbackMonthIndex;
    }

    return { day, monthIdx };
  };

  const endInfo = extractDayAndMonth(endPart, defaultMonthIdx);
  const startInfo = extractDayAndMonth(startPart, endInfo.monthIdx ?? defaultMonthIdx);

  if (startInfo.monthIdx === null && endInfo.monthIdx !== null) {
    startInfo.monthIdx = endInfo.monthIdx;
  }
  if (endInfo.monthIdx === null && startInfo.monthIdx !== null) {
    endInfo.monthIdx = startInfo.monthIdx;
  }

  if (startInfo.monthIdx === null) {
    return null;
  }

  const startMonth = startInfo.monthIdx;
  const endMonth = endInfo.monthIdx ?? startMonth;
  const startDay = Math.min(31, Math.max(1, startInfo.day));
  const endDay = Math.min(31, Math.max(1, endInfo.day));

  let startYear = baseYear;
  let endYear = baseYear;

  // Year wrap-around if start is Dec and end is Jan
  if (startMonth === 11 && endMonth === 0) {
    endYear = startYear + 1;
  }

  const startDate = new Date(startYear, startMonth, startDay, 0, 0, 0, 0);
  const endDate = new Date(endYear, endMonth, endDay, 23, 59, 59, 999);

  return { startDate, endDate };
}

export function isBatchDateUpcoming(
  rangeStr: string,
  defaultMonth?: string,
  referenceDate = new Date()
): boolean {
  const today = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
    0, 0, 0, 0
  );

  const parsed = parseBatchDateRange(rangeStr, defaultMonth, referenceDate.getFullYear());
  if (!parsed) return true;

  // A batch is upcoming if its start date is today or later
  return parsed.startDate.getTime() >= today.getTime();
}

export function getUpcomingBatchDates(
  batchDates?: { month: string; ranges: string[] }[],
  referenceDate = new Date()
): { month: string; ranges: string[] }[] {
  if (!batchDates || !Array.isArray(batchDates)) return [];

  const result: { month: string; ranges: string[] }[] = [];

  for (const batch of batchDates) {
    if (!batch || !Array.isArray(batch.ranges)) continue;

    const upcomingRanges = batch.ranges.filter((range) =>
      isBatchDateUpcoming(range, batch.month, referenceDate)
    );

    if (upcomingRanges.length > 0) {
      result.push({
        month: batch.month,
        ranges: upcomingRanges,
      });
    }
  }

  return result;
}

export function getUpcomingTripDates(
  dates?: { startDate: string; endDate: string; spots: number }[],
  referenceDate = new Date()
): { startDate: string; endDate: string; spots: number }[] {
  if (!dates || !Array.isArray(dates)) return [];

  const todayStr = `${referenceDate.getFullYear()}-${String(referenceDate.getMonth() + 1).padStart(2, '0')}-${String(referenceDate.getDate()).padStart(2, '0')}`;

  return dates.filter((d) => d && d.startDate && d.startDate >= todayStr);
}
