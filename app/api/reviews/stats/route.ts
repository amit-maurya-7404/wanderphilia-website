import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { readLocalMetadata } from '@/lib/localDb'

export async function GET() {
  let googleRating = 4.9
  let googleReviewsCount = 234

  try {
    const db = await getDb()
    const meta = await db.collection('metadata').findOne({ _id: 'google_reviews_sync' as any })
    if (meta) {
      if (typeof meta.googleRating === 'number') googleRating = meta.googleRating
      if (typeof meta.googleReviewsCount === 'number') googleReviewsCount = meta.googleReviewsCount
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
    } catch (localError) {
      console.error('[GET /api/reviews/stats] Local metadata error:', localError)
    }
  }

  const facebookRating = 4.8
  const facebookCount = 156

  const justdialRating = 4.9
  const justdialCount = 89

  const totalReviews = googleReviewsCount + facebookCount + justdialCount
  const avgRating = (
    (googleRating * googleReviewsCount + facebookRating * facebookCount + justdialRating * justdialCount) /
    totalReviews
  ).toFixed(1)

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
