/**
 * Helper to match whether a blog belongs to a destination
 * Clean universal module callable on both Server & Client
 */
export function isBlogForDestination(
  blog: {
    title?: string
    slug?: string
    category?: string
    excerpt?: string
    destination?: string
    tags?: string[]
  },
  destinationName: string,
  destinationSlug?: string
): boolean {
  if (!destinationName && !destinationSlug) return false

  const destNorm = (destinationName || '').toLowerCase().trim()
  const slugNorm = (destinationSlug || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '')

  // Extract meaningful keyword tokens (e.g. "rajasthan", "ladakh", "spiti", "bhutan", "thailand", "sri lanka")
  const keywords = new Set<string>()
  if (destNorm) {
    keywords.add(destNorm)
    destNorm.split(/[\s-]+/).forEach((token) => {
      if (token.length > 2) keywords.add(token)
    })
  }
  if (slugNorm && slugNorm.length > 2) {
    keywords.add(slugNorm)
  }

  const keywordArr = Array.from(keywords)

  // 1. Explicit blog destination field
  if (blog.destination) {
    const bDest = blog.destination.toLowerCase().trim()
    if (keywordArr.some((k) => bDest.includes(k) || k.includes(bDest))) {
      return true
    }
  }

  // 2. Blog category (e.g. "Rajasthan guide", "Rajasthan", "Ladakh Travel Tips")
  if (blog.category) {
    const bCat = blog.category.toLowerCase().trim()
    if (keywordArr.some((k) => bCat.includes(k))) {
      return true
    }
  }

  // 3. Blog title (e.g. "The Ultimate Guide to Rajasthan", "Best Time to Visit Ladakh")
  if (blog.title) {
    const bTitle = blog.title.toLowerCase()
    if (keywordArr.some((k) => bTitle.includes(k))) {
      return true
    }
  }

  // 4. Blog slug (e.g. "best-time-to-visit-rajasthan")
  if (blog.slug) {
    const bSlug = blog.slug.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (keywordArr.some((k) => bSlug.includes(k))) {
      return true
    }
  }

  // 5. Blog tags
  if (Array.isArray(blog.tags)) {
    const bTags = blog.tags.map((t) => String(t).toLowerCase())
    if (keywordArr.some((k) => bTags.some((t) => t.includes(k)))) {
      return true
    }
  }

  return false
}
