'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TripCard } from '@/components/trip-card'
import { trips } from '@/lib/data'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function FeaturedTripsSection() {
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

  const featuredTrips = trips.slice(0, 6)
  const maxIndex = Math.max(0, featuredTrips.length - cardsPerView)

  const nextSlide = () => {
    setIndex((prev) => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setIndex((prev) => Math.max(prev - 1, 0))
  }

  return (
    <section id="featured" className="mt-[10vw] md:mt-[5vw]  bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center items-center justify-center ">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-1 bg-primary rounded-full" />
            <span className="text-primary font-semibold text-sm tracking-widest uppercase">
              Curated Experiences
            </span>
            <div className="w-12 h-1 bg-primary rounded-full" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Featured Adventures
          </h2>
          <p className="text-xl text-center text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Handpicked journeys designed for explorers who demand more. Each trip is carefully curated to deliver unforgettable memories and authentic experiences.
          </p>
        </div>

        {/* SLIDER */}
        <div className="relative mb-12">

          {/* ✅ MOBILE SCROLLER */}
          {isMobile ? (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {featuredTrips.map((trip) => (
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
                  {featuredTrips.map((trip) => (
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

        {/* CTA Button */}
        <div className="flex justify-center">
          <Button asChild className="hidden  md:flex w-[14vw]  mt-0 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-semibold h-auto">
            <Link href="/trips?type=International">Explore All</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
  
