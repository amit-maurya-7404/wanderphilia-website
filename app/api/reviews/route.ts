import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { readLocalCollection, saveLocalDocument } from '@/lib/localDb'
import { syncGoogleReviews } from '@/lib/google-reviews'

const allowedPlatforms = ['Google', 'Facebook', 'Justdial'] as const

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

  try {
    const db = await getDb()
    let reviews = await db
      .collection('reviews')
      .find()
      .sort({ createdAt: -1 })
      .toArray()

    if (reviews.length === 0) {
      // Seed default reviews from local store to MongoDB so the UI is not empty
      const localReviews = await readLocalCollection('reviews')
      if (localReviews && localReviews.length > 0) {
        console.log('[GET /api/reviews] MongoDB reviews collection is empty. Seeding from local DB...')
        const seededReviews = localReviews.map((r: any) => ({
          ...r,
          _id: r._id, // Keep the string _id
          createdAt: new Date(r.createdAt)
        }))
        await db.collection('reviews').insertMany(seededReviews as any[])
        reviews = await db
          .collection('reviews')
          .find()
          .sort({ createdAt: -1 })
          .toArray()
      }
    }

    const serialized = reviews.map((item) => ({
      ...item,
      _id: item._id.toString(),
    }))

    return NextResponse.json(serialized)
  } catch (error) {
    console.error('[GET /api/reviews] MongoDB error, falling back to local store:', error)
    const localReviews = await readLocalCollection('reviews')
    return NextResponse.json(localReviews)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { name, rating, platform, comment } = body as {
      name?: string
      rating?: number
      platform?: string
      comment?: string
    }

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be a number between 1 and 5' }, { status: 400 })
    }

    if (!allowedPlatforms.includes(platform as ReviewPlatform)) {
      return NextResponse.json(
        { error: `Platform must be one of: ${allowedPlatforms.join(', ')}` },
        { status: 400 }
      )
    }

    if (!comment || typeof comment !== 'string') {
      return NextResponse.json({ error: 'Comment is required' }, { status: 400 })
    }

    try {
      const db = await getDb()
      const result = await db.collection('reviews').insertOne({
        name,
        rating,
        platform,
        comment,
        createdAt: new Date(),
      })

      return NextResponse.json({ success: true, id: result.insertedId.toString() })
    } catch (mongoError) {
      console.error('[POST /api/reviews] MongoDB error, falling back to local store:', mongoError)
      const saved = await saveLocalDocument('reviews', {
        name,
        rating,
        platform,
        comment,
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
