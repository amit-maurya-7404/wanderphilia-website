'use client'

import { useEffect, useState } from 'react'
import { ReviewCard } from '@/components/review-card'
import { Star } from 'lucide-react'

interface ReviewItem {
  _id: string
  name: string
  platform: 'Google' | 'Facebook' | 'Justdial'
  rating: number
  comment: string
  createdAt: string
}

export function ReviewsSection() {
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch('/api/reviews')
        if (!response.ok) {
          throw new Error('Unable to load reviews')
        }
        const data = await response.json()
        setReviews(data)
      } catch (error) {
        setError((error as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  const displayReviews = reviews.slice(0, 6)
  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0'
  const totalReviews = reviews.length

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-semibold text-sm mb-4">
              ⭐ Customer Reviews
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our Travelers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trusted by thousands of travelers. Here's what they have to say about their Wanderphilia experiences.
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">Loading reviews...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 text-red-600">{error}</div>
        </div>
      </section>
    )
  }

  if (reviews.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-semibold text-sm mb-4">
              ⭐ Customer Reviews
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our Travelers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trusted by thousands of travelers. Here's what they have to say about their Wanderphilia experiences.
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">No reviews available yet. Check back soon!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-semibold text-sm mb-4">
            ⭐ Customer Reviews
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Travelers Say
          </h2>

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={24}
                  className="fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <div className="text-left">
              <p className="text-3xl font-bold text-gray-900">{avgRating}</p>
              <p className="text-gray-600 text-sm">{totalReviews} reviews across platforms</p>
            </div>
          </div>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Trusted by thousands of travelers. Here's what they have to say about their Wanderphilia experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayReviews.map((review) => (
            <ReviewCard key={review._id} {...review} />
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 border-t border-gray-200">
          {[
            { name: 'Google', rating: '4.9', reviews: 234, color: 'text-blue-600' },
            { name: 'Facebook', rating: '4.8', reviews: 156, color: 'text-blue-700' },
            { name: 'Justdial', rating: '4.9', reviews: 89, color: 'text-orange-600' },
          ].map((platform) => (
            <div key={platform.name} className="text-center">
              <p className="text-sm font-semibold text-gray-500 mb-2">{platform.name}</p>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className={`text-3xl font-bold ${platform.color}`}>{platform.rating}</span>
                <Star size={20} className="fill-yellow-400 text-yellow-400" />
              </div>
              <p className="text-gray-600 text-sm">{platform.reviews} reviews</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 transition-colors"
          >
            Share Your Experience →
          </a>
        </div>
      </div>
    </section>
  )
}
