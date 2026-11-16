import { NextRequest, NextResponse } from 'next/server'
import { getAllBlogs } from '@/lib/blogs-db'
import { isBlogForDestination } from '@/lib/blog-destination'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const destination = searchParams.get('destination')
    const blogs = await getAllBlogs()

    if (destination) {
      const filtered = blogs.filter((b) => isBlogForDestination(b, destination))
      return NextResponse.json({ success: true, blogs: filtered })
    }

    return NextResponse.json({ success: true, blogs })
  } catch (error) {
    console.error('Error fetching blogs API:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch blogs' }, { status: 500 })
  }
}

