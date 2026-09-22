'use client'

import { useState, useRef, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, ChevronLeft, ChevronRight, ArrowRight, MapPin, Compass, Globe, Gift } from 'lucide-react'
import { trips, getLowestPriceForTrips } from '@/lib/data'
import { getAllCategories } from '@/lib/trip-categories'
import { getChristmasNewYearTrips } from '@/lib/christmas-filter'

// Detailed Realistic Santa Hat Vector
function SantaHat({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="santaRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff4d4d" />
          <stop offset="60%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
        <linearGradient id="fluffWhite" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Main Hat Body with smooth fold */}
      <path
        d="M18 58 C 22 28, 48 8, 76 14 C 86 16, 94 28, 88 43 C 82 38, 72 32, 60 42 C 45 53, 30 57, 18 58 Z"
        fill="url(#santaRed)"
        filter="url(#shadow)"
      />
      {/* Fluffy Pompom on tip */}
      <circle cx="87" cy="46" r="9.5" fill="url(#fluffWhite)" filter="url(#shadow)" />
      <circle cx="85" cy="44" r="7" fill="#ffffff" />

      {/* Fluffy Brim base */}
      <rect x="8" y="52" width="64" height="17" rx="8.5" fill="url(#fluffWhite)" filter="url(#shadow)" />
      <circle cx="15" cy="60.5" r="7.5" fill="#ffffff" />
      <circle cx="28" cy="60.5" r="7.5" fill="#ffffff" />
      <circle cx="41" cy="60.5" r="7.5" fill="#ffffff" />
      <circle cx="54" cy="60.5" r="7.5" fill="#ffffff" />
      <circle cx="64" cy="60.5" r="7.5" fill="#ffffff" />
    </svg>
  )
}

// Detailed Christmas Bells Vector with Ribbon Bow
function ChristmasBells({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="bellGold1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
        <linearGradient id="bellGold2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="60%" stopColor="#ca8a04" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>
        <linearGradient id="ribbonRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
      </defs>

      {/* Left Bell */}
      <path
        d="M24 18 C24 11, 33 11, 33 18 L37 36 C39 41, 45 42, 45 46 L13 46 C13 42, 19 41, 21 36 Z"
        fill="url(#bellGold1)"
        stroke="#a16207"
        strokeWidth="1.5"
      />
      {/* Right Bell */}
      <path
        d="M39 23 C39 16, 48 16, 48 23 L52 39 C54 43, 58 44, 58 48 L28 48 C28 44, 32 43, 34 39 Z"
        fill="url(#bellGold2)"
        stroke="#a16207"
        strokeWidth="1.5"
      />
      {/* Clappers */}
      <circle cx="29" cy="48" r="4.5" fill="#854d0e" />
      <circle cx="43" cy="50" r="4.5" fill="#854d0e" />

      {/* Red Ribbon Bow */}
      <path
        d="M29 15 C21 10, 17 18, 27 20 C31 21, 34 19, 36 15 C38 19, 41 21, 45 20 C55 18, 51 10, 43 15 Z"
        fill="url(#ribbonRed)"
      />
      <circle cx="36" cy="16" r="3.5" fill="#b91c1c" />
    </svg>
  )
}

type TabType = 'all' | 'india' | 'international'

