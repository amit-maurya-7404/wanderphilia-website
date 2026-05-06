'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react'
import { Blog } from '@/lib/data'

interface BlogCardProps extends Blog {}

export function BlogCard({
  slug,
  title,
  image,
  excerpt,
  author,
  date,
  category,
  readTime,
}: BlogCardProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100">
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-gray-200">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category Badge */}
        <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          <Tag size={14} />
          {category}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 grow line-clamp-2">{excerpt}</p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-1">
            <Calendar size={14} className="text-primary" />
            {formattedDate}
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-primary" />
            {readTime} min read
          </div>
        </div>

        {/* Author and CTA */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">By {author}</p>
          </div>
          <Link href={`/blog/${slug}`} target="_blank" rel="noopener noreferrer">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:bg-primary/10 font-semibold"
            >
              Read More
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </article>
  )
}
