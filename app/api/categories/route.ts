import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '../../../lib/mongodb'

export async function GET() {
  try {
    const db = await getDb()
    const categories = await db.collection('categories').find({ isActive: true }).toArray()
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDb()
    const body = await request.json()

    const category = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection('categories').insertOne(category)
    return NextResponse.json({ ...category, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}