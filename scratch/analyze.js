const fs = require('fs');
const content = fs.readFileSync('lib/data.ts', 'utf8');
console.log('Length:', content.length);
// Find occurrences of "Overnight"
let pos = 0;
let count = 0;
while ((pos = content.indexOf('Overnight', pos)) !== -1) {
  count++;
  if (count <= 10) {
    const start = Math.max(0, pos - 50);
    const end = Math.min(content.length, pos + 50);
    console.log(`Match ${count}: ${content.substring(start, end).replace(/\r?\n/g, ' ')}`);
  }
  pos += 9;
}
console.log('Total matches of "Overnight":', count);
