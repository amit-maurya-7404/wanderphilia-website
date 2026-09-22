import type { Trip } from './data'

/**
 * Normalizes month names to a 0-11 index
 */
function parseMonthIndex(str: string): number | null {
  if (!str) return null
  const s = str.toLowerCase().trim()
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
  for (let i = 0; i < months.length; i++) {
    if (s.includes(months[i])) return i
  }
  return null
}

/**
 * Checks if a given date string or date range string has a START DATE between
 * 1st December and 31st December (inclusive).
 *
 * Supported formats:
 * - ISO date: "2026-12-25", "2026-12-18", "2026-12-01"
 * - Range format: "1st Dec - 7th Dec", "18th Dec - 24th Dec", "20th - 27th December", "25 Dec to 1 Jan", "30th Dec - 5th Jan"
 * - Month context range: "1st - 8th", "18th - 25th" with defaultMonth = "December"
 */
export function isChristmasNewYearDate(rangeStr: string, defaultMonth?: string): boolean {
  if (!rangeStr || typeof rangeStr !== 'string') return false

  // Remove notes in parentheses, e.g. "(Christmas Batch)", "(New Year Special)"
  const clean = rangeStr.replace(/\s*\([^)]*\)/g, '').trim()

  // 1. ISO format check (e.g. 2026-12-01 or 2026-12-25)
  const isoMatches = clean.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (isoMatches) {
    const month = parseInt(isoMatches[2], 10)
    const day = parseInt(isoMatches[3], 10)
    // 12 is December (1-indexed)
    if (month === 12 && day >= 1 && day <= 31) {
      return true
    }
    // If it's an ISO date string for another month, return false
    return false
  }

  // 2. Textual range split by dash / "to"
  const parts = clean.split(/\s*[-–—]\s*|\s+to\s+/i).map((s) => s.trim())
  const startPart = parts[0] || clean

  // Strip ordinals (1st, 2nd, 3rd, 4th, 18th, 25th...)
  const noOrdinals = startPart.replace(/(\d+)(st|nd|rd|th)\b/gi, '$1')

  // Extract day number
  const dayMatch = noOrdinals.match(/\b\d{1,2}\b/)
  if (!dayMatch) return false
  const day = parseInt(dayMatch[0], 10)

  // Extract month from startPart or fall back to defaultMonth or endPart
  let monthIdx: number | null = null
  const words = noOrdinals.match(/[a-zA-Z]+/g)
  if (words) {
    for (const w of words) {
      const m = parseMonthIndex(w)
      if (m !== null) {
        monthIdx = m
        break
      }
    }
  }

  // If start part didn't have month name (e.g. "1st - 8th Dec" or "18th - 25th Dec"), check endPart or defaultMonth
  if (monthIdx === null && parts.length > 1) {
    const endWords = parts[1].replace(/(\d+)(st|nd|rd|th)\b/gi, '$1').match(/[a-zA-Z]+/g)
    if (endWords) {
      for (const w of endWords) {
        const m = parseMonthIndex(w)
        if (m !== null) {
          monthIdx = m
          break
        }
      }
    }
  }

  if (monthIdx === null && defaultMonth) {
    monthIdx = parseMonthIndex(defaultMonth)
  }

  // 11 is December (0-indexed)
  if (monthIdx === 11 && day >= 1 && day <= 31) {
    return true
  }

  return false
}

/**
 * Returns all matching Christmas/New Year date strings found for a trip
 */
export function getTripChristmasNewYearDates(trip: Trip): string[] {
  const matches: string[] = []

  // Check batchDates
  if (trip.batchDates && Array.isArray(trip.batchDates)) {
    for (const batch of trip.batchDates) {
      const month = batch.month || ''
      if (Array.isArray(batch.ranges)) {
        for (const range of batch.ranges) {
          if (isChristmasNewYearDate(range, month)) {
            matches.push(month ? `${range} (${month})` : range)
          }
        }
      }
    }
  }

  // Check explicit dates
  if (trip.dates && Array.isArray(trip.dates)) {
    for (const d of trip.dates) {
      if (d && d.startDate && isChristmasNewYearDate(d.startDate)) {
        matches.push(`${d.startDate}${d.endDate ? ` to ${d.endDate}` : ''}`)
      }
    }
  }

  return matches
}

/**
 * Filters an array of trips to only include those with at least one departure
 * starting between 1st December and 31st December.
 * Note: Does not mutate the original array or trips.
 */
export function getChristmasNewYearTrips(allTrips: Trip[]): Trip[] {
  if (!allTrips || !Array.isArray(allTrips)) return []

  return allTrips.filter((trip) => {
    // 1. Check batchDates
    if (trip.batchDates && Array.isArray(trip.batchDates)) {
      for (const batch of trip.batchDates) {
        const month = batch.month || ''
        if (Array.isArray(batch.ranges)) {
          for (const range of batch.ranges) {
            if (isChristmasNewYearDate(range, month)) {
              return true
            }
          }
        }
      }
    }

    // 2. Check dates
    if (trip.dates && Array.isArray(trip.dates)) {
      for (const d of trip.dates) {
        if (d && d.startDate && isChristmasNewYearDate(d.startDate)) {
          return true
        }
      }
    }

    return false
  })
}
