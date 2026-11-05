'use client'

import { useState, useEffect, useMemo } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { TripCard } from '@/components/trip-card'
import { ReviewCard } from '@/components/review-card'
import { GalleryCarousel } from '@/components/gallery-carousel'
import { Button } from '@/components/ui/button'
import { TripHeroCarousel } from '@/components/trip-hero-carousel'
import { RequestCallbackDialog } from '@/components/request-callback-dialog'
import { DurationFilter } from '@/components/duration-filter'
import { NoPackagesCallbackForm } from '@/components/no-packages-callback-form'
import { useDestinationTrips } from '@/lib/use-dynamic-trips'
import { DestinationPageItem } from '@/lib/destinations'
import { ChevronLeft, ChevronRight, Star, Phone, MessageCircle, ChevronDown } from 'lucide-react'

interface ReviewItem {
  _id: string
  name: string
  platform: 'Google' | 'Facebook' | 'Justdial'
  rating: number
  comment: string
  createdAt: string
}

interface DestinationPageTemplateProps {
  destination: DestinationPageItem
}

export function DestinationPageTemplate({ destination }: DestinationPageTemplateProps) {
  const categoryId = destination.slug
  const categoryName = destination.name || `${destination.destination} Tour Packages 2026`

  const [carouselIndex1, setCarouselIndex1] = useState(0)
  const [carouselIndex2, setCarouselIndex2] = useState(0)
  const [familyCarouselIndex, setFamilyCarouselIndex] = useState(0)
  const [customizedCarouselIndex, setCustomizedCarouselIndex] = useState(0)
  const [cardsPerView, setCardsPerView] = useState(3)
  const [callbackOpen, setCallbackOpen] = useState(false)
  const [isDescExpanded, setIsDescExpanded] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  // Reviews state
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(true)

  // Central mapping system for trip sections with live MongoDB sync
  const { getTripsBySection, dynamicTrips } = useDestinationTrips(categoryId)

  // Get packages for sections
  const categoryTrips = useMemo(() => {
    return getTripsBySection('available')
  }, [getTripsBySection, dynamicTrips])

  const familyPackages = useMemo(() => {
    return getTripsBySection('family')
  }, [getTripsBySection, dynamicTrips])

  const customizedPackages = useMemo(() => {
    return getTripsBySection('custom')
  }, [getTripsBySection, dynamicTrips])

  const relatedPackages = useMemo(() => {
    return getTripsBySection('related')
  }, [getTripsBySection, dynamicTrips])

  const firstTrip = categoryTrips[0]

  // Calculate lowest starting price
  const lowestPrice = useMemo(() => {
    if (destination.startingPrice && destination.startingPrice > 0) {
      return destination.startingPrice
    }
    if (!firstTrip?.costingDetails || firstTrip.costingDetails.length === 0) {
      return firstTrip?.price || 19999
    }
    const prices = firstTrip.costingDetails
      .map(item => {
        const match = item.value.match(/[\d,]+/)
        return match ? parseInt(match[0].replace(/,/g, ''), 10) : 0
      })
      .filter(price => price > 0)
    return prices.length > 0 ? Math.min(...prices) : firstTrip?.price || 19999
  }, [firstTrip, destination.startingPrice])

  // Setup carousel cards per view
  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth < 768
      setCardsPerView(mobile ? 2 : 3)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Reset indices on resize
  useEffect(() => {
    setCarouselIndex1(0)
    setCarouselIndex2(0)
    setFamilyCarouselIndex(0)
    setCustomizedCarouselIndex(0)
  }, [cardsPerView])

  // Fetch reviews if enabled
  useEffect(() => {
    if (!destination.sections?.reviews) return
    async function fetchReviews() {
      try {
        const response = await fetch('/api/reviews')
        if (response.ok) {
          const data = await response.json()
          setReviews(data)
        }
      } catch {
      } finally {
        setReviewsLoading(false)
      }
    }
    fetchReviews()
  }, [destination.sections?.reviews])

  const [selectedDuration, setSelectedDuration] = useState<number | null>(null)

  const allCategoryTrips = useMemo(() => {
    const combined = [...categoryTrips, ...familyPackages, ...customizedPackages]
    const seen = new Set<string>()
    return combined.filter(trip => {
      const id = trip.id || trip.slug
      if (seen.has(id)) return false
      seen.add(id)
      return true
    })
  }, [categoryTrips, familyPackages, customizedPackages])

  const filteredCategoryTrips = useMemo(() => {
    if (!selectedDuration) return categoryTrips
    return categoryTrips.filter(t => {
      const tripNights = t.nights !== undefined ? t.nights : (t.duration ? t.duration - 1 : 0)
      return tripNights === selectedDuration
    })
  }, [categoryTrips, selectedDuration])

  const filteredFamilyPackages = useMemo(() => {
    if (!selectedDuration) return familyPackages
    return familyPackages.filter(t => {
      const tripNights = t.nights !== undefined ? t.nights : (t.duration ? t.duration - 1 : 0)
      return tripNights === selectedDuration
    })
  }, [familyPackages, selectedDuration])

  const filteredCustomizedPackages = useMemo(() => {
    if (!selectedDuration) return customizedPackages
    return customizedPackages.filter(t => {
      const tripNights = t.nights !== undefined ? t.nights : (t.duration ? t.duration - 1 : 0)
      return tripNights === selectedDuration
    })
  }, [customizedPackages, selectedDuration])

  // Review statistics
  const reviewStats = useMemo(() => {
    if (reviews.length === 0) {
      return { avgRating: 4.9, totalReviews: 479, displayReviews: [] }
    }
    const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    const totalReviews = reviews.length
    const displayReviews = reviews.slice(0, 6)
    return { avgRating, totalReviews, displayReviews }
  }, [reviews])

  // Build hero media items
  const heroMedia = useMemo(() => {
    if (destination.heroImages && destination.heroImages.length > 0) {
      return destination.heroImages.map((src, i) => ({
        type: 'image' as const,
        src,
        alt: `${destination.name} photo ${i + 1}`,
      }))
    }
    if (firstTrip?.heroMedia && firstTrip.heroMedia.length > 0) {
      return firstTrip.heroMedia
    }
    return [
      {
        type: 'image' as const,
        src: firstTrip?.image || '/images/meghalaya.jpg',
        alt: destination.name,
      },
    ]
  }, [destination.heroImages, destination.name, firstTrip])

  // Default section titles
  const titles = destination.sectionTitles || {}
  const sec = destination.sections || {
    available: true,
    family: true,
    custom: true,
    related: true,
    durationFilter: true,
    reviews: true,
    gallery: true,
    faqs: true,
  }

  // Gallery images fallback
  const galleryImagesList = useMemo(() => {
    if (destination.galleryImages && destination.galleryImages.length > 0) {
      return destination.galleryImages.map((g, idx) => ({
        _id: `dest-gal-${idx}`,
        image: g.image,
        category: destination.slug,
        alt: g.alt || `${destination.destination} Gallery`,
        createdAt: '',
      }))
    }
    // Fallback to hero images
    return destination.heroImages.map((img, idx) => ({
      _id: `dest-img-${idx}`,
      image: img,
      category: destination.slug,
      alt: `${destination.destination} Visual`,
      createdAt: '',
    }))
  }, [destination.galleryImages, destination.heroImages, destination.slug, destination.destination])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <div className="relative h-[50vh] sm:h-[45vh] md:h-[70vh] overflow-hidden pt-20">
          <TripHeroCarousel media={heroMedia} />

          <div className="absolute inset-0 bg-linear-to-r from-slate-950/90 via-slate-950/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-5 md:px-6 pb-6 sm:pb-8 lg:pb-10">
              <div className="text-white">
                <div className="max-w-5xl">
                  {lowestPrice > 0 && (
                    <div className="mb-4 inline-flex items-center rounded-full bg-amber-400/15 px-3 py-1 text-sm font-semibold text-amber-200 ring-1 ring-amber-300/20">
                      Starting Price
                      <span className="ml-2 text-white">₹{lowestPrice.toLocaleString('en-IN')} / person</span>
                    </div>
                  )}

                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                    {categoryName}
                  </h1>

                  {destination.tagline && (
                    <p className="mt-1 text-xs sm:text-sm font-medium text-amber-300">
                      {destination.tagline}
                    </p>
                  )}

                  {destination.description && (
                    <p className={`mt-3 text-sm sm:text-base md:text-lg text-slate-100 ${!isDescExpanded ? 'line-clamp-3 md:line-clamp-none' : ''}`}>
                      {destination.description}
                    </p>
                  )}

                  {destination.description && destination.description.length > 150 && (
                    <button
                      onClick={() => setIsDescExpanded(!isDescExpanded)}
                      className="mt-1 text-xs md:hidden font-semibold text-amber-300 hover:text-amber-400 transition-colors uppercase tracking-wider focus:outline-none"
                    >
                      {isDescExpanded ? 'View Less ▲' : 'View More ▼'}
                    </button>
                  )}

                  <div className="mt-5 flex flex-row gap-2 sm:flex-row sm:items-center">
                    <Button
                      size="lg"
                      className="min-w-30 bg-amber-400 text-white hover:bg-amber-300 shadow-md"
                      onClick={() => setCallbackOpen(true)}
                    >
                      <Phone size={18} className="mr-0" /> Request a Callback
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="min-w-32 border-white/60 text-slate-800 hover:text-white hover:border-white hover:bg-white/10 bg-white shadow-md"
                      onClick={() => {
                        const message = `Hi Wanderphilia, I want to inquire about ${destination.destination} Tour Packages from Website`
                        const encodedMessage = encodeURIComponent(message)
                        window.open(`https://wa.me/919217664099?text=${encodedMessage}`, '_blank')
                      }}
                    >
                      <MessageCircle size={18} className="mr-0" /> Chat With Us
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DURATION FILTER SECTION */}
        {sec.durationFilter && allCategoryTrips.length > 0 && (
          <DurationFilter
            trips={allCategoryTrips}
            selectedDuration={selectedDuration}
            onChange={setSelectedDuration}
          />
        )}

        {/* SECTION 1: AVAILABLE PACKAGES */}
        {sec.available && (
          <section className="py-2 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                <div>
                  <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                    {titles.availableSubtitle || 'Curated Experiences'}
                  </span>
                  <h2 className="text-xl md:text-3xl font-bold text-gray-900 mt-1">
                    {titles.availableTitle || 'Available Tour Packages'}
                  </h2>
                </div>
                <p className="text-gray-500 text-sm mt-2 md:mt-0">
                  Showing {filteredCategoryTrips.length} Handcrafted Packages
                </p>
              </div>

              {filteredCategoryTrips.length === 0 ? (
                <NoPackagesCallbackForm
                  nights={selectedDuration}
                  destinationName={categoryName}
                />
              ) : (
                <>
                  {/* Mobile View */}
                  <div className="flex md:hidden overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-none snap-x snap-mandatory">
                    {filteredCategoryTrips.map((trip) => (
                      <div key={trip.id} className="w-[90%] shrink-0">
                        <TripCard {...trip} />
                      </div>
                    ))}
                  </div>

                  {/* Desktop View */}
                  <div className="hidden md:block relative">
                    <div className="overflow-hidden">
                      <div
                        className="flex transition-transform duration-500 ease-out"
                        style={{
                          transform: `translateX(-${carouselIndex1 * (100 / cardsPerView)}%)`,
                        }}
                      >
                        {filteredCategoryTrips.map((trip) => (
                          <div key={trip.id} className="shrink-0 basis-1/3 p-2">
                            <TripCard {...trip} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {filteredCategoryTrips.length > cardsPerView && (
                      <>
                        <button
                          onClick={() => setCarouselIndex1((prev) => Math.max(0, prev - 1))}
                          disabled={carouselIndex1 === 0}
                          aria-label="Previous trip"
                          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all disabled:opacity-0 disabled:pointer-events-none"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={() =>
                            setCarouselIndex1((prev) =>
                              Math.min(filteredCategoryTrips.length - cardsPerView, prev + 1)
                            )
                          }
                          disabled={carouselIndex1 >= filteredCategoryTrips.length - cardsPerView}
                          aria-label="Next trip"
                          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all disabled:opacity-0 disabled:pointer-events-none"
                        >
                          <ChevronRight size={24} />
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {/* SECTION 2: FAMILY SPECIAL PACKAGES */}
        {sec.family && filteredFamilyPackages.length > 0 && (
          <section className="py-2 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                <div>
                  <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                    {titles.familySubtitle || 'Memorable Journeys'}
                  </span>
                  <h2 className="text-xl md:text-3xl font-bold text-gray-900 mt-1">
                    {titles.familyTitle || 'Family Special Packages'}
                  </h2>
                </div>
                <p className="text-gray-500 text-sm mt-2 md:mt-0">
                  Showing {filteredFamilyPackages.length} Handcrafted Packages
                </p>
              </div>

              {/* Mobile View */}
              <div className="flex md:hidden overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-none snap-x snap-mandatory">
                {filteredFamilyPackages.map((trip) => (
                  <div key={trip.id} className="w-[90%] shrink-0">
                    <TripCard {...trip} />
                  </div>
                ))}
              </div>

              {/* Desktop View */}
              <div className="hidden md:block relative">
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{
                      transform: `translateX(-${familyCarouselIndex * (100 / cardsPerView)}%)`,
                    }}
                  >
                    {filteredFamilyPackages.map((trip) => (
                      <div key={trip.id} className="shrink-0 basis-1/3 p-2">
                        <TripCard {...trip} />
                      </div>
                    ))}
                  </div>
                </div>

                {filteredFamilyPackages.length > cardsPerView && (
                  <>
                    <button
                      onClick={() => setFamilyCarouselIndex((prev) => Math.max(0, prev - 1))}
                      disabled={familyCarouselIndex === 0}
                      aria-label="Previous trip"
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all disabled:opacity-0 disabled:pointer-events-none"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={() =>
                        setFamilyCarouselIndex((prev) =>
                          Math.min(filteredFamilyPackages.length - cardsPerView, prev + 1)
                        )
                      }
                      disabled={familyCarouselIndex >= filteredFamilyPackages.length - cardsPerView}
                      aria-label="Next trip"
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all disabled:opacity-0 disabled:pointer-events-none"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 3: CUSTOMIZED PACKAGES */}
        {sec.custom && filteredCustomizedPackages.length > 0 && (
          <section className="py-2 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                <div>
                  <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                    {titles.customSubtitle || 'Tailored For You'}
                  </span>
                  <h2 className="text-xl md:text-3xl font-bold text-gray-900 mt-1">
                    {titles.customTitle || 'Customized Tour Packages'}
                  </h2>
                </div>
                <p className="text-gray-500 text-sm mt-2 md:mt-0">
                  Showing {filteredCustomizedPackages.length} Handcrafted Packages
                </p>
              </div>

              {/* Mobile View */}
              <div className="flex md:hidden overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-none snap-x snap-mandatory">
                {filteredCustomizedPackages.map((trip) => (
                  <div key={trip.id} className="w-[90%] shrink-0">
                    <TripCard {...trip} />
                  </div>
                ))}
              </div>

              {/* Desktop View */}
              <div className="hidden md:block relative">
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{
                      transform: `translateX(-${customizedCarouselIndex * (100 / cardsPerView)}%)`,
                    }}
                  >
                    {filteredCustomizedPackages.map((trip) => (
                      <div key={trip.id} className="shrink-0 basis-1/3 p-2">
                        <TripCard {...trip} />
                      </div>
                    ))}
                  </div>
                </div>

                {filteredCustomizedPackages.length > cardsPerView && (
                  <>
                    <button
                      onClick={() => setCustomizedCarouselIndex((prev) => Math.max(0, prev - 1))}
                      disabled={customizedCarouselIndex === 0}
                      aria-label="Previous trip"
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all disabled:opacity-0 disabled:pointer-events-none"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={() =>
                        setCustomizedCarouselIndex((prev) =>
                          Math.min(filteredCustomizedPackages.length - cardsPerView, prev + 1)
                        )
                      }
                      disabled={customizedCarouselIndex >= filteredCustomizedPackages.length - cardsPerView}
                      aria-label="Next trip"
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all disabled:opacity-0 disabled:pointer-events-none"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 4: RELATED PACKAGES */}
        {sec.related && relatedPackages.length > 0 && (
          <section className="py-2 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                <div>
                  <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                    {titles.relatedSubtitle || 'Explore More'}
                  </span>
                  <h2 className="text-xl md:text-3xl font-bold text-gray-900 mt-1">
                    {titles.relatedTitle || 'Trending Tour Packages'}
                  </h2>
                </div>
                <p className="text-gray-500 text-sm mt-2 md:mt-0">
                  Showing {relatedPackages.length} Handcrafted Packages
                </p>
              </div>

              {/* Mobile View */}
              <div className="flex md:hidden overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-none snap-x snap-mandatory">
                {relatedPackages.map((trip) => (
                  <div key={trip.id} className="w-[90%] shrink-0">
                    <TripCard {...trip} />
                  </div>
                ))}
              </div>

              {/* Desktop View */}
              <div className="hidden md:block relative">
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{
                      transform: `translateX(-${carouselIndex2 * (100 / cardsPerView)}%)`,
                    }}
                  >
                    {relatedPackages.map((trip) => (
                      <div key={trip.id} className="shrink-0 basis-1/3 p-2">
                        <TripCard {...trip} />
                      </div>
                    ))}
                  </div>
                </div>

                {relatedPackages.length > cardsPerView && (
                  <>
                    <button
                      onClick={() => setCarouselIndex2((prev) => Math.max(0, prev - 1))}
                      disabled={carouselIndex2 === 0}
                      aria-label="Previous trip"
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all disabled:opacity-0 disabled:pointer-events-none"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={() =>
                        setCarouselIndex2((prev) =>
                          Math.min(relatedPackages.length - cardsPerView, prev + 1)
                        )
                      }
                      disabled={carouselIndex2 >= relatedPackages.length - cardsPerView}
                      aria-label="Next trip"
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all disabled:opacity-0 disabled:pointer-events-none"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 5: CUSTOMER REVIEWS */}
        {sec.reviews && (
          <section className="py-16 md:py-24 bg-gray-50 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
                  ★ {reviewStats.avgRating} out of 5 Stars
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                  Loved by Travelers Worldwide
                </h2>
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                  Read authentic reviews from travelers who experienced unforgettable journeys with us.
                </p>
              </div>

              {reviewsLoading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading reviews...</p>
                </div>
              ) : reviewStats.displayReviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reviewStats.displayReviews.map((review) => (
                    <ReviewCard key={review._id} {...review} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-1 text-amber-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 italic mb-4">
                      "Our trip with Wanderphilia was organized seamlessly! The stays, driver, and sightseeing exceeded our expectations."
                    </p>
                    <p className="text-xs font-bold text-gray-900">- Verified Traveler</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-1 text-amber-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 italic mb-4">
                      "Best travel team in India! Super friendly tour leads, timely responses, and authentic local experiences."
                    </p>
                    <p className="text-xs font-bold text-gray-900">- Google Reviewer</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-1 text-amber-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 italic mb-4">
                      "Great attention to detail and honest pricing without hidden costs. Highly recommend Wanderphilia to everyone!"
                    </p>
                    <p className="text-xs font-bold text-gray-900">- Facebook Reviewer</p>
                  </div>
                </div>
              )}

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
            </div>
          </section>
        )}

        {/* SECTION 6: PHOTO GALLERY */}
        {sec.gallery && galleryImagesList.length > 0 && (
          <section className="py-16 md:py-24 bg-linear-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
                  📸 Visual Stories
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                  {destination.destination} Gallery
                </h2>
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                  Explore breathtaking moments captured by our travelers. Click any image to view in full detail.
                </p>
              </div>

              <GalleryCarousel images={galleryImagesList} />
            </div>
          </section>
        )}

        {/* SECTION 7: FAQS */}
        {sec.faqs && destination.faqs && destination.faqs.length > 0 && (
          <section className="py-16 bg-white border-t border-gray-100">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wider mb-3">
                  Need Help?
                </span>
                <h2 className="text-2xl sm:text-4xl font-bold text-gray-900">
                  Frequently Asked Questions
                </h2>
                <p className="text-gray-600 text-sm mt-2">
                  Everything you need to know about planning your trip to {destination.destination}
                </p>
              </div>

              <div className="space-y-3">
                {destination.faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx
                  return (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-xl overflow-hidden transition-all bg-white shadow-xs"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between p-4 text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                      >
                        <span className="pr-4">{faq.question}</span>
                        <ChevronDown
                          size={18}
                          className={`text-gray-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {isOpen && (
                        <div className="p-4 pt-0 text-gray-600 text-sm leading-relaxed border-t border-gray-100 bg-gray-50/50">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />

      <RequestCallbackDialog
        open={callbackOpen}
        onOpenChange={setCallbackOpen}
        title={categoryName}
        price={lowestPrice || 19999}
      />
    </div>
  )
}
