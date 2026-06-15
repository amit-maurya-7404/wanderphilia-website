const fs = require('fs')
const path = require('path')

const tripsDir = path.join(__dirname, '../app/trips')

function findPageFiles(dir, files = []) {
  const list = fs.readdirSync(dir)
  for (const item of list) {
    const itemPath = path.join(dir, item)
    const stat = fs.statSync(itemPath)
    if (stat.isDirectory()) {
      findPageFiles(itemPath, files)
    } else if (item === 'page.tsx' && dir.endsWith('[slug]')) {
      files.push(itemPath)
    }
  }
  return files
}

const pageFiles = findPageFiles(tripsDir)
console.log(`Found ${pageFiles.length} dynamic package details pages:`)

let modifiedCount = 0

for (const file of pageFiles) {
  let content = fs.readFileSync(file, 'utf8')
  
  if (content.includes('TripReviewsSection')) {
    console.log(`- Skipping ${path.relative(process.cwd(), file)}: Already has TripReviewsSection`)
    continue
  }

  // 1. Inject Import Statement
  // We can insert it after the first 'use client' or react imports
  const lines = content.split('\n')
  let importInserted = false
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("import {") && !importInserted) {
      lines.splice(i, 0, "import { TripReviewsSection } from '@/components/trip-reviews-section'")
      importInserted = true
      break
    }
  }
  content = lines.join('\n')

  // 2. Inject JSX block before GALLERY SECTION
  const targetComment = '{/* GALLERY SECTION */}'
  if (content.includes(targetComment)) {
    const replacement = `      {/* REVIEWS SECTION */}
      <TripReviewsSection 
        tripSlug={trip.slug} 
        categoryId={trip.category.toLowerCase()} 
      />

      {/* GALLERY SECTION */}`
    content = content.replace(targetComment, replacement)
    fs.writeFileSync(file, content, 'utf8')
    console.log(`- Modified: ${path.relative(process.cwd(), file)}`)
    modifiedCount++
  } else {
    console.error(`- Error: Could not find GALLERY SECTION in ${path.relative(process.cwd(), file)}`)
  }
}

console.log(`\nSuccessfully injected reviews component into ${modifiedCount} files.`)
