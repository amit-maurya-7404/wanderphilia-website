import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { readLocalMetadata, readLocalCollection } from '@/lib/localDb'

export const dynamic = 'force-dynamic'

export async function GET() {
  let googleRating = 4.9
  let googleReviewsCount = 234
  let hasSyncedReviews = false

  try {
    const db = await getDb()
    const meta = await db.collection('metadata').findOne({ _id: 'google_reviews_sync' as any })
    if (meta) {
      if (typeof meta.googleRating === 'number') googleRating = meta.googleRating
      if (typeof meta.googleReviewsCount === 'number') googleReviewsCount = meta.googleReviewsCount
    }

    const syncedDoc = await db.collection('reviews').findOne({
      _id: { $regex: /^google-/ } as any
    })
    if (syncedDoc) {
      hasSyncedReviews = true
    }
  } catch (error) {
    console.error('[GET /api/reviews/stats] MongoDB error, checking local metadata:', error)
    try {
      const localMeta = await readLocalMetadata()
      if (localMeta) {
        if (typeof localMeta.googleRating === 'number') {
          googleRating = localMeta.googleRating
        }
        if (typeof localMeta.googleReviewsCount === 'number') {
          googleReviewsCount = localMeta.googleReviewsCount
        }
      }
      const localReviews = await readLocalCollection('reviews')
      hasSyncedReviews = localReviews.some((r: any) => r._id.startsWith('google-'))
    } catch (localError) {
      console.error('[GET /api/reviews/stats] Local metadata error:', localError)
    }
  }

  const isConfigured = !!(process.env.GOOGLE_PLACES_API_KEY && process.env.GOOGLE_PLACE_ID)
  const hideOthers = isConfigured && hasSyncedReviews

  const facebookRating = hideOthers ? 0 : 4.8
  const facebookCount = hideOthers ? 0 : 156

  const justdialRating = hideOthers ? 0 : 4.9
  const justdialCount = hideOthers ? 0 : 89

  const totalReviews = googleReviewsCount + facebookCount + justdialCount
  const avgRating = totalReviews > 0 ? (
    (googleRating * googleReviewsCount + facebookRating * facebookCount + justdialRating * justdialCount) /
    totalReviews
  ).toFixed(1) : googleRating.toFixed(1)

  return NextResponse.json({
    platforms: {
      Google: { rating: googleRating, count: googleReviewsCount },
      Facebook: { rating: facebookRating, count: facebookCount },
      Justdial: { rating: justdialRating, count: justdialCount },
    },
    summary: {
      avgRating,
      totalReviews,
    },
  })
}
