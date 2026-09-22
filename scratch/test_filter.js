const fs = require('fs');

function parseMonthIndex(str) {
  if (!str) return null;
  const s = str.toLowerCase().trim();
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  for (let i = 0; i < months.length; i++) {
    if (s.includes(months[i])) return i;
  }
  return null;
}

function isChristmasNewYearDate(rangeStr, defaultMonth) {
  if (!rangeStr || typeof rangeStr !== 'string') return false;
  const clean = rangeStr.replace(/\s*\([^)]*\)/g, '').trim();

  const isoMatches = clean.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatches) {
    const month = parseInt(isoMatches[2], 10);
    const day = parseInt(isoMatches[3], 10);
    if (month === 12 && day >= 1 && day <= 31) {
      return true;
    }
    return false;
  }

  const parts = clean.split(/\s*[-–—]\s*|\s+to\s+/i).map((s) => s.trim());
  const startPart = parts[0] || clean;
  const noOrdinals = startPart.replace(/(\d+)(st|nd|rd|th)\b/gi, '$1');
  const dayMatch = noOrdinals.match(/\b\d{1,2}\b/);
  if (!dayMatch) return false;
  const day = parseInt(dayMatch[0], 10);

  let monthIdx = null;
  const words = noOrdinals.match(/[a-zA-Z]+/g);
  if (words) {
    for (const w of words) {
      const m = parseMonthIndex(w);
      if (m !== null) {
        monthIdx = m;
        break;
      }
    }
  }

  if (monthIdx === null && parts.length > 1) {
    const endWords = parts[1].replace(/(\d+)(st|nd|rd|th)\b/gi, '$1').match(/[a-zA-Z]+/g);
    if (endWords) {
      for (const w of endWords) {
        const m = parseMonthIndex(w);
        if (m !== null) {
          monthIdx = m;
          break;
        }
      }
    }
  }

  if (monthIdx === null && defaultMonth) {
    monthIdx = parseMonthIndex(defaultMonth);
  }

  if (monthIdx === 11 && day >= 1 && day <= 31) {
    return true;
  }
  return false;
}

console.log('1st Dec - 5th Dec:', isChristmasNewYearDate('1st Dec - 5th Dec'));
console.log('5th - 10th Dec:', isChristmasNewYearDate('5th - 10th Dec'));
console.log('5th - 10th with defaultMonth December:', isChristmasNewYearDate('5th - 10th', 'December'));
console.log('12th Dec - 18th Dec:', isChristmasNewYearDate('12th Dec - 18th Dec'));
console.log('20th - 27th Dec:', isChristmasNewYearDate('20th - 27th Dec'));
console.log('25 Dec to 1 Jan:', isChristmasNewYearDate('25 Dec to 1 Jan'));
console.log('31st Dec - 5th Jan:', isChristmasNewYearDate('31st Dec - 5th Jan'));
console.log('2026-12-01:', isChristmasNewYearDate('2026-12-01'));
console.log('2026-11-30:', isChristmasNewYearDate('2026-11-30'));
