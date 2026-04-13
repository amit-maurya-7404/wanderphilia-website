import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { readLocalCollection, saveLocalDocument } from '@/lib/localDb'

export async function GET() {
  try {
    const db = await getDb()
    const reels = await db
      .collection('reels')
      .find()
      .sort({ createdAt: -1 })
      .toArray()

    const serialized = reels.map((item) => ({
      ...item,
      _id: item._id.toString(),
    }))

    return NextResponse.json(serialized)
  } catch (error) {
    console.error('[GET /api/reels] MongoDB error, falling back to local store:', error)
    const localReels = await readLocalCollection('reels')
    return NextResponse.json(localReels)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { type, url, thumbnail, caption } = body as {
      type?: string
      url?: string
      thumbnail?: string
      caption?: string
    }

    if (type !== 'reel' && type !== 'post') {
      return NextResponse.json({ error: 'Type must be "reel" or "post"' }, { status: 400 })
    }

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    if (!thumbnail || typeof thumbnail !== 'string') {
      return NextResponse.json({ error: 'Thumbnail URL is required' }, { status: 400 })
    }

    try {
      const db = await getDb()
      const result = await db.collection('reels').insertOne({
        type,
        url,
        thumbnail,
        caption: caption ?? '',
        createdAt: new Date(),
      })

      return NextResponse.json({ success: true, id: result.insertedId.toString() })
    } catch (mongoError) {
      console.error('[POST /api/reels] MongoDB error, falling back to local store:', mongoError)
      const saved = await saveLocalDocument('reels', {
        type,
        url,
        thumbnail,
        caption: caption ?? '',
        createdAt: new Date().toISOString(),
      })
      return NextResponse.json({ success: true, id: saved._id })
    }
  } catch (error) {
    console.error('[POST /api/reels] Error:', error)
    return NextResponse.json(
      { error: 'Unable to save reel' },
      { status: 500 }
    )
  }
}
