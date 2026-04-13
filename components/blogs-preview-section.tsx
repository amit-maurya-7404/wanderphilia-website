'use client'

import { blogs } from '@/lib/data'
import { BlogCard } from '@/components/blog-card'

export function BlogsPreviewSection() {
  const latestBlogs = blogs.slice(0, 3)

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
            📚 Travel Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Latest Travel Blogs
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover inspiring travel stories, local tips, and hidden gems from our community.
          </p>
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestBlogs.map((blog) => (
            <BlogCard key={blog.id} {...blog} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="/blog"
            className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 transition-colors"
          >
            Read More Articles →
          </a>
        </div>
      </div>
    </section>
  )
}
