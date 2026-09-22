const fs = require('fs');
const ts = require('typescript');

const content = fs.readFileSync('./lib/data.ts', 'utf8');
const jsCode = ts.transpileModule(content, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText;

const m = { exports: {} };
const fn = new Function('module', 'exports', 'require', jsCode);
fn(m, m.exports, (mod) => ({}));

const trips = m.exports.trips || [];
console.log('--- ALL BATCH DATES IN ALL TRIPS ---');
const allBatchDates = [];
const allDates = [];

trips.forEach(t => {
  if (t.batchDates) {
    t.batchDates.forEach(b => {
      if (b.ranges) {
        b.ranges.forEach(r => allBatchDates.push({ tripId: t.id, month: b.month, range: r }));
      }
    });
  }
  if (t.dates) {
    t.dates.forEach(d => {
      allDates.push({ tripId: t.id, startDate: d.startDate, endDate: d.endDate });
    });
  }
});

console.log('Total batch date entries:', allBatchDates.length);
console.log('Sample batch dates:', allBatchDates.slice(0, 15));
console.log('Total explicit dates entries:', allDates.length);
console.log('Sample explicit dates:', allDates.slice(0, 10));

// Let's also check all December batch dates across all trips
const decBatchDates = allBatchDates.filter(b => (b.month && b.month.toLowerCase().includes('dec')) || (b.range && b.range.toLowerCase().includes('dec')));
console.log('All December batch dates:', decBatchDates);
