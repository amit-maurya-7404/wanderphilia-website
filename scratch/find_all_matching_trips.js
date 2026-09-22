const fs = require('fs');

// We can read lib/data.ts and compile or extract trips data
const content = fs.readFileSync('./lib/data.ts', 'utf8');

// Function to extract trips roughly or let's use a quick TS bundle/eval
const ts = require('typescript');
const jsCode = ts.transpileModule(content, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText;

// evaluate the js code in a sandbox or module
const m = { exports: {} };
const fn = new Function('module', 'exports', 'require', jsCode);
try {
  fn(m, m.exports, (mod) => {
    if (mod === 'react') return {};
    return {};
  });
} catch(e) {
  console.log('Error evaluating data.ts:', e.message);
}

const trips = m.exports.trips || [];
console.log('Total trips loaded:', trips.length);

function isChristmasNewYearTrip(trip) {
  // Check batchDates
  if (trip.batchDates && Array.isArray(trip.batchDates)) {
    for (const b of trip.batchDates) {
      const month = b.month || '';
      if (Array.isArray(b.ranges)) {
        for (const range of b.ranges) {
          if (isDateInWindow(range, month)) {
            return { matched: true, range, month, source: 'batchDates' };
          }
        }
      }
    }
  }

  // Check dates array
  if (trip.dates && Array.isArray(trip.dates)) {
    for (const d of trip.dates) {
      if (d && d.startDate) {
        if (isDateInWindow(d.startDate, '')) {
          return { matched: true, range: d.startDate, source: 'dates' };
        }
      }
    }
  }

  return { matched: false };
}

function parseMonth(str) {
  if (!str) return null;
  const s = str.toLowerCase().trim();
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  for (let i = 0; i < months.length; i++) {
    if (s.includes(months[i])) return i;
  }
  return null;
}

function isDateInWindow(rangeStr, defaultMonth) {
  if (!rangeStr) return false;
  const clean = rangeStr.replace(/\s*\([^)]*\)/g, '').trim();

  // ISO format
  const isoMatch = clean.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const month = parseInt(isoMatch[2], 10);
    const day = parseInt(isoMatch[3], 10);
    if (month === 12 && day >= 18 && day <= 31) {
      return true;
    }
  }

  // Text range: "18th Dec - 24th Dec", "19th - 25th Dec" etc.
  const parts = clean.split(/\s*[-–—]\s*|\s+to\s+/i).map(s => s.trim());
  const startPart = parts[0] || clean;
  
  const noOrdinals = startPart.replace(/(\d+)(st|nd|rd|th)\b/gi, '$1');
  const dayMatch = noOrdinals.match(/\b\d{1,2}\b/);
  const day = dayMatch ? parseInt(dayMatch[0], 10) : null;
  
  let monthIdx = null;
  const words = noOrdinals.match(/[a-zA-Z]+/g);
  if (words) {
    for (const w of words) {
      const m = parseMonth(w);
      if (m !== null) {
        monthIdx = m;
        break;
      }
    }
  }
  if (monthIdx === null && defaultMonth) {
    monthIdx = parseMonth(defaultMonth);
  }

  if (monthIdx === 11 && day !== null && day >= 18 && day <= 31) {
    return true;
  }

  return false;
}

const matchedTrips = [];
for (const trip of trips) {
  const check = isChristmasNewYearTrip(trip);
  if (check.matched) {
    matchedTrips.push({ id: trip.id, title: trip.title, category: trip.category, check });
  }
}

console.log(`Matched trips (${matchedTrips.length}):`);
console.log(JSON.stringify(matchedTrips, null, 2));
