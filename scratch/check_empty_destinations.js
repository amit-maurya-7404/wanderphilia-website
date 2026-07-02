const fs = require('fs');
const path = require('path');

// Read trips from lib/data.ts
const content = fs.readFileSync('lib/data.ts', 'utf8');

// Match trips array block
const tripsMatch = content.match(/export const trips: Trip\[\] = \[([\s\S]*?)\];/);
if (!tripsMatch) {
  console.log("Could not find trips array.");
  process.exit(0);
}

const tripsBlock = tripsMatch[1];
const tripRegex = /category:\s*'([^']+)'/g;

const categoriesWithTrips = new Set();
let match;
while ((match = tripRegex.exec(tripsBlock)) !== null) {
  const categoryRaw = match[1];
  const categoryId = categoryRaw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '-');
  categoriesWithTrips.add(categoryId);
}

console.log("Categories with trips in data.ts:", Array.from(categoriesWithTrips));

// List directories in app/trips
const tripsDir = 'app/trips';
const items = fs.readdirSync(tripsDir);
const folders = items.filter(item => {
  const stat = fs.statSync(path.join(tripsDir, item));
  return stat.isDirectory() && item !== '[slug]';
});

console.log("\nFolders in app/trips:", folders);

const emptyFolders = folders.filter(folder => !categoriesWithTrips.has(folder));
const activeFolders = folders.filter(folder => categoriesWithTrips.has(folder));

console.log("\nEmpty Folders (No itineraries in data.ts):", emptyFolders);
console.log("Active Folders (Have itineraries in data.ts):", activeFolders);
