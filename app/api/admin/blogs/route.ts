import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth'
import { blogs as fallbackBlogs, Blog } from '@/lib/data'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function checkAuth(req: NextRequest) {
  const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value
  const result = await verifyAdminSessionToken(cookie)
  return result.valid
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export async function GET(request: NextRequest) {
  try {
    const isAuth = await checkAuth(request)
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await getDb()
    const collection = db.collection('blogs')
    const dbBlogs = await collection.find({}).sort({ date: -1, _id: -1 }).toArray()

    const blogsMap = new Map<string, any>()
    dbBlogs.forEach((item: any) => {
      blogsMap.set(item.slug.toLowerCase(), {
        ...item,
        id: item.id || item._id.toString(),
        _id: item._id.toString(),
      })
    })

    // Include fallback static blogs if not yet in database
    fallbackBlogs.forEach((fb) => {
      if (!blogsMap.has(fb.slug.toLowerCase())) {
        blogsMap.set(fb.slug.toLowerCase(), {
          ...fb,
          status: 'published',
        })
      }
    })

    const allBlogs = Array.from(blogsMap.values())
    return NextResponse.json({ success: true, blogs: allBlogs })
  } catch (error: any) {
    console.error('Error in GET /api/admin/blogs:', error)
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuth = await checkAuth(request)
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    if (!data.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const slug = data.slug ? slugify(data.slug) : slugify(data.title)
    if (!slug) {
      return NextResponse.json({ error: 'A valid slug could not be generated' }, { status: 400 })
    }

    const db = await getDb()
    const collection = db.collection('blogs')

    // Check if slug already exists
    const existing = await collection.findOne({ slug })
    if (existing) {
      return NextResponse.json({ error: `A blog with slug "${slug}" already exists.` }, { status: 409 })
    }

    // Estimate read time if not provided: ~200 words per min
    let readTime = Number(data.readTime)
    if (!readTime || isNaN(readTime)) {
      const plainText = data.contentHtml ? data.contentHtml.replace(/<[^>]*>?/gm, ' ') : (data.content || '')
      const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length
      readTime = Math.max(1, Math.ceil(wordCount / 200))
    }

    const newBlog = {
      id: `blog-${Date.now()}`,
      title: data.title.trim(),
      slug,
      image: data.image || '/images/default-blog.jpg',
      excerpt: data.excerpt?.trim() || '',
      author: data.author?.trim() || 'Huzaifa AK at Wanderphilia',
      date: data.date || new Date().toISOString().split('T')[0],
      lastUpdated: data.lastUpdated || '',
      category: data.category?.trim() || 'General',
      content: data.content || (data.contentHtml ? data.contentHtml.replace(/<[^>]*>?/gm, ' ').substring(0, 300) : ''),
      contentHtml: data.contentHtml || '',
      readTime,
      status: data.status === 'draft' ? 'draft' : 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const result = await collection.insertOne(newBlog)
    return NextResponse.json({ success: true, blog: { ...newBlog, _id: result.insertedId.toString() } })
  } catch (error: any) {
    console.error('Error in POST /api/admin/blogs:', error)
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAuth = await checkAuth(request)
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const identifier = data.slug || data.id
    if (!identifier) {
      return NextResponse.json({ error: 'Slug or ID is required to update blog' }, { status: 400 })
    }

    const db = await getDb()
    const collection = db.collection('blogs')

    let readTime = Number(data.readTime)
    if (!readTime || isNaN(readTime)) {
      const plainText = data.contentHtml ? data.contentHtml.replace(/<[^>]*>?/gm, ' ') : (data.content || '')
      const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length
      readTime = Math.max(1, Math.ceil(wordCount / 200))
    }

    const updateDoc: any = {
      title: data.title,
      image: data.image,
      excerpt: data.excerpt,
      author: data.author,
      date: data.date,
      lastUpdated: data.lastUpdated,
      category: data.category,
      content: data.content,
      contentHtml: data.contentHtml,
      readTime,
      status: data.status === 'draft' ? 'draft' : 'published',
      updatedAt: new Date().toISOString(),
    }

    // Only update slug if newSlug is provided and different
    if (data.newSlug && data.newSlug !== identifier) {
      const newSlugFormatted = slugify(data.newSlug)
      const conflict = await collection.findOne({ slug: newSlugFormatted })
      if (conflict && conflict.slug !== identifier) {
        return NextResponse.json({ error: `Slug "${newSlugFormatted}" is already in use.` }, { status: 409 })
      }
      updateDoc.slug = newSlugFormatted
    }

    const result = await collection.findOneAndUpdate(
      { $or: [{ slug: identifier }, { id: identifier }] },
      { $set: updateDoc },
      { returnDocument: 'after', upsert: true }
    )

    return NextResponse.json({ success: true, blog: result })
  } catch (error: any) {
    console.error('Error in PUT /api/admin/blogs:', error)
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAuth = await checkAuth(request)
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const id = searchParams.get('id')

    if (!slug && !id) {
      return NextResponse.json({ error: 'Slug or ID is required' }, { status: 400 })
    }

    const db = await getDb()
    const collection = db.collection('blogs')

    await collection.deleteOne({
      $or: [
        ...(slug ? [{ slug }] : []),
        ...(id ? [{ id }] : [])
      ]
    })

    return NextResponse.json({ success: true, message: 'Blog deleted successfully' })
  } catch (error: any) {
    console.error('Error in DELETE /api/admin/blogs:', error)
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 })
  }
}

