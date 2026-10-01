'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, MapPin, X, Star, ArrowRight, Sparkles, Compass } from 'lucide-react'
import { trips, Trip, getLowestPriceForTrip } from '@/lib/data'
import { getAllCategories } from '@/lib/trip-categories'
import { gtag } from '@/lib/gtag'

interface HeroSearchDialogProps {
  isOpen: boolean
  onClose: () => void
  initialQuery?: string
}

export function HeroSearchDialog({ isOpen, onClose, initialQuery = '' }: HeroSearchDialogProps) {
  const [query, setQuery] = useState(initialQuery)
  const [mounted, setMounted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const categories = useMemo(() => getAllCategories(), [])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Sync initial query and auto focus when opened
  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery)
      document.body.style.overflow = 'hidden'
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 80)
      return () => {
        clearTimeout(timer)
        document.body.style.overflow = ''
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [isOpen, initialQuery])

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  // Filter and rank trips matching query strictly based on Title and destination relevance
  const matchingTrips = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) {
      // Diverse popular itineraries when search is empty
      const diverseCategories = ['vietnam', 'spiti', 'leh-ladakh', 'bali', 'rajasthan', 'meghalaya', 'kashmir', 'kerala']
      const popular = diverseCategories
        .map(cat => trips.find(t => t.category === cat))
        .filter((t): t is Trip => Boolean(t))
      return popular.length > 0 ? popular.slice(0, 6) : trips.slice(0, 6)
    }

    const words = q.split(/\s+/).filter(Boolean)

    const scored = trips.map((trip) => {
      const titleLower = trip.title.toLowerCase()
      const destLower = (trip.destination || '').toLowerCase()
      const catLower = (trip.category || '').toLowerCase()
      const slugLower = (trip.slug || '').toLowerCase()

      let score = 0

      // Exact and substring match on Title
      if (titleLower === q) {
        score += 300
      } else if (titleLower.startsWith(q)) {
        score += 200
      } else if (titleLower.includes(q)) {
        score += 150
      }

      // Word-by-word match in Title
      const titleWordsMatched = words.filter(w => titleLower.includes(w)).length
      score += titleWordsMatched * 40

      if (titleWordsMatched === words.length && words.length > 0) {
        score += 60
      }

      // Secondary match on Destination/Category/Slug
      if (destLower.includes(q) || catLower.includes(q) || slugLower.includes(q)) {
        score += 30
      }
      const destWordsMatched = words.filter(w => destLower.includes(w) || catLower.includes(w)).length
      score += destWordsMatched * 15

      return { trip, score }
    })

    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.trip)
      .slice(0, 10)
  }, [query])

  // Find matching destination page tabs based on search query and matching trips
  const relatedPages = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return []

    const results: { id: string; name: string; tripCount: number }[] = []
    const addedIds = new Set<string>()

    // 1. Check direct match on category name or id
    categories.forEach((cat) => {
      const catNameLower = cat.name.toLowerCase()
      const catIdLower = cat.id.toLowerCase()
      if (
        catNameLower.includes(q) ||
        catIdLower.includes(q) ||
        q.includes(catNameLower) ||
        q.includes(catIdLower)
      ) {
        const count = trips.filter(
          (t) => t.category === cat.id || (t.destination || '').toLowerCase().includes(catNameLower)
        ).length
        if (!addedIds.has(cat.id)) {
          addedIds.add(cat.id)
          results.push({ id: cat.id, name: cat.name, tripCount: count })
        }
      }
    })

    // 2. Also check categories from top matching trips
    matchingTrips.forEach((trip) => {
      const tripCat = categories.find((c) => c.id === trip.category)
      if (tripCat && !addedIds.has(tripCat.id)) {
        const count = trips.filter(
          (t) => t.category === tripCat.id || (t.destination || '').toLowerCase().includes(tripCat.name.toLowerCase())
        ).length
        addedIds.add(tripCat.id)
        results.push({ id: tripCat.id, name: tripCat.name, tripCount: count })
      }
    })

    return results.slice(0, 3)
  }, [query, categories, matchingTrips])

  const handleTripClick = (trip: Trip) => {
    onClose()
    gtag.event({
      action: 'click',
      category: 'Search Result',
      label: `Trip: ${trip.title}`,
    })
    router.push(`/trips/${trip.slug}`)
  }

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    onClose()
    gtag.event({
      action: 'click',
      category: 'Search Result',
      label: `Related Page: ${categoryName}`,
    })

    const directPages = [
      'vietnam',
      'spiti',
      'leh-ladakh',
      'rajasthan',
      'bali',
      'thailand',
      'kashmir',
      'bhutan',
      'himachal',
      'sikkim',
      'singapore',
    ]
    const normalized = categoryId.toLowerCase().trim()
    if (directPages.includes(normalized)) {
      router.push(`/trips/${normalized}`)
    } else {
      router.push(`/trips?destination=${encodeURIComponent(categoryName)}`)
    }
  }

  if (!isOpen || !mounted) return null

  const modalContent = (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999999] bg-black/80 backdrop-blur-md flex items-start justify-center pt-3 sm:pt-12 md:pt-16 pb-4 sm:pb-8 px-2.5 sm:px-4 animate-in fade-in duration-200"
      style={{ isolation: 'isolate' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh] sm:max-h-[85vh] z-[9999999]"
      >
        {/* TOP SEARCH BAR */}
        <div className="p-3 sm:p-4 border-b border-gray-100 flex items-center gap-2.5 sm:gap-3 bg-white sticky top-0 z-20 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0 text-[#ff5d09]">
            <Search size={18} strokeWidth={2.5} />
          </div>

          <div className="flex-1 relative min-w-0">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destination or itinerary..."
              className="w-full text-sm sm:text-base md:text-lg font-semibold text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
            />
          </div>

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer shrink-0"
              title="Clear search"
            >
              <X size={18} />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold px-2.5 sm:px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer shrink-0"
            title="Close modal"
          >
            <X size={14} className="sm:hidden" />
            <span className="hidden sm:inline">Esc</span>
          </button>
        </div>

        {/* RESULTS AREA */}
        <div className="p-2.5 sm:p-4 overflow-y-auto flex-1 min-h-0 space-y-2.5">
          {/* RELATED DESTINATION PAGE TABS */}
          {relatedPages.length > 0 && (
            <div className="mb-2 pb-2.5 border-b border-gray-100">
              <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-1.5 px-1">
                <Compass size={12} className="text-[#ff5d09]" /> Related Page
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {relatedPages.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryClick(cat.id, cat.name)}
                    className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-[#ff5d09] border border-orange-200/80 hover:border-[#ff5d09] transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md"
                  >
                    <div className="w-5 h-5 rounded-md bg-white group-hover:bg-white/20 flex items-center justify-center text-[#ff5d09] group-hover:text-white shrink-0 transition-colors shadow-2xs">
                      <MapPin size={12} />
                    </div>
                    <span className="text-xs font-bold text-gray-900 group-hover:text-white transition-colors">
                      {cat.name} Page
                    </span>
                    {cat.tripCount > 0 && (
                      <span className="text-[10px] font-semibold text-[#ff5d09] group-hover:text-orange-100 bg-white/90 group-hover:bg-white/20 px-1.5 py-0.5 rounded-full transition-colors">
                        {cat.tripCount} Trips
                      </span>
                    )}
                    <ArrowRight
                      size={12}
                      className="text-[#ff5d09] group-hover:text-white group-hover:translate-x-0.5 transition-all ml-0.5"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* HEADER */}
          <div className="pb-1 px-1">
            <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              {query.trim() ? (
                <>Suggested Itineraries ({matchingTrips.length})</>
              ) : (
                <>
                  <Sparkles size={12} className="text-[#ff5d09]" /> Popular Itineraries
                </>
              )}
            </span>
          </div>

          {/* ITINERARY CARDS LIST */}
          {matchingTrips.length > 0 ? (
            <div className="space-y-2 sm:space-y-2.5">
              {matchingTrips.map((trip) => {
                const displayPrice = getLowestPriceForTrip(trip)
                const routeStr = trip.route || trip.staySummary || trip.destination

                return (
                  <div
                    key={trip.id}
                    onClick={() => handleTripClick(trip)}
                    className="group flex items-center gap-2.5 sm:gap-3 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white hover:bg-orange-50/50 border border-gray-100 hover:border-orange-200 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md"
                  >
                    {/* Left: Thumbnail */}
                    <div className="relative w-16 h-16 sm:w-24 sm:h-22 rounded-lg sm:rounded-xl overflow-hidden shrink-0 bg-gray-100">
                      <Image
                        src={trip.image}
                        alt={trip.title}
                        fill
                        sizes="(max-width: 640px) 64px, 96px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-xs text-white text-[8px] sm:text-[10px] font-bold px-1 py-0.5 rounded flex items-center gap-0.5">
                        <Star size={9} className="fill-yellow-400 text-yellow-400" />
                        <span>{trip.rating?.toFixed(1) || '4.9'}</span>
                      </div>
                    </div>

                    {/* Middle: Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap mb-0.5 sm:mb-1">
                        <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100/80 text-[#ff5d09]">
                          {trip.duration - 1}N/{trip.duration}D
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                          {trip.title.toLowerCase().includes('group') ? 'Group Tour' : 'Customised'}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-gray-400 truncate hidden xs:inline">
                          {trip.destination}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-[#ff5d09] transition-colors line-clamp-1">
                        {trip.title}
                      </h4>

                      <p className="text-[10px] sm:text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                        {routeStr}
                      </p>
                    </div>

                    {/* Right: Price & Action */}
                    <div className="flex flex-col items-end justify-center shrink-0 pl-1.5 sm:pl-3 border-l border-gray-100 min-w-[75px] sm:min-w-[105px]">
                      {displayPrice && displayPrice > 0 ? (
                        <>
                          <span className="text-[8px] sm:text-[9px] text-gray-400 font-medium">From</span>
                          <span className="text-xs sm:text-sm font-extrabold text-gray-900 group-hover:text-[#ff5d09] transition-colors">
                            ₹{displayPrice.toLocaleString('en-IN')}
                          </span>
                        </>
                      ) : (
                        <span className="text-[11px] sm:text-xs font-bold text-gray-800">
                          On Request
                        </span>
                      )}
                      <div className="mt-0.5 sm:mt-1 flex items-center gap-0.5 text-[10px] sm:text-[11px] font-semibold text-[#ff5d09] group-hover:translate-x-0.5 transition-transform">
                        <span>View</span>
                        <ArrowRight size={11} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-8 sm:py-10 text-center bg-gray-50/60 rounded-2xl border border-dashed border-gray-200">
              <MapPin size={24} className="mx-auto text-gray-400 mb-2" />
              <p className="text-xs sm:text-sm font-bold text-gray-800">No itineraries found for &ldquo;{query}&rdquo;</p>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-1 max-w-sm mx-auto px-4">
                Try searching by trip title keywords like Vietnam, Spiti, Ladakh, Bike, Bali, or Rajasthan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null
}
