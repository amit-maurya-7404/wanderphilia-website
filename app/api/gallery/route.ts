import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { readLocalCollection, saveLocalDocument } from '@/lib/localDb'

export async function GET() {
  if (!process.env.MONGODB_URI?.trim()) {
    const localGallery = await readLocalCollection('gallery')
    return NextResponse.json(localGallery)
  }

  try {
    const db = await getDb()
    const gallery = await db
      .collection('gallery')
      .find()
      .sort({ createdAt: -1 })
      .toArray()

    const serialized = gallery.map((item) => ({
      ...item,
      _id: item._id.toString(),
    }))

    return NextResponse.json(serialized)
  } catch (error) {
    console.error('[GET /api/gallery] MongoDB error, falling back to local store:', error)
    const localGallery = await readLocalCollection('gallery')
    return NextResponse.json(localGallery)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { image, category, title, caption } = body as {
      image?: string
      category?: string
      title?: string
      caption?: string
    }

    if (!image || typeof image !== 'string') {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
    }

    if (!category || typeof category !== 'string') {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 })
    }

    if (!process.env.MONGODB_URI?.trim()) {
      const saved = await saveLocalDocument('gallery', {
        image,
        category,
        title: title ?? '',
        caption: caption ?? '',
        createdAt: new Date().toISOString(),
      })
      return NextResponse.json({ success: true, id: saved._id })
    }

    try {
      const db = await getDb()
      const result = await db.collection('gallery').insertOne({
        image,
        category,
        title: title ?? '',
        caption: caption ?? '',
        createdAt: new Date(),
      })

      return NextResponse.json({ success: true, id: result.insertedId.toString() })
    } catch (mongoError) {
      console.error('[POST /api/gallery] MongoDB error, falling back to local store:', mongoError)
      const saved = await saveLocalDocument('gallery', {
        image,
        category,
        title: title ?? '',
        caption: caption ?? '',
        createdAt: new Date().toISOString(),
      })
      return NextResponse.json({ success: true, id: saved._id })
    }
  } catch (error) {
    console.error('[POST /api/gallery] Error:', error)
    return NextResponse.json(
      { error: 'Unable to save gallery item' },
      { status: 500 }
    )
  }
}
