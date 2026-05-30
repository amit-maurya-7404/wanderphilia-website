import { getDb } from './mongodb'
import { readLocalCollection, readLocalMetadata, writeLocalMetadata, saveLocalDocument } from './localDb'

interface GoogleReviewResponse {
  author_name: string
  rating: number
  text: string
  time: number
  profile_photo_url?: string
  relative_time_description?: string
}

interface GooglePlaceDetailsResponse {
  result?: {
    reviews?: GoogleReviewResponse[]
    rating?: number
    user_ratings_total?: number
  }
  status: string
  error_message?: string
}

function generateStableId(authorName: string, timestamp: number): string {
  const cleanAuthor = authorName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
  return `google-${cleanAuthor}-${timestamp}`
}

export async function syncGoogleReviews(force = false) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID

  if (!apiKey || !placeId) {
    console.warn('[syncGoogleReviews] Missing GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID. Sync skipped.')
    return { success: false, reason: 'missing_config' }
  }

  // 1. Check if we need to sync (lazy caching: sync once every 24 hours unless forced)
  const syncThresholdMs = 24 * 60 * 60 * 1000 // 24 hours
  let lastSyncedAt: Date | null = null
  let useMongo = true

  try {
    const db = await getDb()
    const meta = await db.collection('metadata').findOne({ _id: 'google_reviews_sync' as any })
    if (meta && meta.lastSyncedAt) {
      lastSyncedAt = new Date(meta.lastSyncedAt)
    }
  } catch (error) {
    console.error('[syncGoogleReviews] MongoDB error during sync check, trying local metadata:', error)
    useMongo = false
    const localMeta = await readLocalMetadata()
    if (localMeta && localMeta.lastSyncedAt) {
      lastSyncedAt = new Date(localMeta.lastSyncedAt as string)
    }
  }

  const now = new Date()
  if (!force && lastSyncedAt && now.getTime() - lastSyncedAt.getTime() < syncThresholdMs) {
    console.log('[syncGoogleReviews] Google reviews were synced recently. Skipping sync.')
    return { success: true, reason: 'cached' }
  }

  console.log(`[syncGoogleReviews] Starting sync. Last sync: ${lastSyncedAt || 'Never'}, Forced: ${force}`)

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Google Places API responded with status: ${response.status}`)
    }

    const data = (await response.json()) as GooglePlaceDetailsResponse
    if (data.status !== 'OK' || !data.result) {
      throw new Error(`Google Places API returned status: ${data.status}. Msg: ${data.error_message || 'None'}`)
    }

    const { reviews = [], rating = 5.0, user_ratings_total = 0 } = data.result

    const processedReviews = reviews.map((r) => ({
      _id: generateStableId(r.author_name, r.time),
      name: r.author_name,
      platform: 'Google' as const,
      rating: r.rating,
      comment: r.text || '',
      createdAt: new Date(r.time * 1000).toISOString(),
      profilePhotoUrl: r.profile_photo_url || '',
      relativeTime: r.relative_time_description || '',
    }))

    // Save statistics & reviews
    if (useMongo) {
      try {
        const db = await getDb()
        
        // 1. Save metadata
        await db.collection('metadata').updateOne(
          { _id: 'google_reviews_sync' as any },
          {
            $set: {
              googleRating: rating,
              googleReviewsCount: user_ratings_total,
              lastSyncedAt: now,
            },
          },
          { upsert: true }
        )

        // 2. Insert new reviews or update existing ones
        for (const review of processedReviews) {
          await db.collection('reviews').updateOne(
            { _id: review._id as any },
            {
              $set: {
                name: review.name,
                platform: review.platform,
                rating: review.rating,
                comment: review.comment,
                createdAt: new Date(review.createdAt),
                profilePhotoUrl: review.profilePhotoUrl,
                relativeTime: review.relativeTime,
              },
            },
            { upsert: true }
          )
        }

        console.log(`[syncGoogleReviews] Successfully synced ${processedReviews.length} reviews to MongoDB.`)
        return { success: true, count: processedReviews.length }
      } catch (mongoError) {
        console.error('[syncGoogleReviews] Failed to save synced reviews to MongoDB, falling back to local DB:', mongoError)
        useMongo = false
      }
    }

    // Local DB Fallback (if useMongo is false or failed)
    if (!useMongo) {
      // 1. Save metadata locally
      await writeLocalMetadata({
        googleRating: rating,
        googleReviewsCount: user_ratings_total,
        lastSyncedAt: now.toISOString(),
      })

      // 2. Insert reviews locally
      const localReviews = (await readLocalCollection('reviews')) as any[]
      let updatedCount = 0

      // Read all local reviews and merge
      const updatedReviewsList = [...localReviews]

      for (const review of processedReviews) {
        const idx = updatedReviewsList.findIndex((lr) => lr._id === review._id)
        if (idx > -1) {
          // Update
          updatedReviewsList[idx] = { ...updatedReviewsList[idx], ...review }
        } else {
          // Prepend
          updatedReviewsList.unshift(review)
          updatedCount++
        }
      }

      // Write updated list
      const fs = require('fs')
      const path = require('path')
      const localDbPath = path.join(process.cwd(), 'data', 'local-db.json')
      const fullDb = JSON.parse(fs.readFileSync(localDbPath, 'utf8'))
      fullDb.reviews = updatedReviewsList
      fs.writeFileSync(localDbPath, JSON.stringify(fullDb, null, 2), 'utf8')

      console.log(`[syncGoogleReviews] Successfully synced ${processedReviews.length} reviews to local-db.json. Added ${updatedCount} new.`)
      return { success: true, count: processedReviews.length, added: updatedCount }
    }

    return { success: true }
  } catch (error) {
    console.error('[syncGoogleReviews] Error during Google reviews sync:', error)
    return { success: false, error: (error as Error).message }
  }
}
