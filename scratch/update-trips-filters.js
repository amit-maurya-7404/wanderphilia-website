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
  'thailand'
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
  if (!content.includes("import { DurationFilter }")) {
    content = content.replace(
      "import { getSectionMapping } from '@/lib/section-mappings'",
      "import { getSectionMapping } from '@/lib/section-mappings'\nimport { DurationFilter } from '@/components/duration-filter'"
    );
  }

  // 2. Add states & filtered variables (if not already added)
  if (!content.includes("const [selectedDuration")) {
    const hasGroup = content.includes("groupPackages");
    const combinedList = hasGroup 
      ? `[...categoryTrips, ...groupPackages, ...familyPackages, ...customizedPackages]`
      : `[...categoryTrips, ...familyPackages, ...customizedPackages]`;
    
    const combinedDeps = hasGroup
      ? `[categoryTrips, groupPackages, familyPackages, customizedPackages]`
      : `[categoryTrips, familyPackages, customizedPackages]`;

    let stateAndMemo = `  const [selectedDuration, setSelectedDuration] = useState<number | null>(null)

  const allCategoryTrips = useMemo(() => {
    const combined = ${combinedList}
    const seen = new Set<string>()
    return combined.filter(trip => {
      if (seen.has(trip.id)) return false
      seen.add(trip.id)
      return true
    })
  }, ${combinedDeps})

  const filteredCategoryTrips = useMemo(() => {
    if (!selectedDuration) return categoryTrips
    return categoryTrips.filter(t => t.duration === selectedDuration)
  }, [categoryTrips, selectedDuration])\n`;

    if (hasGroup) {
      stateAndMemo += `\n  const filteredGroupPackages = useMemo(() => {
    if (!selectedDuration) return groupPackages
    return groupPackages.filter(t => t.duration === selectedDuration)
  }, [groupPackages, selectedDuration])\n`;
    }

    stateAndMemo += `\n  const filteredFamilyPackages = useMemo(() => {
    if (!selectedDuration) return familyPackages
    return familyPackages.filter(t => t.duration === selectedDuration)
  }, [familyPackages, selectedDuration])

  const filteredCustomizedPackages = useMemo(() => {
    if (!selectedDuration) return customizedPackages
    return customizedPackages.filter(t => t.duration === selectedDuration)
  }, [customizedPackages, selectedDuration])

  // Compute review statistics`;

    content = content.replace("  // Compute review statistics", stateAndMemo);
  }

  // 3. Add <DurationFilter> inside return/JSX (newline agnostic)
  if (!content.includes("<DurationFilter")) {
    content = content.replace(
      /([ \t]*)\{\/\* Packages Section \*\/\}\r?\n\s*<section className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">/,
      (match, indent) => {
        return `${indent}{/* Packages Section */}
${indent}<DurationFilter
${indent}  trips={allCategoryTrips}
${indent}  selectedDuration={selectedDuration}
${indent}  onChange={setSelectedDuration}
${indent}/>

${indent}<section className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">`;
      }
    );
  }

  // 4. In Packages Section, replace categoryTrips with filteredCategoryTrips
  // We locate the Packages Section block and replace categoryTrips inside it
  const packagesStart = content.indexOf('Packages Section');
  if (packagesStart !== -1) {
    const packagesEnd = content.indexOf('Section', packagesStart + 20);
    let packagesSection = content.substring(packagesStart, packagesEnd);
    
    // Replace categoryTrips with filteredCategoryTrips inside this section
    packagesSection = packagesSection.replace(/categoryTrips/g, 'filteredCategoryTrips');
    
    content = content.substring(0, packagesStart) + packagesSection + content.substring(packagesEnd);
  }

  // 5. In Group Trips Section, replace groupPackages with filteredGroupPackages
  if (content.includes("groupPackages")) {
    const groupStart = content.indexOf('Group Trips Section');
    if (groupStart !== -1) {
      const groupEnd = content.indexOf('Section', groupStart + 20);
      let groupSection = content.substring(groupStart, groupEnd);
      
      groupSection = groupSection.replace(/groupPackages/g, 'filteredGroupPackages');
      content = content.substring(0, groupStart) + groupSection + content.substring(groupEnd);
    }
  }

  // 6. In Family Packages Section, replace familyPackages with filteredFamilyPackages
  const familyStart = content.indexOf('Family Packages Section');
  if (familyStart !== -1) {
    const familyEnd = content.indexOf('Section', familyStart + 30);
    let familySection = content.substring(familyStart, familyEnd);
    
    familySection = familySection.replace(/familyPackages/g, 'filteredFamilyPackages');
    content = content.substring(0, familyStart) + familySection + content.substring(familyEnd);
  }

  // 7. In Customized Packages Section, replace customizedPackages with filteredCustomizedPackages
  const customStart = content.indexOf('Customized Packages Section');
  if (customStart !== -1) {
    const customEnd = content.indexOf('Section', customStart + 30);
    let customSection = content.substring(customStart, customEnd);
    
    customSection = customSection.replace(/customizedPackages/g, 'filteredCustomizedPackages');
    content = content.substring(0, customStart) + customSection + content.substring(customEnd);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Success: ${dir}`);
});
