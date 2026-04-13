import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { readLocalCollection, saveLocalDocument } from '@/lib/localDb'

const allowedPlatforms = ['Google', 'Facebook', 'Justdial'] as const

type ReviewPlatform = (typeof allowedPlatforms)[number]

export async function GET() {
  try {
    const db = await getDb()
    const reviews = await db
      .collection('reviews')
      .find()
      .sort({ createdAt: -1 })
      .toArray()

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
