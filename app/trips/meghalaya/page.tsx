'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { TripCard } from '@/components/trip-card'
import { ReviewCard } from '@/components/review-card'
import { GalleryCarousel } from '@/components/gallery-carousel'
import { Button } from '@/components/ui/button'
import { TripHeroCarousel } from '@/components/trip-hero-carousel'
import { RequestCallbackDialog } from '@/components/request-callback-dialog'
import { trips } from '@/lib/data'
import { getSectionMapping } from '@/lib/section-mappings'
import { useDestinationTrips } from '@/lib/use-dynamic-trips'
import { DurationFilter } from '@/components/duration-filter'
import { NoPackagesCallbackForm } from '@/components/no-packages-callback-form'
import { ChevronLeft, ChevronRight, Star, Phone, MessageCircle } from 'lucide-react'

interface ReviewItem {
  _id: string
  name: string
  platform: 'Google' | 'Facebook' | 'Justdial'
  rating: number
  comment: string
  createdAt: string
}

interface GalleryImage {
  _id: string
  image: string
  category: string
  alt?: string
  createdAt: string
}

export default function MeghalayaPage() {
  const categoryId = 'meghalaya'
  const categoryName = 'Meghalaya Tour Packages 2026'
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [carouselIndex1, setCarouselIndex1] = useState(0)
  const [carouselIndex2, setCarouselIndex2] = useState(0)
    const [groupCarouselIndex, setGroupCarouselIndex] = useState(0)
  const [honeymoonCarouselIndex, setHoneymoonCarouselIndex] = useState(0)
  const [familyCarouselIndex, setFamilyCarouselIndex] = useState(0)
  const [customizedCarouselIndex, setCustomizedCarouselIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [cardsPerView, setCardsPerView] = useState(4)
  const [callbackOpen, setCallbackOpen] = useState(false)
  const [isDescExpanded, setIsDescExpanded] = useState(false)

  // Reviews state
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewsError, setReviewsError] = useState<string | null>(null)

  // Gallery state
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [galleryLoading, setGalleryLoading] = useState(true)
  const [galleryError, setGalleryError] = useState<string | null>(null)

  // Central mapping system for trip sections with live MongoDB sync
  const { getTripsBySection, sectionMap, dynamicTrips } = useDestinationTrips(categoryId)

  // Get all trips for this category (available packages)
  const categoryTrips = useMemo(() => {
    return getTripsBySection('available')
  }, [getTripsBySection, dynamicTrips])

  // Get first trip for category description/type
  const firstTrip = categoryTrips[0]
  const isCategoryInternational = firstTrip?.tripType === 'International'

  const lowestPrice = useMemo(() => {
    if (!firstTrip?.costingDetails || firstTrip.costingDetails.length === 0) return firstTrip?.price || 18999
    const prices = firstTrip.costingDetails
      .map(item => {
        const match = item.value.match(/[\d,]+/)
        return match ? parseInt(match[0].replace(/,/g, ''), 10) : 0
      })
      .filter(price => price > 0)
    return prices.length > 0 ? Math.min(...prices) : firstTrip?.price || 18999
  }, [firstTrip])

  // Get related packages (other India destinations)
  const relatedPackages = useMemo(() => {
    return getTripsBySection('related')
  }, [getTripsBySection, dynamicTrips])

  // Create carousel images - use trip images from category or fallback to destination hero images
  const carouselImages = useMemo(() => {
    const defaultImages = [
      '/images/meghalaya.jpg',
      'https://images.unsplash.com/photo-1565716665452-2a4e3445b378?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1654788111018-9096236d54ac?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1521437620269-f477f5437820?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1698429358246-807d8972da9a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613644383947-26a22b8c04f2?auto=format&fit=crop&w=1200&q=80'
    ]
    const categoryImages = categoryTrips.flatMap(trip => [
      trip.image,
      ...(trip.gallery || []),
      ...(trip.images || [])
    ]).filter(Boolean)
    return categoryImages.length > 0 ? Array.from(new Set(categoryImages)) : defaultImages
  }, [categoryTrips])

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [carouselImages.length])

  // Setup carousel cards per view
  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setCardsPerView(mobile ? 2 : 3)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // reset indices when layout changes
  useEffect(() => {
    setCarouselIndex1(0)
    setCarouselIndex2(0)
    setGroupCarouselIndex(0)
    setFamilyCarouselIndex(0)
    setHoneymoonCarouselIndex(0)
    setCustomizedCarouselIndex(0)
  }, [cardsPerView])

  // Fetch reviews
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
        setReviewsError((error as Error).message)
      } finally {
        setReviewsLoading(false)
      }
    }
    fetchReviews()
  }, [])

  // Fetch gallery images
  useEffect(() => {
    async function fetchGallery() {
      try {
        const response = await fetch(`/api/gallery?category=${categoryId}`)
        if (!response.ok) {
          throw new Error('Unable to load gallery images')
        }
        const data = await response.json()
        setGalleryImages(data)
      } catch (error) {
        setGalleryError((error as Error).message)
      } finally {
        setGalleryLoading(false)
      }
    }
    fetchGallery()
  }, [categoryId])

    const groupPackages = useMemo(() => {
    return getTripsBySection('group')
  }, [getTripsBySection, dynamicTrips])

  const honeymoonPackages = useMemo(() => {
    return getTripsBySection('honeymoon')
  }, [getTripsBySection, dynamicTrips])

  // Family Packages Data
  const familyPackages = useMemo(() => {
    return getTripsBySection('family')
  }, [getTripsBySection, dynamicTrips])

  // Customized Packages Data
  const customizedPackages = useMemo(() => {
    return getTripsBySection('custom')
  }, [getTripsBySection, dynamicTrips])

  const [selectedDuration, setSelectedDuration] = useState<number | null>(null)

  const allCategoryTrips = useMemo(() => {
    const combined = [...categoryTrips, ...(typeof groupPackages !== 'undefined' ? groupPackages : []), ...familyPackages, ...(typeof honeymoonPackages !== 'undefined' ? honeymoonPackages : []), ...customizedPackages]
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

    const filteredGroupPackages = useMemo(() => {
    if (!selectedDuration) return groupPackages
    return groupPackages.filter(t => {
      const tripNights = t.nights !== undefined ? t.nights : (t.duration ? t.duration - 1 : 0)
      return tripNights === selectedDuration
    })
  }, [groupPackages, selectedDuration])

  const filteredHoneymoonPackages = useMemo(() => {
    if (!selectedDuration) return honeymoonPackages
    return honeymoonPackages.filter(t => {
      const tripNights = t.nights !== undefined ? t.nights : (t.duration ? t.duration - 1 : 0)
      return tripNights === selectedDuration
    })
  }, [honeymoonPackages, selectedDuration])

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

  // Compute review statistics
  const reviewStats = useMemo(() => {
    if (reviews.length === 0) {
      return { avgRating: 0, totalReviews: 0, displayReviews: [] }
    }
    const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    const totalReviews = reviews.length
    const displayReviews = reviews.slice(0, 6)
    return { avgRating, totalReviews, displayReviews }
  }, [reviews])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section with Carousel */}
        <div className="relative h-[50vh] sm:h-[45vh] md:h-[70vh] overflow-hidden pt-20">
          <TripHeroCarousel media={firstTrip?.heroMedia || [{ type: 'image' as const, src: firstTrip?.image || '/images/meghalaya.jpg', alt: categoryName }]} />

          <div className="absolute inset-0 bg-linear-to-r from-slate-950/90 via-slate-950/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-5 md:px-6 pb-6 sm:pb-8 lg:pb-10">
              <div className="text-white">
                <div className="max-w-5xl">
                  {firstTrip ? (
                    <div className="mb-4 inline-flex items-center rounded-full bg-amber-400/15 px-3 py-1 text-sm font-semibold text-amber-200 ring-1 ring-amber-300/20">
                      Starting Price
                      <span className="ml-2 text-white">₹{(lowestPrice || 18999).toLocaleString('en-IN')} / person</span>
                    </div>
                  ) : null}

                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                    {categoryName}
                  </h1>

                  <p className={`mt-3 text-sm sm:text-base md:text-lg text-slate-100 ${!isDescExpanded ? 'line-clamp-3 md:line-clamp-none' : ''}`}>
                    All inclusive curated Best Meghalaya Group & Customized Tour Packages 2026 covering Shillong, Cherrapunji (Sohra), Dawki crystal clear Umngot River, Mawlynnong Cleanest Village, Double Decker Living Root Bridge, Krang Shuri Falls, Nohkalikai Falls, and Laitlum Canyons.
                  </p>

                  <button
                    onClick={() => setIsDescExpanded(!isDescExpanded)}
                    className="mt-0 text-xs md:hidden font-semibold text-amber-300 hover:text-amber-400 transition-colors uppercase tracking-wider focus:outline-none"
                  >
                    {isDescExpanded ? 'View Less ▲' : 'View More ▼'}
                  </button>

                  <div className="mt-5 flex flex-row gap-2 sm:flex-row sm:items-center">
                    <Button
                      size="lg"
                      className="min-w-30 bg-amber-400 text-white hover:bg-amber-300"
                      onClick={() => setCallbackOpen(true)}
                    >
                      <Phone size={18} className="mr-0" /> Request a Callback
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="min-w-32 border-white/60 text-slate-800 hover:text-white hover:border-white hover:bg-white/10 bg-white"
                      onClick={() => {
                        const message = `Hi Wanderphilia, I want to inquire about Meghalaya Tour Packages from Website`
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

        {/* Duration Filter Component */}
        <DurationFilter
          trips={allCategoryTrips}
          selectedDuration={selectedDuration}
          onChange={setSelectedDuration}
        />

        {/* Section 1: Available Packages */}
        <section className="py-2 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
              <div>
                <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                  Curated Experiences
                </span>
                <h2 className="text-xl md:text-3xl font-bold text-gray-900 mt-1">
                  Available Tour Packages
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
                {/* Mobile View: Horizontal Snap Scroll Carousel */}
                <div className="flex md:hidden overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-none snap-x snap-mandatory">
                  {filteredCategoryTrips.map((trip) => (
                    <div
                      key={trip.id}
                      className="w-[90%] shrink-0"
                    >
                      <TripCard {...trip} />
                    </div>
                  ))}
                </div>

                {/* Desktop View: 3-Column Sliding Carousel */}
                <div className="hidden md:block relative">
                  <div className="overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-out"
                      style={{
                        transform: `translateX(-${carouselIndex1 * (100 / cardsPerView)}%)`,
                      }}
                    >
                      {filteredCategoryTrips.map((trip) => (
                        <div
                          key={trip.id}
                          className="shrink-0 basis-1/3 p-2"
                        >
                          <TripCard {...trip} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {filteredCategoryTrips.length > cardsPerView && (
                    <>
                      <button
                        onClick={() =>
                          setCarouselIndex1((prev) => Math.max(0, prev - 1))
                        }
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
                        disabled={
                          carouselIndex1 >= filteredCategoryTrips.length - cardsPerView
                        }
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

        {/* Section 2: Family Packages */}
        {filteredFamilyPackages.length > 0 && (
          <section className="py-2 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                <div>
                  <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                    Memorable Journeys
                  </span>
                  <h2 className="text-xl md:text-3xl font-bold text-gray-900 mt-1">
                    Family Special Packages
                  </h2>
                </div>
                <p className="text-gray-500 text-sm mt-2 md:mt-0">
                  Showing {filteredFamilyPackages.length} Handcrafted Packages
                </p>
              </div>

              {/* Mobile View: Horizontal Snap Scroll Carousel */}
              <div className="flex md:hidden overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-none snap-x snap-mandatory">
                {filteredFamilyPackages.map((trip) => (
                  <div
                    key={trip.id}
                    className="w-[90%] shrink-0"
                  >
                    <TripCard {...trip} />
                  </div>
                ))}
              </div>

              {/* Desktop View: 3-Column Sliding Carousel */}
              <div className="hidden md:block relative">
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{
                      transform: `translateX(-${familyCarouselIndex * (100 / cardsPerView)}%)`,
                    }}
                  >
                    {filteredFamilyPackages.map((trip) => (
                      <div
                        key={trip.id}
                        className="shrink-0 basis-1/3 p-2"
                      >
                        <TripCard {...trip} />
                      </div>
                    ))}
                  </div>
                </div>

                {filteredFamilyPackages.length > cardsPerView && (
                  <>
                    <button
                      onClick={() =>
                        setFamilyCarouselIndex((prev) => Math.max(0, prev - 1))
                      }
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
                      disabled={
                        familyCarouselIndex >= filteredFamilyPackages.length - cardsPerView
                      }
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

        {/* Section 3: Customized Packages */}
        {filteredCustomizedPackages.length > 0 && (
          <section className="py-2 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                <div>
                  <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                    Tailored For You
                  </span>
                  <h2 className="text-xl md:text-3xl font-bold text-gray-900 mt-1">
                    Customized Tour Packages
                  </h2>
                </div>
                <p className="text-gray-500 text-sm mt-2 md:mt-0">
                  Showing {filteredCustomizedPackages.length} Handcrafted Packages
                </p>
              </div>

              {/* Mobile View: Horizontal Snap Scroll Carousel */}
              <div className="flex md:hidden overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-none snap-x snap-mandatory">
                {filteredCustomizedPackages.map((trip) => (
                  <div
                    key={trip.id}
                    className="w-[90%] shrink-0"
                  >
                    <TripCard {...trip} />
                  </div>
                ))}
              </div>

              {/* Desktop View: 3-Column Sliding Carousel */}
              <div className="hidden md:block relative">
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{
                      transform: `translateX(-${customizedCarouselIndex * (100 / cardsPerView)}%)`,
                    }}
                  >
                    {filteredCustomizedPackages.map((trip) => (
                      <div
                        key={trip.id}
                        className="shrink-0 basis-1/3 p-2"
                      >
                        <TripCard {...trip} />
                      </div>
                    ))}
                  </div>
                </div>

                {filteredCustomizedPackages.length > cardsPerView && (
                  <>
                    <button
                      onClick={() =>
                        setCustomizedCarouselIndex((prev) => Math.max(0, prev - 1))
                      }
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
                      disabled={
                        customizedCarouselIndex >= filteredCustomizedPackages.length - cardsPerView
                      }
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

        {/* Section 4: Related Destination Packages */}
        {relatedPackages.length > 0 && (
          <section className="py-2 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                <div>
                  <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                    Explore More
                  </span>
                  <h2 className="text-xl md:text-3xl font-bold text-gray-900 mt-1">
                    Trending India Tour Packages
                  </h2>
                </div>
                <p className="text-gray-500 text-sm mt-2 md:mt-0">
                  Showing {relatedPackages.length} Handcrafted Packages
                </p>
              </div>

              {/* Mobile View: Horizontal Snap Scroll Carousel */}
              <div className="flex md:hidden overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-none snap-x snap-mandatory">
                {relatedPackages.map((trip) => (
                  <div
                    key={trip.id}
                    className="w-[90%] shrink-0"
                  >
                    <TripCard {...trip} />
                  </div>
                ))}
              </div>

              {/* Desktop View: 3-Column Sliding Carousel */}
              <div className="hidden md:block relative">
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{
                      transform: `translateX(-${carouselIndex2 * (100 / cardsPerView)}%)`,
                    }}
                  >
                    {relatedPackages.map((trip) => (
                      <div
                        key={trip.id}
                        className="shrink-0 basis-1/3 p-2"
                      >
                        <TripCard {...trip} />
                      </div>
                    ))}
                  </div>
                </div>

                {relatedPackages.length > cardsPerView && (
                  <>
                    <button
                      onClick={() =>
                        setCarouselIndex2((prev) => Math.max(0, prev - 1))
                      }
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
                      disabled={
                        carouselIndex2 >= relatedPackages.length - cardsPerView
                      }
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

        {/* Reviews Section */}
        <section className="py-16 md:py-24 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
                ★ 4.9 out of 5 Stars
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Loved by Travelers Worldwide
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Read authentic reviews from travelers who experienced unforgettable journeys with us.
              </p>
            </div>

            {reviewsLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading reviews...</p>
              </div>
            ) : reviewsError ? (
              <div className="text-center py-12">
                <p className="text-red-600">{reviewsError}</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No reviews available yet. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviewStats.displayReviews.map((review) => (
                  <ReviewCard key={review._id} {...review} />
                ))}
              </div>
            )}

            {!reviewsLoading && reviews.length > 0 && (
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
            )}

            {!reviewsLoading && reviews.length > 0 && (
              <div className="mt-12 text-center">
                <a
                  href="/contact"
                  className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 transition-colors"
                >
                  Share Your Experience →
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-16 md:py-24 bg-linear-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
                📸 Visual Stories
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {categoryName} Gallery
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Explore breathtaking moments captured by our travelers. Click any image to view in full detail.
              </p>
            </div>

            {galleryLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading gallery images...</p>
              </div>
            ) : galleryError ? (
              <div className="text-center py-12">
                <p className="text-red-600">{galleryError}</p>
              </div>
            ) : (
              <GalleryCarousel
                images={
                  galleryImages.length > 0
                    ? galleryImages
                    : [
                        { _id: 'meg-1', image: '/images/meghalaya.jpg', category: 'meghalaya', alt: 'Living Root Bridge Meghalaya', createdAt: '' },
                        { _id: 'meg-2', image: 'https://images.unsplash.com/photo-1565716665452-2a4e3445b378?auto=format&fit=crop&w=1200&q=80', category: 'meghalaya', alt: 'Cherrapunji Valleys & Waterfalls', createdAt: '' },
                        { _id: 'meg-3', image: 'https://images.unsplash.com/photo-1654788111018-9096236d54ac?auto=format&fit=crop&w=1200&q=80', category: 'meghalaya', alt: 'Krang Suri Blue Lagoon Jowai', createdAt: '' },
                        { _id: 'meg-4', image: 'https://images.unsplash.com/photo-1521437620269-f477f5437820?auto=format&fit=crop&w=1200&q=80', category: 'meghalaya', alt: 'Dawki Umngot River Boating', createdAt: '' },
                        { _id: 'meg-5', image: 'https://images.unsplash.com/photo-1698429358246-807d8972da9a?auto=format&fit=crop&w=1200&q=80', category: 'meghalaya', alt: 'Double Decker Living Root Bridge Nongriat', createdAt: '' },
                        { _id: 'meg-6', image: 'https://images.unsplash.com/photo-1613644383947-26a22b8c04f2?auto=format&fit=crop&w=1200&q=80', category: 'meghalaya', alt: 'Nohkalikai Falls Cherrapunji', createdAt: '' }
                      ]
                }
              />
            )}
          </div>
        </section>
      </main>

      <Footer />

      <RequestCallbackDialog
        open={callbackOpen}
        onOpenChange={setCallbackOpen}
        title={categoryName}
        price={lowestPrice || 18999}
      />
    </div>
  )
}
