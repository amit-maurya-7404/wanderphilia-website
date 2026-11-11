import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { blogs } from '@/lib/data'
import { ArrowLeft, Clock, Tag } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

import { Metadata } from 'next'

interface BlogPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params
  const blog = blogs.find((item) => item.slug === slug)

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
  return blogs.map((blog) => ({ slug: blog.slug }))
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params
  const blog = blogs.find((item) => item.slug === slug)


  if (!blog) {
    notFound()
  }

  const formattedDate = new Date(blog.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const relatedPosts = blogs.filter((item) => item.slug !== blog.slug).slice(0, 2)

  return (
    <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <header className="relative min-h-144 overflow-hidden bg-slate-950 text-white pt-20">
          <div className="absolute inset-0 opacity-70 bg-black" />
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 lg:px-10 lg:py-16">
            <div className="max-w-3xl">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white mb-6"
              >
                <ArrowLeft size={16} /> Back to Blog
              </Link>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary mb-4">
                <Tag size={14} /> {blog.category}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">{blog.title}</h1>
              <p className="text-lg text-white/90 mb-8">{blog.excerpt}</p>
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between text-sm text-white/70">
                <p>By {blog.author}</p>
                <p>{blog.lastUpdated ? `Updated ${blog.lastUpdated}` : formattedDate} • {blog.readTime} min read</p>
              </div>
            </div>
          </div>
        </header>

        <main className="grow">
          <section className="max-w-7xl mx-auto px-6 py-16 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-8 lg:gap-12 items-start">
              <article className="prose prose-slate prose-xl max-w-none">
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
