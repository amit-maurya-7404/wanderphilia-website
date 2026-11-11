import { trips, Trip } from '@/lib/data'
import { getDb } from '@/lib/mongodb'

/**
 * Resolves a trip by its slug or ID, looking first in static trips and then in MongoDB dynamic trips.
 */
export async function getTripBySlug(slug: string): Promise<Trip | null> {
  if (!slug) return null
  const cleanSlug = decodeURIComponent(slug).trim()

  // 1. Check static data
  const staticTrip = trips.find(
    (t) =>
      t.slug === cleanSlug ||
      t.id === cleanSlug ||
      t.slug.toLowerCase() === cleanSlug.toLowerCase() ||
      t.id.toLowerCase() === cleanSlug.toLowerCase()
  )
  if (staticTrip) {
    return staticTrip
  }

  // 2. Check MongoDB collection 'trips'
  try {
    const db = await getDb()
    const dynamicTrip = await db.collection('trips').findOne({
      $or: [
        { slug: cleanSlug },
        { id: cleanSlug },
        { slug: { $regex: `^${cleanSlug.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}$`, $options: 'i' } }
      ]
    })

    if (dynamicTrip) {
      const { _id, ...serialized } = dynamicTrip
      return serialized as unknown as Trip
    }
  } catch (error) {
    console.error(`[getTripBySlug] Error fetching dynamic trip for "${cleanSlug}":`, error)
  }

  return null
}

