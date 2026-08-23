import { contactEmail, contactPhoneDisplayInternational, companyName } from './contact'

interface ItineraryDay {
  day: number
  title: string
  description: string | string[]
}

interface CostingDetail {
  label: string
  value: string
}

interface Trip {
  title: string
  destination: string
  nights?: number
  duration: number
  difficulty: string
  groupSize: string
  rating: number
  stays?: string[]
  itinerary: ItineraryDay[]
  included: string[]
  notIncluded: string[]
  paymentPolicy?: string[]
  cancellationPolicy?: string[]
  highlights: string[]
  costingDetails?: CostingDetail[]
  showGetQuoteOnly?: boolean
  price?: number
}

// Fallback policies
const defaultPaymentPolicy = [
  'Booking Amount: 30% of the total tour cost at the time of booking to secure reservations.',
  'Second Payment: 40% of the total tour cost 30 days before departure.',
  'Balance Payment: Remaining 30% of the total tour cost 15 days before departure.'
]

const defaultCancellationPolicy = [
  'Cancellation request received 45 days or more before departure: 10% of the tour cost will be charged as cancellation fee.',
  'Cancellation request received 30 to 44 days before departure: 25% of the tour cost will be charged as cancellation fee.',
  'Cancellation request received 15 to 29 days before departure: 50% of the tour cost will be charged as cancellation fee.',
  'Cancellation request received less than 15 days before departure: 100% of the tour cost will be charged as cancellation fee (no refund).'
]

// Asynchronously load the logo image in the browser environment
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return reject(new Error('Window is undefined'))
    }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = src
    img.onload = () => resolve(img)
    img.onerror = (err) => reject(err)
  })
}

