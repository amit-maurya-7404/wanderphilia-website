'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ArrowRight, BookOpen, Sparkles, ChevronRight } from 'lucide-react'
import type { DbBlog } from '@/lib/blogs-db'
import { blogs as staticBlogs } from '@/lib/data'
import { isBlogForDestination } from '@/lib/blog-destination'

export { isBlogForDestination }

interface DestinationBlogsSectionProps {
  destinationName: string
  destinationSlug?: string
  title?: string
  subtitle?: string
  className?: string
  maxBlogs?: number
}

export function DestinationBlogsSection({
  destinationName,
  destinationSlug,
  title,
  subtitle,
  className = '',
  maxBlogs = 6,
}: DestinationBlogsSectionProps) {
  // Initialize with static blogs so SSR and immediate render work with zero lag or empty flash
  const [blogs, setBlogs] = useState<DbBlog[]>(() => {
    return (staticBlogs as unknown as DbBlog[]) || []
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let isMounted = true

    // Fetch dynamic blogs from MongoDB to include any newly published blogs
    fetch('/api/blogs')
      .then((res) => (res.ok ? res.json() : { blogs: [] }))
      .then((data) => {
        if (!isMounted) return
        if (Array.isArray(data.blogs) && data.blogs.length > 0) {
          // Merge dynamic blogs over static blogs by slug / id
          setBlogs((prev) => {
            const map = new Map<string, DbBlog>()
            prev.forEach((b) => map.set(b.slug || b.id, b))
            data.blogs.forEach((b: DbBlog) => map.set(b.slug || b.id, b))
            return Array.from(map.values())
          })
        }
      })
      .catch((err) => {
        console.warn('[DestinationBlogsSection] Failed to load blogs:', err)
      })

    return () => {
      isMounted = false
    }
  }, [destinationName, destinationSlug])

  // Filter only blogs matching this specific destination
  const destinationBlogs = useMemo(() => {
    return blogs
      .filter((b) => isBlogForDestination(b, destinationName, destinationSlug))
      .slice(0, maxBlogs)
  }, [blogs, destinationName, destinationSlug, maxBlogs])

  // If loading or no blogs for this destination, render nothing (no empty placeholder boxes)
  if (loading || destinationBlogs.length === 0) {
    return null
  }

  const cleanDestTitle =
    destinationName.charAt(0).toUpperCase() + destinationName.slice(1)
  const displayTitle = title || `Travel Guides & Stories for ${cleanDestTitle}`
  const displaySubtitle =
    subtitle ||
    `Insider tips, weather guides, cultural highlights & travel inspiration curated by Wanderphilia experts.`

  return (
    <section className={`py-12 sm:py-16 bg-gradient-to-b from-slate-50/60 via-white to-orange-50/20 border-t border-slate-200/80 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff5d09]/10 border border-[#ff5d09]/20 text-[#ff5d09] font-bold text-xs uppercase tracking-wider mb-2.5">
              <BookOpen size={13} className="text-[#ff5d09]" />
              <span>{cleanDestTitle} Travel Stories & Guides</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              {displayTitle}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              {displaySubtitle}
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#ff5d09] hover:text-orange-700 transition-colors shrink-0 group self-start md:self-end"
          >
            <span>View All Stories</span>
            <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {destinationBlogs.map((blog) => {
            const formattedDate = blog.date
              ? new Date(blog.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : 'Recent Guide'

            return (
              <Link
                key={blog.id || blog.slug}
                href={`/blog/${blog.slug}`}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/90 hover:border-orange-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full shadow-2xs"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={blog.image || '/images/default-blog.jpg'}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-orange-400 font-extrabold text-[10px] uppercase tracking-wider border border-white/10 shadow-sm">
                    {blog.category || `${cleanDestTitle} Guide`}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex flex-col grow justify-between">
                  <div>
                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400 mb-2.5">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-[#ff5d09]" />
                        {formattedDate}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-slate-400" />
                        {blog.readTime || 5} min read
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-snug group-hover:text-[#ff5d09] transition-colors line-clamp-2 mb-2.5">
                      {blog.title}
                    </h3>

                    {/* Excerpt */}
                    {blog.excerpt && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                        {blog.excerpt}
                      </p>
                    )}
                  </div>

                  {/* Read More Link */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <span className="text-[11px] text-slate-400 font-medium truncate max-w-[180px]">
                      By {blog.author ? blog.author.split(' at ')[0] : 'Wanderphilia'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#ff5d09] group-hover:translate-x-0.5 transition-transform">
                      Read Guide <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
