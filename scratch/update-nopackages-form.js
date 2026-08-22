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

  // 1. Add import (if not already added)
  if (!content.includes("import { NoPackagesCallbackForm }")) {
    content = content.replace(
      "import { DurationFilter } from '@/components/duration-filter'",
      "import { DurationFilter } from '@/components/duration-filter'\nimport { NoPackagesCallbackForm } from '@/components/no-packages-callback-form'"
    );
  }

  // 2. Replace the Packages Section "else" block
  // We use regular expression to match CRLF and LF newlines
  const regex = /\)\s*:\s*\(\r?\n\s*<div className="text-center py-16">\r?\n\s*<p className="text-xl text-slate-600">\r?\n\s*No packages found for this category\.\r?\n\s*<\/p>\r?\n\s*<\/div>\r?\n\s*\)/;

  if (regex.test(content)) {
    content = content.replace(
      regex,
      `) : (
            <div className="py-12">
              <NoPackagesCallbackForm
                nights={selectedDuration}
                destinationName={categoryName}
              />
            </div>
          )`
    );
    console.log(`✅ Success: Replaced no packages text with inline form in ${dir}`);
  } else {
    console.log(`⚠️ Warning: No packages else-block match not found in ${dir}`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
});
