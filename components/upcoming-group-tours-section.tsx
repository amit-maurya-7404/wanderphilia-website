'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { trips } from '@/lib/data'
import { getPageSectionMapping } from '@/lib/section-mappings'
import { TripCard } from '@/components/trip-card'

export function UpcomingGroupToursSection() {

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

  const upcomingTourIds = getPageSectionMapping('upcomingTours')
  const upcomingTrips = upcomingTourIds
    .map((id) => trips.find((trip) => trip.id === id))
    .filter((trip): trip is typeof trips[number] => Boolean(trip))

  const fallbackUpcomingTrips = trips
    .filter((trip) => trip.dates.some((date) => date.spots > 0))
    .slice(0, 6)

  const displayUpcomingTrips = upcomingTrips.length > 0 ? upcomingTrips : fallbackUpcomingTrips
  const maxIndex = Math.max(0, displayUpcomingTrips.length - cardsPerView)

  const nextSlide = () => {
    setIndex((prev) => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setIndex((prev) => Math.max(prev - 1, 0))
  }

  return (
    <section className="pt-20 md:pt-20 bg-linear-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
            ✨ Limited Spots Available
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Upcoming Group Tours
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join our curated group adventures to amazing destinations.
          </p>
        </div>

        {/* SLIDER */}
        <div className="relative">

          {/* ✅ MOBILE SCROLLER */}
          {isMobile ? (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {displayUpcomingTrips.map((trip) => (
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
                  {displayUpcomingTrips.map((trip) => (
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

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="/trips"
            className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 transition-colors"
          >
            View All Tours →
          </a>
        </div>

      </div>
    </section>
  )
}