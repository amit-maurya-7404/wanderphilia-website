'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import type { Trip } from '@/lib/data'
import { TripCard } from '@/components/trip-card'
import { Parachute } from '@/components/parachute-icon'
import { ChevronLeft, ChevronRight, Sparkles, Filter } from 'lucide-react'

interface HolidayTripSliderProps {
  trips: Trip[]
  title?: string
  subtitle?: string
  badge?: string
  badgeIcon?: React.ReactNode
  linkPrefix?: string
  showFilterPills?: boolean
}

export function HolidayTripSlider({
  trips,
  title = 'Special Holiday Itineraries',
  subtitle = 'Handpicked tours departing for Christmas & New Year celebrations.',
  badge = 'Featured Holiday Departures',
  badgeIcon,
  linkPrefix = '/christmas-new-year/trips',
  showFilterPills = true,
}: HolidayTripSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('all')

  // Extract unique categories / destinations for filter pills
  const categories = useMemo(() => {
    const map = new Map<string, number>()
    trips.forEach((t) => {
      // Normalize category or destination name
      const cat = t.category?.trim() || t.destination?.trim() || 'Special'
      const key = cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()
      map.set(key, (map.get(key) || 0) + 1)
    })
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [trips])

  // Filter trips based on active pill
  const filteredTrips = useMemo(() => {
    if (activeCategory === 'all') return trips
    return trips.filter((t) => {
      const cat = (t.category?.trim() || t.destination?.trim() || '').toLowerCase()
      return cat === activeCategory.toLowerCase()
    })
  }, [trips, activeCategory])

  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 15)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 15)
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const card = scrollRef.current.querySelector('.trip-slide-card') as HTMLElement
    const cardWidth = card ? card.clientWidth : 360
    const gap = 24
    // On desktop scroll by 2-3 cards, on tablet by 2, on mobile by 1
    const count = window.innerWidth >= 1200 ? 3 : window.innerWidth >= 768 ? 2 : 1
    const scrollAmount = (cardWidth + gap) * count
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    checkScroll()
    const ref = scrollRef.current
    if (ref) {
      ref.addEventListener('scroll', checkScroll, { passive: true })
      return () => ref.removeEventListener('scroll', checkScroll)
    }
  }, [filteredTrips])

  // Reset scroll to 0 when category filter changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
      setTimeout(checkScroll, 300)
    }
  }, [activeCategory])

  if (!trips || trips.length === 0) return null

  return (
    <div className="space-y-6">
      {/* Header section with Title, Subtitle, and Carousel Arrows */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div>
          {badge && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary font-bold text-xs uppercase tracking-wider mb-2.5">
              {badgeIcon || <Parachute size={14} className="text-primary" />}
              <span>{badge}</span>
            </div>
          )}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1.5 text-xs sm:text-base text-slate-400 max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
          <div className="text-xs text-slate-400 font-medium px-2 py-1 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-amber-400 font-bold">{filteredTrips.length}</span>{' '}
            {filteredTrips.length === 1 ? 'Tour' : 'Tours'}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700/80 text-white flex items-center justify-center hover:bg-slate-800 hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md cursor-pointer"
              aria-label="Previous Itineraries"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700/80 text-white flex items-center justify-center hover:bg-slate-800 hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md cursor-pointer"
              aria-label="Next Itineraries"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Pills (if multiple categories and showFilterPills is true) */}
      {showFilterPills && categories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide pt-1">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-primary text-white shadow-md shadow-orange-950/40 ring-1 ring-orange-400/50'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            All Destinations ({trips.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setActiveCategory(c.name)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory.toLowerCase() === c.name.toLowerCase()
                  ? 'bg-primary text-white shadow-md shadow-orange-950/40 ring-1 ring-orange-400/50'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {c.name} ({c.count})
            </button>
          ))}
        </div>
      )}

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 scrollbar-hide snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {filteredTrips.map((trip) => (
          <div
            key={trip.id}
            className="trip-slide-card w-[82vw] sm:w-[340px] md:w-[350px] lg:w-[360px] shrink-0 snap-start"
          >
            <TripCard {...trip} linkPrefix={linkPrefix} darkTheme />
          </div>
        ))}
      </div>
    </div>
  )
}

