/**
 * Utility to extract clean activity/experience titles from timeline descriptions.
 * Removes long descriptions after colons, removes transfers/drives, and keeps only the title.
 */
export function cleanActivityTitle(str: string): string {
  if (!str || typeof str !== 'string') return ''
  let clean = str.trim()

  // Filter out drives, transfers, airport drops
  if (
    /^(board your private vehicle|embark on a scenic drive|scenic drive (?:from|to)|drive (?:from|to|towards|back)|transfer (?:to|from)|drop off at|pick up from|arrival at .* airport|departure transfer|transfer to hotel)/i.test(
      clean
    )
  ) {
    return ''
  }

  // Remove prefixes like "Sightseeing & Experiences:", "Activities:", "En-route Visit:"
  clean = clean.replace(
    /^(sightseeing(?:\s*&\s*experiences)?|activities|experiences|activity|experience)\s*:\s*/i,
    ''
  )
  clean = clean.replace(/^en[- ]route (?:visit|stop)?\s*:\s*/i, '')

  // If there's a colon, the text before the colon is the title (e.g. "Hawa Mahal: Visit the iconic...")
  if (clean.includes(':')) {
    const parts = clean.split(':')
    clean = parts[0].trim()
  }

  // If there's a dash followed by a long description (e.g. "Kumbhalgarh Fort - Explore the scenic...")
  if (clean.includes(' - ')) {
    const parts = clean.split(' - ')
    if (parts[1] && parts[1].length > 20) {
      clean = parts[0].trim()
    }
  }

  return clean.trim()
}

/**
 * Sanitizes activities groups or flat lists to ensure only clean titles are kept.
 */
export function sanitizeActivitiesList(activities: any[]): any[] {
  if (!Array.isArray(activities)) return []

  return activities
    .map((group) => {
      if (typeof group === 'object' && group !== null && Array.isArray(group.items)) {
        const cleanedItems = group.items
          .map(cleanActivityTitle)
          .filter((item: string) => item.length > 0)

        return {
          ...group,
          items: cleanedItems,
        }
      }

      if (typeof group === 'string') {
        return cleanActivityTitle(group)
      }

      return group
    })
    .filter((group) => {
      if (typeof group === 'string') return group.length > 0
      if (typeof group === 'object' && group !== null && Array.isArray(group.items)) {
        return group.items.length > 0
      }
      return false
    })
}
