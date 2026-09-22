const fs = require('fs');

// Simple month parser
function parseMonth(str) {
  if (!str) return null;
  const s = str.toLowerCase().trim();
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  for (let i = 0; i < months.length; i++) {
    if (s.includes(months[i])) return i;
  }
  return null;
}

// Check if a range or date has a start date between Dec 18 and Dec 31
function isDateInChristmasNewYearWindow(rangeStr, defaultMonth) {
  if (!rangeStr) return false;
  
  // Clean string
  const clean = rangeStr.replace(/\s*\([^)]*\)/g, '').trim();

  // 1. ISO format: 2026-12-18 or similar
  const isoMatch = clean.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const month = parseInt(isoMatch[2], 10);
    const day = parseInt(isoMatch[3], 10);
    if (month === 12 && day >= 18 && day <= 31) {
      return true;
    }
  }

  // 2. Textual range e.g. "18th Dec - 25th Dec", "20th - 27th December", "25 Dec to 1 Jan"
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

  // December is month 11 (0-indexed) or month 12 (1-indexed)
  if (monthIdx === 11 && day !== null && day >= 18 && day <= 31) {
    return true;
  }

  return false;
}

// Test parsing on lib/data.ts
console.log('Testing Christmas/NY dates parser...');
console.log('18th Dec - 24th Dec:', isDateInChristmasNewYearWindow('18th Dec - 24th Dec', 'December'));
console.log('25th Dec - 1st Jan:', isDateInChristmasNewYearWindow('25th Dec - 1st Jan', 'December'));
console.log('20th - 26th Dec:', isDateInChristmasNewYearWindow('20th - 26th Dec', 'December'));
console.log('12th - 19th Dec:', isDateInChristmasNewYearWindow('12th - 19th Dec', 'December'));
console.log('5th Dec - 11th Dec:', isDateInChristmasNewYearWindow('5th Dec - 11th Dec', 'December'));
console.log('2026-12-25:', isDateInChristmasNewYearWindow('2026-12-25'));
console.log('2026-12-12:', isDateInChristmasNewYearWindow('2026-12-12'));
