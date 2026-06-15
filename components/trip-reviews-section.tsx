'use client'

import { useEffect, useState, useMemo } from 'react'
import { ReviewCard } from '@/components/review-card'
import { Star, MessageSquare, Compass, Loader2 } from 'lucide-react'

interface ReviewItem {
  _id: string
  name: string
  platform: 'Google' | 'Facebook' | 'Justdial' | 'Wanderphilia'
  rating: number
  comment: string
  createdAt: string
  profilePhotoUrl?: string
  relativeTime?: string
  images?: string[]
  tripSlug?: string | null
  categoryId?: string | null
}

interface TripReviewsSectionProps {
  tripSlug: string
  categoryId: string
}

export function TripReviewsSection({ tripSlug, categoryId }: TripReviewsSectionProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true)
        const response = await fetch(`/api/reviews?tripSlug=${tripSlug}&categoryId=${categoryId}`)
        if (!response.ok) {
          throw new Error('Unable to load reviews')
        }
        const data = await response.json()
        setReviews(data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [tripSlug, categoryId])

  // Compute stats for reviews that match this specific trip
  const reviewStats = useMemo(() => {
    // Separate trip-specific reviews from general reviews
    const specificReviews = reviews.filter(r => r.tripSlug === tripSlug)

    // Fallback to general reviews if no specific reviews exist
    const displayList = specificReviews.length > 0 ? specificReviews : reviews.filter(r => !r.tripSlug)

    if (displayList.length === 0) {
      return { avgRating: '0.0', totalReviews: 0, displayReviews: [], hasSpecific: false }
    }

    const avgRating = (displayList.reduce((sum, r) => sum + r.rating, 0) / displayList.length).toFixed(1)
    const totalReviews = displayList.length
    const displayReviews = displayList.slice(0, 6)

    return {
      avgRating,
      totalReviews,
      displayReviews,
      hasSpecific: specificReviews.length > 0
    }
  }, [reviews, tripSlug])

  if (loading) {
    return (
      <div className="py-16 text-center flex flex-col items-center justify-center gap-3 bg-slate-50/50 rounded-3xl border border-slate-100/60 my-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-slate-500 font-bold text-sm">Loading reviews for this package...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12 text-center bg-rose-50 text-rose-600 rounded-3xl border border-rose-100 my-8 px-6">
        <p className="font-extrabold mb-1">Failed to load reviews</p>
        <p className="text-xs text-rose-500">{error}</p>
      </div>
    )
  }

  return (
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-yellow-100 text-yellow-700 font-extrabold text-xs mb-3 uppercase tracking-widest">
            ⭐ Traveler Experiences
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
            {reviewStats.hasSpecific ? 'What Our Travelers Say About This Trip' : 'What Our Travelers Say'}
          </h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto font-medium">
            Real feedback from adventurers who traveled with Wanderphilia.
          </p>

          {reviewStats.totalReviews > 0 ? (
            <div className="flex items-center justify-center gap-3.5 mt-6 bg-slate-50 border border-slate-200/50 py-3.5 px-6 rounded-2xl w-fit mx-auto shadow-2xs">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={`fill-amber-400 text-amber-400 ${i < Math.round(Number(reviewStats.avgRating)) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-none'
                      }`}
                  />
                ))}
              </div>
              <div className="text-left border-l border-slate-200 pl-3.5">
                <p className="text-2xl font-black text-slate-900 leading-none">{reviewStats.avgRating}</p>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-1">
                  {reviewStats.totalReviews} {reviewStats.hasSpecific ? 'Trip Reviews' : 'General Reviews'}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {reviewStats.totalReviews === 0 ? (
          /* Empty State Review CTA */
          <div className="text-center py-12 px-6 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 max-w-xl mx-auto">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-4" />
            <h3 className="text-base font-extrabold text-slate-800 mb-1">No reviews for this package yet</h3>
            <p className="text-slate-500 text-xs font-semibold mb-6 max-w-sm mx-auto">
              Did you recently complete this trip? Share your photos and rating with the Wanderphilia community!
            </p>
            <a
              href={`/review?tripSlug=${tripSlug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-extrabold text-xs rounded-xl hover:bg-primary/95 transition duration-200 shadow-md shadow-primary/10 active:scale-98 cursor-pointer"
            >
              Write First Review
            </a>
          </div>
        ) : (
          /* Reviews Grid */
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviewStats.displayReviews.map((review) => (
                <ReviewCard key={review._id} {...review} />
              ))}
            </div>

            {/* General platform ratings footer section */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-slate-100 max-w-4xl mx-auto">
              {[
                { name: 'Google', rating: '4.9', reviews: 234, color: 'text-red-600', bgColor: 'bg-red-50/30 border-red-100/60' },
                { name: 'Facebook', rating: '4.8', reviews: 156, color: 'text-blue-700', bgColor: 'bg-blue-50/30 border-blue-100/60' },
                { name: 'Justdial', rating: '4.9', reviews: 89, color: 'text-orange-600', bgColor: 'bg-orange-50/30 border-orange-100/60' },
              ].map((platform) => (
                <div key={platform.name} className={`p-4 rounded-xl border text-center ${platform.bgColor}`}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{platform.name}</p>
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className={`text-xl font-black ${platform.color}`}>{platform.rating}</span>
                    <Star size={14} className="fill-amber-400 text-amber-400 shrink-0" />
                  </div>
                  <p className="text-slate-400 text-[10px] font-semibold">{platform.reviews} reviews</p>
                </div>
              ))}
            </div>

            {/* Write a review CTA button */}
            <div className="mt-10 text-center">
              <a
                href={`/review?tripSlug=${tripSlug}`}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-extrabold rounded-full hover:bg-primary/95 transition duration-200 shadow-md shadow-primary/10 active:scale-98 cursor-pointer text-sm"
              >
                Share Your Experience →
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
