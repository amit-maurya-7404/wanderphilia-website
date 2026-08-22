const fs = require('fs');
const path = require('path');

const dirs = [
  'bali',
  'bhutan',
  'himachal',
  'kashmir',
  'leh-ladakh',
  'sikkim',
  'singapore',
  'spiti',
  'thailand',
  'vietnam'
];

dirs.forEach(dir => {
  const filePath = path.join(__dirname, '..', 'app', 'trips', dir, 'page.tsx');
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  console.log(`Processing: ${dir}`);

  // Replace line-clamp-4 with line-clamp-3
  if (content.includes("line-clamp-4")) {
    content = content.replace(/line-clamp-4/g, "line-clamp-3");
    console.log(`✅ Success: Changed line-clamp-4 to line-clamp-3 in ${dir}`);
  } else {
    console.log(`⚠️ Warning: line-clamp-4 not found in ${dir}`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
});