export async function generateItineraryPDF(trip: Trip, jsPDFClass: any) {
  const doc = new jsPDFClass({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  // Margins & Dimensions (A4: 210mm x 297mm)
  const leftMargin = 20
  const rightMargin = 20
  const topMargin = 25
  const bottomMargin = 25
  const printWidth = 210 - leftMargin - rightMargin // 170mm
  const maxY = 297 - bottomMargin // 272mm
  let y = topMargin

  // Try loading the desktop logo image
  let logoImg: HTMLImageElement | null = null
  try {
    logoImg = await loadImage('/images/Made_LOGO.png')
  } catch (e) {
    console.error('Failed to load Made_LOGO.png, trying fallback LOGO.png:', e)
    try {
      logoImg = await loadImage('/images/LOGO.png')
    } catch (err) {
      console.error('All logo images failed to load, using text branding fallback:', err)
    }
  }

  // Page tracking helper
  const checkPageBreak = (heightNeeded: number) => {
    if (y + heightNeeded > maxY) {
      doc.addPage()
      y = topMargin + 15 // Leave space below header
      return true
    }
    return false
  }

  // 1. BRAND CORPORATE HEADER BLOCK (Page 1 Top - Clean White Background)
  if (logoImg) {
    // Draw logo (maintaining a proportional ~2.2 aspect ratio: 36mm wide by 16mm high)
    doc.addImage(logoImg, 'PNG', leftMargin, y, 36, 16)
  } else {
    // Text Logo Fallback
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.setTextColor(255, 93, 9) // Primary Orange (#ff5d09)
    doc.text(companyName.toUpperCase(), leftMargin, y + 8)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(148, 163, 184) // slate-400
    doc.text('CURATED TRAVEL EXPERIENCES', leftMargin, y + 13)
  }

  // Header Right Contact Information
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(255, 93, 9)
  doc.text('EXPERIENCES & BOOKINGS', 190, y + 5, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(100, 116, 139) // slate-500
  doc.text(contactEmail, 190, y + 10, { align: 'right' })
  doc.text(contactPhoneDisplayInternational, 190, y + 14, { align: 'right' })

  y += 20 // Move below logo/header elements

  // Divider Line below Header
  doc.setDrawColor(255, 93, 9)
  doc.setLineWidth(0.5)
  doc.line(leftMargin, y, 210 - rightMargin, y)
  
  y += 10 // Space below divider

  // 2. PACKAGE TITLE
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(15, 23, 42) // slate-900
  const titleLines = doc.splitTextToSize(trip.title, printWidth)
  doc.text(titleLines, leftMargin, y)
  y += (titleLines.length * 6) + 4

  // 3. KEY TOUR SUMMARY DETAILS (Grid Card Box)
  doc.setDrawColor(226, 232, 240) // slate-200 border
  doc.setFillColor(248, 250, 252) // slate-50 background
  doc.rect(leftMargin, y, printWidth, 24, 'DF')

  // Vertical Divider Lines inside the Box for Column Segments
  doc.line(62, y, 62, y + 24)
  doc.line(102, y, 102, y + 24)
  doc.line(142, y, 142, y + 24)

  // Label Header Row
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(148, 163, 184) // slate-400
  doc.text('DESTINATION', leftMargin + 5, y + 7)
  doc.text('DURATION', leftMargin + 47, y + 7)
  doc.text('DIFFICULTY', leftMargin + 87, y + 7)
  doc.text('GROUP SIZE', leftMargin + 127, y + 7)

  // Value Row
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.setTextColor(51, 65, 85) // slate-700
  doc.text(trip.destination, leftMargin + 5, y + 15)
  const durationText = trip.nights ? `${trip.nights}N / ${trip.duration}D` : `${trip.duration}D`
  doc.text(durationText, leftMargin + 47, y + 15)
  doc.text(trip.difficulty, leftMargin + 87, y + 15)
  doc.text(String(trip.groupSize), leftMargin + 127, y + 15)

  y += 34 // Spacing after summary card

  // 4. HIGHLIGHTS SECTION
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(15, 23, 42) // slate-900
  doc.text('TOUR HIGHLIGHTS', leftMargin, y)
  
  // Highlight Orange Accent Line
  doc.setDrawColor(255, 93, 9)
  doc.setLineWidth(1)
  doc.line(leftMargin, y + 2, leftMargin + 15, y + 2)
  y += 7

  trip.highlights.forEach((item) => {
    const wrapped = doc.splitTextToSize(item, printWidth - 8)
    const needed = (wrapped.length * 4.5) + 3
    checkPageBreak(needed)
    
    // Draw Bullet dot
    doc.setFillColor(255, 93, 9)
    doc.circle(leftMargin + 2, y + 1.5, 1, 'F')

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    doc.setTextColor(71, 85, 105) // slate-600
    doc.text(wrapped, leftMargin + 6, y + 2.2)
    y += (wrapped.length * 4.5) + 2
  })

  y += 8

  // 5. DETAILED ITINERARY SECTION
  checkPageBreak(15)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(15, 23, 42) // slate-900
  doc.text('DETAILED DAY-WISE ITINERARY', leftMargin, y)

  doc.setDrawColor(255, 93, 9)
  doc.setLineWidth(1)
  doc.line(leftMargin, y + 2, leftMargin + 15, y + 2)
  y += 8

  trip.itinerary.forEach((day, index) => {
    // Process description lines
    let descLines: string[] = []
    if (typeof day.description === 'string') {
      descLines = [day.description]
    } else if (Array.isArray(day.description)) {
      descLines = day.description
    }

    // Wrap description paragraphs beforehand to calculate total day height
    const parsedBlocks: string[][] = descLines.map(line => 
      doc.splitTextToSize(line.trim(), printWidth - 8)
    )
    const paragraphsHeight = parsedBlocks.reduce((sum, block) => sum + (block.length * 4.5) + 4, 0)
    const totalDayHeight = 8 + paragraphsHeight // header (8) + paragraphs

    // Check if we need a page break for this whole day (or at least its header and first paragraph)
    checkPageBreak(Math.min(totalDayHeight, 25))

    // Draw Day Tag (with rounded corners styled rectangle)
    doc.setFillColor(255, 93, 9) // orange background tag
    doc.rect(leftMargin, y, 16, 6, 'F')
    
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(255, 255, 255)
    doc.text(`DAY ${day.day}`, leftMargin + 3, y + 4.2)

    // Draw Day Title
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10.5)
    doc.setTextColor(15, 23, 42) // slate-900
    const wrappedTitle = doc.splitTextToSize(day.title, printWidth - 20)
    doc.text(wrappedTitle, leftMargin + 19, y + 4.5)
    
    y += (wrappedTitle.length * 5) + 3

    // Render paragraphs
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(71, 85, 105) // slate-600

    parsedBlocks.forEach((block) => {
      // Paragraph spacing
      y += 1

      block.forEach((line) => {
        if (checkPageBreak(5)) {
          // If we break pages mid-paragraph, re-set font settings
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(9)
          doc.setTextColor(71, 85, 105)
        }
        doc.text(line, leftMargin + 4, y)
        y += 4.5
      })
      y += 1
    })

    // Draw a subtle line separator between days (if not the last day)
    if (index < trip.itinerary.length - 1) {
      y += 3
      checkPageBreak(5)
      doc.setDrawColor(241, 245, 249) // slate-100
      doc.setLineWidth(0.5)
      doc.line(leftMargin, y, 210 - rightMargin, y)
      y += 5
    } else {
      y += 4
    }
  })

  y += 6

  // 6. INCLUSIONS & EXCLUSIONS SECTION
  checkPageBreak(25)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(15, 23, 42)
  doc.text('WHAT\'S INCLUDED & EXCLUDED', leftMargin, y)

  doc.setDrawColor(255, 93, 9)
  doc.setLineWidth(1)
  doc.line(leftMargin, y + 2, leftMargin + 15, y + 2)
  y += 8

  // Split space for double column: Column 1 (Left, Inclusions), Column 2 (Right, Exclusions)
  let leftY = y
  let rightY = y
  const colWidth = (printWidth - 8) / 2 // ~81mm each

  // Draw Column Headers with colored background rectangles for premium aesthetic
  doc.setFillColor(240, 253, 244) // soft green (green-50)
  doc.rect(leftMargin, leftY, colWidth, 7, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(22, 163, 74) // green-600
  doc.text('INCLUSIONS', leftMargin + 4, leftY + 5)
  leftY += 11

  doc.setFillColor(254, 242, 242) // soft red (red-50)
  doc.rect(leftMargin + colWidth + 8, rightY, colWidth, 7, 'F')
  doc.setTextColor(220, 38, 38) // red-600
  doc.text('EXCLUSIONS', leftMargin + colWidth + 12, rightY + 5)
  rightY += 11

  // Render Inclusions (Left Column)
  trip.included.forEach((item) => {
    const wrapped = doc.splitTextToSize(item, colWidth - 6)
    const needed = (wrapped.length * 4.2) + 2
    if (leftY + needed > maxY) {
      doc.addPage()
      leftY = topMargin + 15
      rightY = topMargin + 15 // keeps columns aligned
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(22, 163, 74) // Green check
    doc.text('✓', leftMargin, leftY)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(71, 85, 105)
    doc.text(wrapped, leftMargin + 4.5, leftY - 0.2)
    leftY += (wrapped.length * 4.2) + 2
  })

  // Render Exclusions (Right Column)
  trip.notIncluded.forEach((item) => {
    const wrapped = doc.splitTextToSize(item, colWidth - 6)
    const needed = (wrapped.length * 4.2) + 2
    if (rightY + needed > maxY) {
      doc.addPage()
      rightY = topMargin + 15
      leftY = topMargin + 15 // keeps columns aligned
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(220, 38, 38) // Red cross
    doc.text('✕', leftMargin + colWidth + 8, rightY)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(71, 85, 105)
    doc.text(wrapped, leftMargin + colWidth + 12.5, rightY - 0.2)
    rightY += (wrapped.length * 4.2) + 2
  })

  // Sink Y to the bottom of the longest column
  y = Math.max(leftY, rightY) + 8

  // 7. POLICIES SECTION (Payment & Cancellation)
  const paymentPolicy = trip.paymentPolicy && trip.paymentPolicy.length > 0 ? trip.paymentPolicy : defaultPaymentPolicy
  const cancellationPolicy = trip.cancellationPolicy && trip.cancellationPolicy.length > 0 ? trip.cancellationPolicy : defaultCancellationPolicy

  // Check room for at least some policies, otherwise pagebreak
  checkPageBreak(30)
  
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(15, 23, 42)
  doc.text('POLICIES & TERMS', leftMargin, y)

  doc.setDrawColor(255, 93, 9)
  doc.setLineWidth(1)
  doc.line(leftMargin, y + 2, leftMargin + 15, y + 2)
  y += 7

  // Payment policy subheading
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.setTextColor(15, 23, 42)
  doc.text('Payment Policy', leftMargin, y)
  y += 4.5

  paymentPolicy.forEach((item) => {
    const wrapped = doc.splitTextToSize(item, printWidth - 6)
    const needed = (wrapped.length * 4.2) + 1.5
    checkPageBreak(needed)

    doc.setFillColor(100, 116, 139) // Slate dot
    doc.circle(leftMargin + 1.5, y + 1.2, 0.6, 'F')

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(71, 85, 105)
    doc.text(wrapped, leftMargin + 4.5, y + 1.8)
    y += (wrapped.length * 4.2) + 1.5
  })

  y += 3

  // Cancellation policy subheading
  checkPageBreak(12)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.setTextColor(15, 23, 42)
  doc.text('Cancellation Policy', leftMargin, y)
  y += 4.5

  cancellationPolicy.forEach((item) => {
    const wrapped = doc.splitTextToSize(item, printWidth - 6)
    const needed = (wrapped.length * 4.2) + 1.5
    checkPageBreak(needed)

    doc.setFillColor(100, 116, 139) // Slate dot
    doc.circle(leftMargin + 1.5, y + 1.2, 0.6, 'F')

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(71, 85, 105)
    doc.text(wrapped, leftMargin + 4.5, y + 1.8)
    y += (wrapped.length * 4.2) + 1.5
  })

  // 8. FINAL POST-PROCESSING: ADD HEADER & FOOTER ON EVERY PAGE
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)

    // Top Header (Draw only on page 2 onwards, as page 1 has the custom logo brand header)
    if (i > 1) {
      doc.setDrawColor(226, 232, 240) // slate-200 border
      doc.setLineWidth(0.4)
      doc.line(leftMargin, 18, 210 - rightMargin, 18)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9.5)
      doc.setTextColor(255, 93, 9) // Orange brand name
      doc.text(companyName.toUpperCase(), leftMargin, 14)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(148, 163, 184) // slate-400
      doc.text(`${contactEmail}  |  ${contactPhoneDisplayInternational}`, 210 - rightMargin, 14, { align: 'right' })
    }

    // Bottom Footer (On all pages)
    doc.setDrawColor(226, 232, 240) // slate-200 border
    doc.setLineWidth(0.4)
    doc.line(leftMargin, 280, 210 - rightMargin, 280)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(148, 163, 184) // slate-400
    doc.text(`Wanderphilia Curated Trips  •  www.wanderphilia.com`, leftMargin, 285)
    doc.text(`Page ${i} of ${totalPages}`, 210 - rightMargin, 285, { align: 'right' })
  }

  // Save/Download PDF
  const filename = `${trip.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_itinerary.pdf`
  doc.save(filename)
}
