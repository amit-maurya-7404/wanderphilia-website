import { getDb } from './mongodb'
import { blogs as staticBlogs, Blog } from './data'

export interface DbBlog extends Blog {
  _id?: string
  status?: 'published' | 'draft'
  createdAt?: string
  updatedAt?: string
}

export async function getAllBlogs(): Promise<DbBlog[]> {
  try {
    const db = await getDb()
    const rawBlogs = await db
      .collection('blogs')
      .find({ status: { $ne: 'draft' } })
      .sort({ date: -1, _id: -1 })
      .toArray()

    if (rawBlogs && rawBlogs.length > 0) {
      return rawBlogs.map((b) => ({
        id: b.id || b._id?.toString() || b.slug,
        title: b.title,
        slug: b.slug,
        image: b.image,
        excerpt: b.excerpt,
        author: b.author,
        date: b.date,
        lastUpdated: b.lastUpdated,
        category: b.category,
        content: b.content,
        contentHtml: b.contentHtml,
        readTime: b.readTime || 5,
        status: b.status || 'published',
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
      }))
    }
  } catch (error) {
    console.error('Error fetching blogs from MongoDB, falling back to static:', error)
  }

  return staticBlogs.map(b => ({ ...b, status: 'published' }))
}

export async function getBlogBySlug(slug: string): Promise<DbBlog | null> {
  try {
    const db = await getDb()
    const b = await db.collection('blogs').findOne({ slug })

    if (b) {
      return {
        id: b.id || b._id?.toString() || b.slug,
        title: b.title,
        slug: b.slug,
        image: b.image,
        excerpt: b.excerpt,
        author: b.author,
        date: b.date,
        lastUpdated: b.lastUpdated,
        category: b.category,
        content: b.content,
        contentHtml: b.contentHtml,
        readTime: b.readTime || 5,
        status: b.status || 'published',
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
      }
    }
  } catch (error) {
    console.error(`Error fetching blog by slug ${slug} from MongoDB:`, error)
  }

  const staticMatch = staticBlogs.find((item) => item.slug === slug)
  if (staticMatch) {
    return { ...staticMatch, status: 'published' }
  }

  return null
}

export async function getAllAdminBlogs(): Promise<DbBlog[]> {
  try {
    const db = await getDb()
    const rawBlogs = await db
      .collection('blogs')
      .find({})
      .sort({ date: -1, _id: -1 })
      .toArray()

    if (rawBlogs && rawBlogs.length > 0) {
      return rawBlogs.map((b) => ({
        id: b.id || b._id?.toString() || b.slug,
        title: b.title,
        slug: b.slug,
        image: b.image,
        excerpt: b.excerpt,
        author: b.author,
        date: b.date,
        lastUpdated: b.lastUpdated,
        category: b.category,
        content: b.content,
        contentHtml: b.contentHtml,
        readTime: b.readTime || 5,
        status: b.status || 'published',
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
      }))
    }
  } catch (error) {
    console.error('Error fetching admin blogs from MongoDB:', error)
  }

  return staticBlogs.map(b => ({ ...b, status: 'published' }))
}