export function ChristmasHomeBanner() {
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Get all holiday trips starting in December
  const holidayTrips = useMemo(() => getChristmasNewYearTrips(trips), [])
  const allCategories = useMemo(() => getAllCategories(), [])

  // Filter and enrich destinations that have holiday trips
  const destinations = useMemo(() => {
    return allCategories
      .map((cat) => {
        const catTrips = holidayTrips.filter(
          (t) =>
            t.category.trim().toLowerCase() === cat.name.toLowerCase() ||
            t.category.trim().toLowerCase().replace(/\s+/g, '-') === cat.id
        )

        const isInternational = catTrips.some((t) => t.tripType === 'International')
        const price = catTrips.length > 0 ? getLowestPriceForTrips(catTrips) : 0

        return {
          id: cat.id,
          name: cat.name,
          image: cat.image,
          tripCount: catTrips.length,
          price: price > 0 ? price : 15000,
          type: isInternational ? 'International' : 'India',
        }
      })
      .filter((d) => d.tripCount > 0)
      .sort((a, b) => b.tripCount - a.tripCount)
  }, [allCategories, holidayTrips])

  // Filter based on active tab
  const filteredDestinations = useMemo(() => {
    if (activeTab === 'india') {
      return destinations.filter((d) => d.type === 'India')
    }
    if (activeTab === 'international') {
      return destinations.filter((d) => d.type === 'International')
    }
    return destinations
  }, [destinations, activeTab])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section className="relative w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 my-5 sm:my-8">
      {/* Light Warm Festive Container - Seamlessly matches homepage theme */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-rose-50/60 border-2 border-orange-200/90 shadow-xl shadow-orange-950/5 p-5 sm:p-7 md:p-8">

        {/* Soft Ambient Warm Glow Accents */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-orange-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-60 h-60 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />

        {/* Ambient Subtle Festive Sparkles in Background */}
        <div className="absolute top-4 right-12 text-amber-400/80 animate-pulse hidden sm:block">
          <Sparkles size={24} />
        </div>
        <div className="absolute bottom-6 left-10 text-orange-400/60 animate-pulse hidden md:block" style={{ animationDelay: '1.2s' }}>
          <Sparkles size={20} />
        </div>

        {/* Top Header Section */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-orange-200/80 pb-5">
          <div>
            {/* Wanderphilia Branded Pill */}
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-100/90 border border-orange-200/90 px-3.5 py-1 text-xs font-bold text-orange-700 backdrop-blur-md mb-2 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-ping" />
              <Sparkles size={13} className="text-amber-600" />
              <span className="tracking-wide uppercase text-[11px] sm:text-xs">Wanderphilia Festive Expeditions</span>
            </div>

            {/* Main Headline with Santa Cap & Bells */}
            <div className="relative mt-1">
              {/* Santa Cap perched right on 'C' */}
              <div className="absolute -top-6 -left-4 sm:-top-7 sm:-left-5 md:-top-8 md:-left-6 w-12 h-10 sm:w-14 sm:h-12 md:w-16 md:h-14 z-20 pointer-events-none drop-shadow-md -rotate-12">
                <SantaHat className="w-full h-full" />
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span>Celebrate</span>
                <span className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Christmas
                </span>
                <span className="text-amber-500 font-extrabold">&amp;</span>
                <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent inline-flex items-center gap-1.5">
                  New Year
                  <span className="inline-block w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 -mt-1 drop-shadow-sm">
                    <ChristmasBells className="w-full h-full" />
                  </span>
                </span>
                {/* Red Festive Badge */}
                <span className="inline-block bg-[#e11d48] text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md transform -rotate-2 ml-1">
                  Holiday Sale
                </span>
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-2 max-w-2xl">
              Snowy mountain bonfires, tropical beach countdowns &amp; festive group vibes across India and the globe.
            </p>
          </div>

          {/* Interactive Filter Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white/95 p-1 rounded-full border border-orange-200/90 self-start md:self-auto shrink-0 shadow-sm backdrop-blur-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === 'all'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50/60'
                }`}
            >
              All Destinations
            </button>
            <button
              onClick={() => setActiveTab('india')}
              className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${activeTab === 'india'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50/60'
                }`}
            >
              <Compass size={12} className={activeTab === 'india' ? 'text-white' : 'text-orange-500'} />
              <span>India</span>
            </button>
            <button
              onClick={() => setActiveTab('international')}
              className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${activeTab === 'international'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50/60'
                }`}
            >
              <Globe size={12} className={activeTab === 'international' ? 'text-white' : 'text-amber-500'} />
              <span>International</span>
            </button>
          </div>
        </div>

        {/* Horizontal Destinations Carousel */}
        <div className="relative z-10 my-2">
          {/* Desktop Left / Right Navigation Buttons */}
          <button
            onClick={() => scroll('left')}
            aria-label="Previous Destinations"
            className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white hover:bg-orange-500 text-slate-700 hover:text-white border border-slate-200 hover:border-orange-400 shadow-md items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300"
          >
            <ChevronLeft size={20} className="stroke-[2.5]" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Next Destinations"
            className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white hover:bg-orange-500 text-slate-700 hover:text-white border border-slate-200 hover:border-orange-400 shadow-md items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300"
          >
            <ChevronRight size={20} className="stroke-[2.5]" />
          </button>

          {/* Destinations Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-3.5 sm:gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredDestinations.map((dest) => (
              <Link
                key={dest.id}
                href={`/christmas-new-year/${dest.id}`}
                className="group shrink-0 snap-start w-36 sm:w-40 md:w-44 focus:outline-hidden"
              >
                {/* Modern Portrait Card */}
                <div className="relative h-48 sm:h-52 md:h-56 rounded-2xl overflow-hidden border border-slate-200/90 group-hover:border-orange-400 bg-slate-900 shadow-md group-hover:shadow-xl group-hover:shadow-orange-950/15 transition-all duration-500 group-hover:-translate-y-1.5 flex flex-col justify-between p-3.5">
                  {/* Background Image */}
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-85 group-hover:opacity-100"
                    sizes="(max-width: 640px) 144px, (max-width: 768px) 160px, 176px"
                  />

                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />

                  {/* Top Badge: Tours count */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="bg-white/95 backdrop-blur-md text-orange-600 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-orange-100 shadow-xs">
                      {dest.tripCount} {dest.tripCount === 1 ? 'Tour' : 'Tours'}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Bottom Content */}
                  <div className="relative z-10 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-orange-400 tracking-wider mb-0.5">
                      <MapPin size={11} />
                      <span>{dest.type}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                      <span>{dest.name}</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0 text-orange-400 text-xs font-bold">
                        →
                      </span>
                    </h3>

                    <p className="text-[11px] text-slate-200 font-medium mt-0.5">
                      From <span className="font-extrabold text-white text-xs">₹{dest.price.toLocaleString('en-IN')}</span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Action / Offer Bar */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-orange-200/80">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium text-center sm:text-left">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-100 text-orange-600 text-xs font-black">
              ★
            </span>
            <span>December Departures Live with Early Bird Group Offers</span>
          </div>

          <Link
            href="/christmas-new-year"
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm uppercase tracking-wider px-6 py-2.5 rounded-full shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
          >
            <Gift size={15} className="text-amber-200 group-hover:rotate-12 transition-transform" />
            <span>Explore All Holiday Trips</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform stroke-[2.5]" />
          </Link>
        </div>
      </div>
    </section>
  )
}
