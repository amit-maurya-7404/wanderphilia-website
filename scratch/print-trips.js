const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '../lib/data.ts'), 'utf8');

const tripsStartIndex = content.indexOf('export const trips');
const reviewsIndex = content.indexOf('export const reviews');

console.log('tripsStartIndex:', tripsStartIndex);
console.log('reviewsIndex:', reviewsIndex);

const tripsSection = content.substring(tripsStartIndex, reviewsIndex);

const blocks = tripsSection.split(/id:\s*'/);
console.log('Number of blocks:', blocks.length);
for (let i = 1; i < blocks.length; i++) {
  const block = blocks[i];
  const id = block.substring(0, block.indexOf("'"));
  
  const titleMatch = block.match(/title:\s*'([^']+)'/);
  const title = titleMatch ? titleMatch[1] : 'Unknown';
  
  const categoryMatch = block.match(/category:\s*'([^']+)'/);
  const category = categoryMatch ? categoryMatch[1] : 'Unknown';

  console.log(`ID: ${id} | Title: ${title} | Category: ${category}`);
}
