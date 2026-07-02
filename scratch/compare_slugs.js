const fs = require('fs');

const files = [
  "app/trips/[slug]/page.tsx",
  "app/trips/bhutan/[slug]/page.tsx",
  "app/trips/himachal/[slug]/page.tsx",
  "app/trips/sikkim/[slug]/page.tsx"
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf8');
    console.log(`--- ${f} ---`);
    console.log(`Length: ${content.length}`);
    console.log(`Lines: ${content.split('\n').length}`);
    console.log(`Snippet: ${content.substring(0, 150).replace(/\r?\n/g, ' ')}`);
  } else {
    console.log(`File not found: ${f}`);
  }
});
