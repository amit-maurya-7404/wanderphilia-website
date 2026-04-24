'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DestinationCard } from '@/components/destination-card'
import { destinations } from '@/lib/data'

export function DestinationsSection() {

  const [isMobile, setIsMobile] = useState(false)
  const [cardsPerView, setCardsPerView] = useState(4)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setCardsPerView(mobile ? 1 : 4)
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    setIndex(0)
  }, [cardsPerView])

  const maxIndex = Math.max(0, destinations.length - cardsPerView)

  const nextSlide = () => {
    setIndex((prev) => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setIndex((prev) => Math.max(prev - 1, 0))
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-1 bg-primary rounded-full" />
            <span className="text-primary font-semibold text-sm tracking-widest uppercase">
              World Awaits
            </span>
            <div className="w-12 h-1 bg-primary rounded-full" />
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Trending Destinations
          </h2>

          <p className="text-xl text-gray-600">
            From ancient temples to untamed wilderness, discover the world’s most extraordinary destinations.
          </p>
        </div>

        {/* SLIDER */}
        <div className="relative">

          {isMobile ? (
            // ✅ MOBILE SCROLL
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {destinations.map((destination) => (
                <div
                  key={destination.slug}
                  className="min-w-[75%] flex-shrink-0"
                >
                  <DestinationCard {...destination} />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* LEFT */}
              <button
                onClick={prevSlide}
                disabled={index === 0}
                className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40"
              >
                <ChevronLeft size={20} />
              </button>

              {/* RIGHT */}
              <button
                onClick={nextSlide}
                disabled={index === maxIndex}
                className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40"
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
                  {destinations.map((destination) => (
                    <div
                      key={destination.slug}
                      className="flex-shrink-0 basis-1/4 p-2"
                    >
                      <DestinationCard {...destination} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>

      </div>
    </section>
  )
}