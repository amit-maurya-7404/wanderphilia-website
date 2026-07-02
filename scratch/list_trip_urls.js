const fs = require('fs');

// Simple regex parser to extract slugs and titles from the large lib/data.ts file
const content = fs.readFileSync('lib/data.ts', 'utf8');

// Match trips array block
const tripsMatch = content.match(/export const trips: Trip\[\] = \[([\s\S]*?)\];/);
if (!tripsMatch) {
  console.log("Could not find trips array.");
  process.exit(0);
}

const tripsBlock = tripsMatch[1];
const tripRegex = /title:\s*'([^']+)'[\s\S]*?slug:\s*'([^']+)'[\s\S]*?category:\s*'([^']+)'/g;

const urls = [];
let match;
while ((match = tripRegex.exec(tripsBlock)) !== null) {
  const title = match[1];
  const slug = match[2];
  const categoryRaw = match[3];
  
  // Normalize category to get destination folder slug
  const categoryId = categoryRaw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '-');
  
  // We need to check if the specific category has a slug folder (like app/trips/sikkim/[slug]/page.tsx)
  const categorySlugDir = `app/trips/${categoryId}/[slug]`;
  const exists = fs.existsSync(categorySlugDir);
  
  const urlPath = exists ? `/trips/${categoryId}/${slug}` : `/trips/${slug}`;
  urls.push({ title, url: `https://wanderphilia.com${urlPath}` });
}

console.log(JSON.stringify(urls, null, 2));
