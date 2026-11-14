import { NextResponse } from 'next/server'
import { getAllBlogs } from '@/lib/blogs-db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const blogs = await getAllBlogs()
    return NextResponse.json({ success: true, blogs })
  } catch (error) {
    console.error('Error fetching blogs API:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch blogs' }, { status: 500 })
  }
}

