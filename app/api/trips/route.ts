import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '../../../lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const db = await getDb()
    let query = {}

    if (category) {
      // If category is provided, filter trips by destination matching category name
      // For now, we'll do a simple text search on destination
      query = {
        destination: { $regex: category, $options: 'i' }
      }
    }

    const trips = await db.collection('trips').find(query).toArray()
    return NextResponse.json(trips)
  } catch (error) {
    console.error('Error fetching trips:', error)
    return NextResponse.json({ error: 'Failed to fetch trips' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDb()
    const body = await request.json()

    const trip = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection('trips').insertOne(trip)
    return NextResponse.json({ ...trip, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error('Error creating trip:', error)
    return NextResponse.json({ error: 'Failed to create trip' }, { status: 500 })
  }
}