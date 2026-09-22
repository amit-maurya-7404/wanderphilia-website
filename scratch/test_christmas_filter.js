const fs = require('fs');
const ts = require('typescript');

const content = fs.readFileSync('./lib/christmas-filter.ts', 'utf8');
const jsCode = ts.transpileModule(content, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText;

const m = { exports: {} };
const fn = new Function('module', 'exports', 'require', jsCode);
fn(m, m.exports, require);

const { isChristmasNewYearDate, getChristmasNewYearTrips } = m.exports;

const testCases = [
  // Should MATCH (Dec 18 - Dec 31 start date)
  { range: '18th Dec - 24th Dec', month: 'December', expected: true },
  { range: '18 Dec - 23 Dec', month: '', expected: true },
  { range: '19th - 25th Dec', month: 'December', expected: true },
  { range: '20th Dec - 26th Dec', month: 'December', expected: true },
  { range: '22nd Dec - 28th Dec', month: 'December', expected: true },
  { range: '24th Dec - 30th Dec (Christmas Batch)', month: 'December', expected: true },
  { range: '25th Dec - 1st Jan', month: 'December', expected: true },
  { range: '26th Dec - 2nd Jan', month: 'December', expected: true },
  { range: '30th Dec - 5th Jan (New Year Special)', month: 'December', expected: true },
  { range: '31st Dec - 6th Jan', month: 'December', expected: true },
  { range: '2026-12-18', month: '', expected: true },
  { range: '2026-12-25', month: '', expected: true },
  { range: '2026-12-31', month: '', expected: true },
  
  // Should NOT MATCH (Before Dec 18 or other months)
  { range: '17th Dec - 23rd Dec', month: 'December', expected: false },
  { range: '12th - 19th Dec', month: 'December', expected: false },
  { range: '13th - 21st Dec', month: 'December', expected: false },
  { range: '5th Dec - 11th Dec', month: 'December', expected: false },
  { range: '3rd Dec - 11th Dec', month: 'December', expected: false },
  { range: '1st Jan - 7th Jan', month: 'January', expected: false },
  { range: '16th May - 21st May', month: 'May', expected: false },
  { range: '2026-12-17', month: '', expected: false },
  { range: '2026-11-25', month: '', expected: false },
  { range: '2027-01-01', month: '', expected: false }
];

let passed = 0;
let failed = 0;

for (const t of testCases) {
  const actual = isChristmasNewYearDate(t.range, t.month);
  if (actual === t.expected) {
    passed++;
    console.log(`PASS: "${t.range}" (month: "${t.month}") -> ${actual}`);
  } else {
    failed++;
    console.error(`FAIL: "${t.range}" (month: "${t.month}") -> Expected ${t.expected}, got ${actual}`);
  }
}

console.log(`\nResults: ${passed} passed, ${failed} failed out of ${testCases.length} tests.`);
if (failed > 0) process.exit(1);
