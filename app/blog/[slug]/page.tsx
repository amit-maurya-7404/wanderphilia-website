import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogBySlug, getAllBlogs } from '@/lib/blogs-db'
import { blogs as fallbackBlogs } from '@/lib/data'
import { ArrowLeft, Clock, Tag } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

import { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface BlogPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)

  if (!blog) {
    return {
      title: 'Blog Not Found | Wanderphilia',
    }
  }

  const imageUrl = blog.image.startsWith('http') ? blog.image : `https://wanderphilia.com${blog.image}`

  return {
    title: `${blog.title} | Wanderphilia Blog`,
    description: blog.excerpt,
    alternates: {
      canonical: `https://wanderphilia.com/blog/${slug}`,
    },
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      url: `https://wanderphilia.com/blog/${slug}`,
      type: 'article',
      publishedTime: blog.date,
      authors: [blog.author],
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt,
      images: [imageUrl],
    }
  }
}

export async function generateStaticParams() {
  return fallbackBlogs.map((blog) => ({ slug: blog.slug }))
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)

  if (!blog) {
    notFound()
  }

  const allBlogs = await getAllBlogs()

  const formattedDate = new Date(blog.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const relatedPosts = allBlogs.filter((item) => item.slug !== blog.slug).slice(0, 3)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section styled like Destination Page */}
      <header className="relative h-[50vh] sm:h-[55vh] md:h-[65vh] min-h-[460px] pt-20 overflow-hidden bg-slate-950">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          className="object-cover object-center"
          priority
        />
        {/* Destination-style dark gradient overlays for maximum contrast and readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/50 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 flex items-end">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 lg:pb-10">
            <div className="text-white max-w-3xl">
              <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white/80 hover:text-white transition bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full ring-1 ring-white/15"
                >
                  <ArrowLeft size={14} /> Back to Blog
                </Link>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-3 py-1 text-xs sm:text-sm font-semibold text-amber-200 ring-1 ring-amber-300/20">
                  <Tag size={13} /> {blog.category}
                </div>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-white mb-3">
                {blog.title}
              </h1>

              <p className="text-sm sm:text-base md:text-lg max-w-2xl text-white/90 leading-relaxed mb-4">
                {blog.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-slate-300">
                <span>By {blog.author}</span>
                <span>•</span>
                <span>{blog.lastUpdated ? `Updated ${blog.lastUpdated}` : formattedDate}</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1"><Clock size={13} /> {blog.readTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="grow">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-8 lg:gap-12 items-start">
            <article className="prose prose-slate max-w-none prose-p:text-slate-700 prose-p:text-[15px] sm:prose-p:text-base prose-p:leading-relaxed prose-li:text-slate-700 prose-li:text-[15px] sm:prose-li:text-base prose-headings:text-slate-900 prose-h2:text-2xl sm:prose-h2:text-[26px] prose-h2:font-bold prose-h3:text-lg sm:prose-h3:text-xl prose-h3:font-semibold">
              {blog.contentHtml ? (
                <div dangerouslySetInnerHTML={{ __html: blog.contentHtml }} />
              ) : (
                <>
                  <p>{blog.content}</p>
                  <p>
                    The journey with Wanderphilia blends premium comfort with thrilling adventure, giving you curated experiences that feel both luxe and authentic.
                  </p>
                  <h2>Why this destination is special</h2>
                  <p>
                    The right itinerary brings the destination alive. Each trip is crafted to balance immersive activities with restorative luxury, so you come home with a deeper story.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                    <div className="rounded-3xl bg-slate-950/5 p-6">
                      <h3 className="text-xl font-semibold mb-3">Travel Tips</h3>
                      <ul className="list-disc list-inside space-y-2 text-slate-700">
                        <li>Pack light but carry the essentials.</li>
                        <li>Respect local culture and follow your guide.</li>
                        <li>Stay hydrated and enjoy every moment.</li>
                      </ul>
                    </div>
                    <div className="rounded-3xl bg-primary/10 p-6">
                      <h3 className="text-xl font-semibold mb-3">Suggested Experience</h3>
                      <p className="text-slate-700">
                        Book early for premium accommodations, sunrise activities, and curated dining experiences that elevate every itinerary.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </article>

            <aside className="space-y-6 lg:sticky lg:top-28">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <h2 className="text-xl font-bold mb-3.5 text-slate-900">Quick Facts</h2>
                <div className="space-y-2.5 text-slate-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Category</span>
                    <span className="font-medium text-slate-900">{blog.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Author</span>
                    <span className="font-medium text-slate-900">{blog.author}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">{blog.lastUpdated ? 'Last Updated' : 'Date'}</span>
                    <span className="font-medium text-slate-900">{blog.lastUpdated || formattedDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Read Time</span>
                    <span className="font-medium text-slate-900">{blog.readTime} min</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-xl font-bold mb-3.5 text-slate-900">Related Articles</h2>
                <div className="space-y-3">
                  {relatedPosts.map((item) => (
                    <Link key={item.id} href={`/blog/${item.slug}`} className="block rounded-xl border border-slate-200 p-3.5 transition hover:border-primary/40 hover:bg-primary/5">
                      <p className="text-base font-semibold text-slate-900 leading-snug">{item.title}</p>
                      <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">{item.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
