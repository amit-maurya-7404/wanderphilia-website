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

  const replaceFilter = (listName, filteredName) => {
    const pattern = new RegExp(
      `const\\s+${filteredName}\\s*=\\s*useMemo\\(\\(\\)\\s*=>\\s*\\{\\r?\\n` +
      `\\s*if\\s*\\(!selectedDuration\\)\\s*return\\s+${listName}\\r?\\n` +
      `\\s*return\\s+${listName}\\.filter\\(t\\s*=>\\s*t\\.duration\\s*===\\s*selectedDuration\\)\\r?\\n` +
      `\\s*\\},\\s*\\[${listName},\\s*selectedDuration\\]\\)`
    );

    const replacement = `const ${filteredName} = useMemo(() => {
    if (!selectedDuration) return ${listName}
    return ${listName}.filter(t => {
      const tripNights = t.nights !== undefined ? t.nights : (t.duration ? t.duration - 1 : 0)
      return tripNights === selectedDuration
    })
  }, [${listName}, selectedDuration])`;

    content = content.replace(pattern, replacement);
  };

  replaceFilter('categoryTrips', 'filteredCategoryTrips');
  replaceFilter('groupPackages', 'filteredGroupPackages');
  replaceFilter('familyPackages', 'filteredFamilyPackages');
  replaceFilter('customizedPackages', 'filteredCustomizedPackages');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Success: ${dir}`);
});
