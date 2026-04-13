'use client'

import { videoTestimonials } from '@/lib/data'
import { VideoCard } from '@/components/video-card'
import { Play } from 'lucide-react'

export function VideoTestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex px-4 py-2 rounded-full bg-red-100 text-red-700 font-semibold text-sm mb-4 items-center gap-2 justify-center mx-auto w-fit">
            <Play size={16} />
            Video Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Traveler Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Listen directly from our travelers about their unforgettable experiences with Wanderphilia.
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videoTestimonials.map((video) => (
            <VideoCard key={video.id} {...video} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="https://youtube.com/wanderphilia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors"
          >
            <Play size={20} className="fill-white" />
            Watch More Videos
          </a>
        </div>
      </div>
    </section>
  )
}
