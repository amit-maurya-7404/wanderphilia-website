import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { blogs } from '@/lib/data'
import { ArrowLeft, Clock, Tag } from 'lucide-react'

interface BlogPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return blogs.map((blog) => ({ slug: blog.slug }))
}

export default function BlogPostPage({ params }: BlogPageProps) {
  const blog = blogs.find((item) => item.slug === params.slug)

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
      <header className="relative min-h-144 overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 opacity-70 bg-black" />
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          className="object-cover object-center"
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
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">{blog.title}</h1>
            <p className="text-lg text-white/90 mb-8">{blog.excerpt}</p>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between text-sm text-white/70">
              <p>By {blog.author}</p>
              <p>{formattedDate} • {blog.readTime} min read</p>
            </div>
          </div>
        </div>
      </header>

      <main className="grow">
        <section className="max-w-6xl mx-auto px-6 py-16 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
            <article className="prose prose-slate prose-xl max-w-none">
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
            </article>

            <aside className="space-y-8">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-4">Quick Facts</h2>
                <div className="space-y-3 text-slate-700">
                  <div className="flex justify-between text-sm">
                    <span>Category</span>
                    <span>{blog.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Author</span>
                    <span>{blog.author}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Date</span>
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Read Time</span>
                    <span>{blog.readTime} min</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-4">Related Articles</h2>
                <div className="space-y-4">
                  {relatedPosts.map((item) => (
                    <Link key={item.id} href={`/blog/${item.slug}`} className="block rounded-2xl border border-slate-200 p-4 transition hover:border-primary/40 hover:bg-primary/5">
                      <p className="text-lg font-semibold text-slate-900">{item.title}</p>
                      <p className="text-sm text-slate-600 mt-2">{item.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  )
}
