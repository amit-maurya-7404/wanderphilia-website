import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '../../../lib/mongodb'

export async function GET() {
  try {
    const db = await getDb()
    const banners = await db.collection('banners').find({}).toArray()
    return NextResponse.json(banners)
  } catch (error) {
    console.error('Error fetching banners:', error)
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDb()
    const body = await request.json()

    const banner = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection('banners').insertOne(banner)
    return NextResponse.json({ ...banner, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error('Error creating banner:', error)
    return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 })
  }
}