import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { readLocalCollection, saveLocalDocument } from '@/lib/localDb'
import { syncGoogleReviews } from '@/lib/google-reviews'

export const dynamic = 'force-dynamic'

const allowedPlatforms = ['Google', 'Facebook', 'Justdial', 'Wanderphilia'] as const

type ReviewPlatform = (typeof allowedPlatforms)[number]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const forceSync = searchParams.get('forceSync') === 'true'
    
    // Perform lazy Google Reviews sync
    await syncGoogleReviews(forceSync)
  } catch (syncError) {
    console.error('[GET /api/reviews] Lazy sync error:', syncError)
  }

  const isConfigured = !!(process.env.GOOGLE_PLACES_API_KEY && process.env.GOOGLE_PLACE_ID)

  // Try to parse categoryId and tripSlug from query parameters
  const { searchParams } = new URL(request.url)
  const queryCategoryId = searchParams.get('categoryId')
  const queryTripSlug = searchParams.get('tripSlug')

  // Fallback to parsing from Referer header
  const referer = request.headers.get('referer')
  let refererCategoryId: string | null = null
  let refererTripSlug: string | null = null
  if (referer) {
    try {
      const url = new URL(referer)
      const pathParts = url.pathname.split('/').filter(Boolean)
      if (pathParts[0] === 'trips') {
        if (pathParts[1]) {
          if (pathParts[2] && pathParts[2] !== 'page') {
            refererCategoryId = pathParts[1]
            refererTripSlug = pathParts[2]
          } else if (pathParts[1] !== 'page') {
            refererCategoryId = pathParts[1]
          }
        }
      } else if (pathParts[0] === 'category' && pathParts[1]) {
        refererCategoryId = pathParts[1]
      }
    } catch (e) {
      console.error('[GET /api/reviews] Error parsing referer:', e)
    }
  }

  const targetCategoryId = queryCategoryId || refererCategoryId
  const targetTripSlug = queryTripSlug || refererTripSlug

  try {
    const db = await getDb()
    
    // Check if we have any successfully synced Google reviews in the database
    const hasSyncedReviews = await db.collection('reviews').findOne({
      _id: { $regex: /^google-/ } as any
    })

    if (isConfigured && hasSyncedReviews) {
      // If live Google reviews are successfully synced, delete the dummy reviews from MongoDB database
      await db.collection('reviews').deleteMany({
        _id: { $in: ['review-1', 'review-2', 'review-3', 'review-4', 'review-5'] } as any
      })
    }

    let reviews = await db
      .collection('reviews')
      .find()
      .sort({ createdAt: -1 })
      .toArray()

    // Seed dummy reviews if the database has no reviews or if live sync has not succeeded yet
    const hasGoogleReviews = reviews.some(r => r._id.toString().startsWith('google-'))
    if (reviews.length === 0 || (!hasGoogleReviews && reviews.filter(r => !r._id.toString().startsWith('review-')).length === 0)) {
      const localReviews = await readLocalCollection('reviews')
      if (localReviews && localReviews.length > 0) {
        console.log('[GET /api/reviews] Seeding/restoring dummy reviews as fallback until live reviews sync successfully...')
        const seededReviews = localReviews.map((r: any) => ({
          ...r,
          _id: r._id, // Keep the string _id
          createdAt: new Date(r.createdAt)
        }))
        for (const sr of seededReviews) {
          await db.collection('reviews').updateOne(
            { _id: sr._id as any },
            { $setOnInsert: sr },
            { upsert: true }
          )
        }
        reviews = await db
          .collection('reviews')
          .find()
          .sort({ createdAt: -1 })
          .toArray()
      }
    }

    // Filter out dummy reviews only if we have synced Google reviews
    if (isConfigured && hasGoogleReviews) {
      reviews = reviews.filter((item) => !item._id.toString().startsWith('review-'))
    }

    // Filter by specific trip slug if present
    if (targetTripSlug) {
      reviews = reviews.filter(
        (r) => !r.tripSlug || r.tripSlug === targetTripSlug
      )

      // Sort: trip-specific first, then general reviews
      reviews.sort((a, b) => {
        const aIsSpecific = a.tripSlug === targetTripSlug
        const bIsSpecific = b.tripSlug === targetTripSlug
        if (aIsSpecific && !bIsSpecific) return -1
        if (!aIsSpecific && bIsSpecific) return 1
        
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return bTime - aTime
      })
    } else if (targetCategoryId) {
      // Filter by destination category if targetCategoryId is present
      reviews = reviews.filter(
        (r) => !r.categoryId || r.categoryId === targetCategoryId
      )

      // Sort: destination-specific first, then general Google/FB/Justdial reviews
      reviews.sort((a, b) => {
        const aIsSpecific = a.categoryId === targetCategoryId
        const bIsSpecific = b.categoryId === targetCategoryId
        if (aIsSpecific && !bIsSpecific) return -1
        if (!aIsSpecific && bIsSpecific) return 1
        
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return bTime - aTime
      })
    }

    const serialized = reviews.map((item) => ({
      ...item,
      _id: item._id.toString(),
    }))

    return NextResponse.json(serialized)
  } catch (error) {
    console.error('[GET /api/reviews] MongoDB error, falling back to local store:', error)
    let localReviews = await readLocalCollection('reviews')
    const hasLocalSynced = localReviews.some((r: any) => r._id.startsWith('google-'))
    if (isConfigured && hasLocalSynced) {
      localReviews = localReviews.filter((item: any) => !item._id.startsWith('review-'))
    }

    if (targetTripSlug) {
      localReviews = localReviews.filter(
        (r: any) => !r.tripSlug || r.tripSlug === targetTripSlug
      )
      localReviews.sort((a: any, b: any) => {
        const aIsSpecific = a.tripSlug === targetTripSlug
        const bIsSpecific = b.tripSlug === targetTripSlug
        if (aIsSpecific && !bIsSpecific) return -1
        if (!aIsSpecific && bIsSpecific) return 1
        
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return bTime - aTime
      })
    } else if (targetCategoryId) {
      localReviews = localReviews.filter(
        (r: any) => !r.categoryId || r.categoryId === targetCategoryId
      )
      localReviews.sort((a: any, b: any) => {
        const aIsSpecific = a.categoryId === targetCategoryId
        const bIsSpecific = b.categoryId === targetCategoryId
        if (aIsSpecific && !bIsSpecific) return -1
        if (!aIsSpecific && bIsSpecific) return 1
        
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return bTime - aTime
      })
    }

    return NextResponse.json(localReviews)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { name, rating, platform, comment, categoryId, tripSlug, images } = body as {
      name?: string
      rating?: number
      platform?: string
      comment?: string
      categoryId?: string
      tripSlug?: string
      images?: string[]
    }

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be a number between 1 and 5' }, { status: 400 })
    }

    const targetPlatform = platform || 'Wanderphilia'
    if (!allowedPlatforms.includes(targetPlatform as ReviewPlatform)) {
      return NextResponse.json(
        { error: `Platform must be one of: ${allowedPlatforms.join(', ')}` },
        { status: 400 }
      )
    }

    if (!comment || typeof comment !== 'string') {
      return NextResponse.json({ error: 'Comment is required' }, { status: 400 })
    }

    const newReview = {
      name,
      rating,
      platform: targetPlatform,
      comment,
      categoryId: categoryId || null,
      tripSlug: tripSlug || null,
      images: Array.isArray(images) ? images : [],
      createdAt: new Date(),
    }

    try {
      const db = await getDb()
      const result = await db.collection('reviews').insertOne(newReview)

      return NextResponse.json({ success: true, id: result.insertedId.toString() })
    } catch (mongoError) {
      console.error('[POST /api/reviews] MongoDB error, falling back to local store:', mongoError)
      const saved = await saveLocalDocument('reviews', {
        ...newReview,
        createdAt: new Date().toISOString(),
      })
      return NextResponse.json({ success: true, id: saved._id })
    }
  } catch (error) {
    console.error('[POST /api/reviews] Error:', error)
    return NextResponse.json(
      { error: 'Unable to save review' },
      { status: 500 }
    )
  }
}
