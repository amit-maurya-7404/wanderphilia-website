'use client'

import { useEffect, useState, useRef } from 'react'
import { ReviewCard } from '@/components/review-card'
import { Star, ChevronLeft, ChevronRight, MessageSquare, ExternalLink } from 'lucide-react'

interface ReviewItem {
  _id: string
  name: string
  platform: 'Google' | 'Facebook' | 'Justdial'
  rating: number
  comment: string
  createdAt: string
  profilePhotoUrl?: string
  relativeTime?: string
}

interface PlatformStat {
  rating: number
  count: number
}

interface StatsData {
  platforms: {
    Google: PlatformStat
    Facebook: PlatformStat
    Justdial: PlatformStat
  }
  summary: {
    avgRating: string
    totalReviews: number
  }
}

export function ReviewsSection() {
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const [reviewsRes, statsRes] = await Promise.all([
          fetch('/api/reviews'),
          fetch('/api/reviews/stats'),
        ])

        if (!reviewsRes.ok || !statsRes.ok) {
          throw new Error('Unable to load reviews')
        }

        const reviewsData = await reviewsRes.json()
        const statsData = await statsRes.json()

        setReviews(reviewsData)
        setStats(statsData)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current
      const cardWidth = 360 // Approx width of card + gap
      const scrollAmount =
        direction === 'left'
          ? scrollLeft - cardWidth * 2
          : scrollLeft + cardWidth * 2

      sliderRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const avgRating = stats?.summary.avgRating || '4.9'
  const totalReviews = stats?.summary.totalReviews || 479

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 font-semibold text-xs mb-4 uppercase tracking-wider">
              ⭐ Customer Reviews
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              What Our Travelers Say
            </h2>
          </div>
          <div className="text-center py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Fetching real-time reviews...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 text-red-600 bg-red-50 rounded-2xl border border-red-100 p-6">
            <p className="font-semibold mb-2">Failed to load reviews data</p>
            <p className="text-sm text-red-500">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 border-t border-b border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12 flex flex-col items-center">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
            ⭐ Customer Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Verified Reviews From Travelers
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            We aggregate raw feedback across platforms. Here is the real experience of our community on their travels.
          </p>

          {/* Dynamic Average Block */}
          <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm shrink-0">
            <div className="bg-amber-400 text-white rounded-xl w-14 h-14 flex items-center justify-center text-2xl font-black shadow-md shadow-amber-400/20">
              {avgRating}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-0.5 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                {totalReviews} Verified Reviews
              </p>
            </div>
          </div>
        </div>

        {/* Carousel Slider Wrapper */}
        <div className="relative group/slider">
          {/* Navigation Buttons */}
          <button
            onClick={() => scrollSlider('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur border border-gray-200 shadow-lg text-gray-700 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all opacity-0 group-hover/slider:opacity-100 focus:opacity-100 pointer-events-auto hidden md:flex"
            aria-label="Previous review"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button
            onClick={() => scrollSlider('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur border border-gray-200 shadow-lg text-gray-700 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all opacity-0 group-hover/slider:opacity-100 focus:opacity-100 pointer-events-auto hidden md:flex"
            aria-label="Next review"
          >
            <ChevronRight size={20} />
          </button>

          {/* Slider Content */}
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-8 px-1 scroll-smooth"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {reviews.map((review) => (
              <div
                key={review._id}
                className="w-[300px] md:w-[360px] shrink-0 snap-start select-none"
              >
                <ReviewCard {...review} />
              </div>
            ))}
          </div>
        </div>

        {/* Platform Stat Summary Cards */}
        {stats && (() => {
          const activePlatforms = [
            {
              name: 'Google',
              rating: stats.platforms.Google.rating.toFixed(1),
              reviews: stats.platforms.Google.count,
              color: 'text-red-500 bg-red-50/50 hover:bg-red-50',
              borderColor: 'border-red-100/70',
              link: 'https://www.google.com/search?q=Wanderphilia+reviews',
            },
            {
              name: 'Facebook',
              rating: stats.platforms.Facebook.rating.toFixed(1),
              reviews: stats.platforms.Facebook.count,
              color: 'text-blue-600 bg-blue-50/50 hover:bg-blue-50',
              borderColor: 'border-blue-100/70',
              link: 'https://www.facebook.com/wanderphilia/reviews',
            },
            {
              name: 'Justdial',
              rating: stats.platforms.Justdial.rating.toFixed(1),
              reviews: stats.platforms.Justdial.count,
              color: 'text-orange-500 bg-orange-50/50 hover:bg-orange-50',
              borderColor: 'border-orange-100/70',
              link: 'https://www.justdial.com',
            },
          ].filter((p) => p.reviews > 0)

          if (activePlatforms.length === 0) return null

          return (
            <div className={`mt-8 grid grid-cols-1 ${
              activePlatforms.length === 1
                ? 'sm:grid-cols-1 max-w-md mx-auto'
                : activePlatforms.length === 2
                ? 'sm:grid-cols-2 max-w-2xl mx-auto'
                : 'sm:grid-cols-3'
            } gap-6 pt-12 border-t border-gray-200/60`}>
              {activePlatforms.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-5 rounded-2xl border ${platform.borderColor} ${platform.color} transition-all duration-300 flex items-center justify-between group/pcard hover:shadow-md`}
                >
                  <div className="text-left">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      {platform.name}
                    </span>
                    <span className="text-gray-900 font-extrabold text-xs block">
                      {platform.reviews} Total Reviews
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-black text-gray-900 tracking-tight">
                        {platform.rating}
                      </span>
                      <Star size={16} className="fill-amber-400 text-amber-400 shrink-0" />
                    </div>
                    <ExternalLink size={14} className="text-gray-300 group-hover/pcard:text-gray-500 transition-colors ml-1" />
                  </div>
                </a>
              ))}
            </div>
          )
        })()}

        {/* Action Buttons */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://www.google.com/search?q=Wanderphilia+reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-white font-bold rounded-full hover:bg-primary/95 shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-sm"
          >
            <MessageSquare size={16} />
            Write A Google Review
          </a>
          <a
            href="https://www.google.com/search?q=Wanderphilia+reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-gray-800 font-bold rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all text-sm shadow-sm"
          >
            See All Reviews
            <ExternalLink size={14} className="text-gray-500" />
          </a>
        </div>

      </div>
    </section>
  )
}
