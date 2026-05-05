'use client'

import { useState, useEffect } from 'react'
import { trips } from '@/lib/data'
import { getPageSectionMapping } from '@/lib/section-mappings'
import { TripCard } from '@/components/trip-card'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function HoneymoonPackagesSection() {
  const [index, setIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [cardsPerView, setCardsPerView] = useState(4)

  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setCardsPerView(mobile ? 2 : 4)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // reset index when layout changes
  useEffect(() => {
    setIndex(0)
  }, [cardsPerView])

  const honeymoonPackageIds = getPageSectionMapping('honeymoonPackages')
  const honeymoonPackages = honeymoonPackageIds
    .map((id) => trips.find((trip) => trip.id === id))
    .filter((trip): trip is typeof trips[number] => Boolean(trip))

  const fallbackHoneymoonPackages = trips
    .filter((trip) => trip.difficulty !== 'Hard' && trip.groupSize <= 20)
    .slice(0, 8)

  const displayHoneymoonPackages = honeymoonPackages.length > 0 ? honeymoonPackages : fallbackHoneymoonPackages
  const maxIndex = Math.max(0, displayHoneymoonPackages.length - cardsPerView)

  const nextSlide = () => {
    setIndex((prev) => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setIndex((prev) => Math.max(prev - 1, 0))
  }

  return (
    <section className="py-6 md:pt-0 bg-linear-to-b from-white via-pink-50/30 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-pink-100 text-pink-700 font-semibold text-sm mb-4">
            💕 Romantic Getaways
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Honeymoon Packages
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create unforgettable memories with your loved one. Our exclusive honeymoon packages offer luxury, romance, and adventure.
          </p>
        </div>

        {/* SLIDER */}
        <div className="relative mb-12">

          {/* ✅ MOBILE SCROLLER */}
          {isMobile ? (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {displayHoneymoonPackages.map((trip) => (
                <div
                  key={trip.id}
                  className="min-w-[75%] flex-shrink-0"
                >
                  <TripCard {...trip} />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* LEFT ARROW */}
              <button
                onClick={prevSlide}
                disabled={index === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40"
              >
                <ChevronLeft size={20} />
              </button>

              {/* RIGHT ARROW */}
              <button
                onClick={nextSlide}
                disabled={index === maxIndex}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40"
              >
                <ChevronRight size={20} />
              </button>

              {/* TRACK */}
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${index * (100 / cardsPerView)}%)`,
                  }}
                >
                  {displayHoneymoonPackages.map((trip) => (
                    <div
                      key={trip.id}
                      className="flex-shrink-0 basis-1/4 p-2"
                    >
                      <TripCard {...trip} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>

        {/* Features */}
        {/* <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '🛏️', title: 'Luxury Stays', desc: 'Premium resorts and romantic hotels' },
            { icon: '🍽️', title: 'Gourmet Dining', desc: 'Fine dining and local cuisine experiences' },
            { icon: '💇', title: 'Spa & Wellness', desc: 'Couples spa treatments and relaxation' },
          ].map((feature, idx) => (
            <div key={idx} className="text-center">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div> */}

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-linear-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full hover:from-pink-600 hover:to-rose-600 transition-all"
          >
            Plan Your Honeymoon →
          </a>
        </div>
      </div>
    </section>
  )
}
