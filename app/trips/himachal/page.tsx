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
import { trips, getLowestPriceForTrips } from '@/lib/data'
import { getSectionMapping } from '@/lib/section-mappings'
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

export default function HimachalPage() {
  const categoryId = 'himachal'
  const categoryName = 'Himachal'
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [carouselIndex1, setCarouselIndex1] = useState(0)
  const [carouselIndex2, setCarouselIndex2] = useState(0)
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

  // Central mapping system for trip sections
  const sectionMap = getSectionMapping(categoryId)

  // Helper function to get trips by section
  const getTripsBySection = (section: keyof typeof sectionMap) => {
    const tripIds = sectionMap[section]
    return trips.filter(trip => tripIds.includes(trip.id))
  }

  // Get all trips for this category (available packages)
  const categoryTrips = useMemo(() => {
    return getTripsBySection('available')
  }, [])

  // Get first trip for category description/type
  const firstTrip = categoryTrips[0]
  const isCategoryInternational = firstTrip?.tripType === 'International'

  const lowestPrice = useMemo(() => {
    return getLowestPriceForTrips(categoryTrips)
  }, [categoryTrips]);

  // Get related packages (other India destinations)
  const relatedPackages = useMemo(() => {
    return getTripsBySection('related')
  }, [])

  // Create carousel images - use trip images from category or fallback to dummy images
  const carouselImages = useMemo(() => {
    const categoryImages = categoryTrips.map(trip => trip.image)
    // Fallback to dummy images if not enough
    const dummyImages = [
      '/images/dummy1.jpg',
      '/images/dummy2.jpg',
      '/images/dummy3.jpg',
      '/images/dummy4.jpg',
    ]
    return categoryImages.length > 0 ? categoryImages : dummyImages
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
      setCardsPerView(mobile ? 2 : 4)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // reset indices when layout changes
  useEffect(() => {
    setCarouselIndex1(0)
    setCarouselIndex2(0)
    setFamilyCarouselIndex(0)
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
        const response = await fetch('/api/gallery')
        if (!response.ok) {
          throw new Error('Unable to load gallery')
        }
        const data = await response.json()
        // Filter images for this category
        const filtered = data.filter((img: any) => img.category === categoryId)
        setGalleryImages(filtered.length > 0 ? filtered : data)
      } catch (error) {
        setGalleryError((error as Error).message)
      } finally {
        setGalleryLoading(false)
      }
    }
    fetchGallery()
  }, [categoryId])

  // Family Packages Data
  const familyPackages = useMemo(() => {
    return getTripsBySection('family')
  }, [])

  // Customized Packages Data
  const customizedPackages = useMemo(() => {
    return getTripsBySection('custom')
  }, [])

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
          <TripHeroCarousel media={firstTrip?.heroMedia || [{ type: 'image' as const, src: firstTrip?.image || '/images/dummy1.jpg', alt: categoryName }]} />

          <div className="absolute inset-0 bg-linear-to-r from-slate-950/90 via-slate-950/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-5 md:px-6 pb-6 sm:pb-8 lg:pb-10">
              <div className="  text-white ">
                <div className="max-w-6xl">
                  <div className="mb-4 inline-flex items-center rounded-full bg-amber-400/15 px-3 py-1 text-sm font-semibold text-amber-200 ring-1 ring-amber-300/20">
                    Starting Price
                    <span className="ml-2 text-white">₹{(lowestPrice || 0).toLocaleString('en-IN')} / person</span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                    20+ Himachal Pradesh Tour Packages 2026
                  </h1>

                  <p className={`mt-3 text-sm sm:text-base md:text-lg text-slate-100 ${!isDescExpanded ? 'line-clamp-3 md:line-clamp-none' : ''}`}>
                    All inclusive curated Top OffBeat Himachal Pradesh Group & customised Tour Packages 2026 covering Kullu Valley , Manali , Sissu , Kasol , Parvati Valley , Thirthan Valley , Jibhi , Saanj Valley , Bir Billing , Dalhousie  , Khajjair , McloedGanj , Dharamshala , Amritsar.
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
                        const message = `Hi Wanderphilia, I want to inquire about Himachal from Website`

                        const encodedMessage = encodeURIComponent(message)

                        window.open(
                          `https://wa.me/919217664099?text=${encodedMessage}`,
                          '_blank'
                        )
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

        {/* Packages Section */}
        <section className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Upcoming Himachal Trips 2026 - Wanderphilia Exclusives
            </h2>
            <div className="w-20 h-1 bg-primary rounded-full" />
          </div>

          {categoryTrips.length > 0 ? (
            <div>
              {/* ✅ MOBILE SCROLLER */}
              {isMobile ? (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {categoryTrips.map((trip) => (
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
                  {/* DESKTOP CAROUSEL */}
                  <div className="relative">

                    {/* LEFT */}
                    <button
                      onClick={() => {
                        setCarouselIndex1((prev) => Math.max(prev - 1, 0))
                      }}
                      disabled={carouselIndex1 === 0}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    {/* RIGHT */}
                    <button
                      onClick={() => {
                        const maxIndex = Math.max(0, categoryTrips.length - cardsPerView)
                        setCarouselIndex1((prev) => Math.min(prev + 1, maxIndex))
                      }}
                      disabled={carouselIndex1 === Math.max(0, categoryTrips.length - cardsPerView)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40"
                    >
                      <ChevronRight size={20} />
                    </button>

                    {/* TRACK */}
                    <div className="overflow-hidden">
                      <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{
                          transform: `translateX(-${carouselIndex1 * (100 / cardsPerView)}%)`,
                        }}
                      >
                        {categoryTrips.map((trip) => (
                          <div
                            key={trip.id}
                            className="flex-shrink-0 basis-1/4 p-2"
                          >
                            <TripCard {...trip} />
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-slate-600">
                No packages found for this category.
              </p>
            </div>
          )}
        </section>



        {/* Family Packages Section */}
        <section className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Adventurous & Offbeat Himchal Group Trip - Wanderphilia Exclusive
            </h2>
            <div className="w-20 h-1 bg-primary rounded-full" />
          </div>

          {familyPackages.length > 0 ? (
            <div>
              {/* ✅ MOBILE SCROLLER */}
              {isMobile ? (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {familyPackages.map((trip) => (
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
                  {/* DESKTOP CAROUSEL */}
                  <div className="relative">

                    {/* LEFT */}
                    <button
                      onClick={() => {
                        setFamilyCarouselIndex((prev) => Math.max(prev - 1, 0))
                      }}
                      disabled={familyCarouselIndex === 0}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    {/* RIGHT */}
                    <button
                      onClick={() => {
                        const maxIndex = Math.max(0, familyPackages.length - cardsPerView)
                        setFamilyCarouselIndex((prev) => Math.min(prev + 1, maxIndex))
                      }}
                      disabled={familyCarouselIndex === Math.max(0, familyPackages.length - cardsPerView)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40"
                    >
                      <ChevronRight size={20} />
                    </button>

                    {/* TRACK */}
                    <div className="overflow-hidden">
                      <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{
                          transform: `translateX(-${familyCarouselIndex * (100 / cardsPerView)}%)`,
                        }}
                      >
                        {familyPackages.map((trip) => (
                          <div
                            key={trip.id}
                            className="flex-shrink-0 basis-1/4 p-2"
                          >
                            <TripCard {...trip} />
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </>
              )}
            </div>
          ) : null}
        </section>

        {/* Customized Packages Section */}
        <section className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Family Himachal Trip 2026 - Wanderphilia Exclusive
            </h2>
            <div className="w-20 h-1 bg-primary rounded-full" />
          </div>

          {customizedPackages.length > 0 ? (
            <div>
              {/* ✅ MOBILE SCROLLER */}
              {isMobile ? (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {customizedPackages.map((trip) => (
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
                  {/* DESKTOP CAROUSEL */}
                  <div className="relative">

                    {/* LEFT */}
                    <button
                      onClick={() => {
                        setCustomizedCarouselIndex((prev) => Math.max(prev - 1, 0))
                      }}
                      disabled={customizedCarouselIndex === 0}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    {/* RIGHT */}
                    <button
                      onClick={() => {
                        const maxIndex = Math.max(0, customizedPackages.length - cardsPerView)
                        setCustomizedCarouselIndex((prev) => Math.min(prev + 1, maxIndex))
                      }}
                      disabled={customizedCarouselIndex === Math.max(0, customizedPackages.length - cardsPerView)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40"
                    >
                      <ChevronRight size={20} />
                    </button>

                    {/* TRACK */}
                    <div className="overflow-hidden">
                      <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{
                          transform: `translateX(-${customizedCarouselIndex * (100 / cardsPerView)}%)`,
                        }}
                      >
                        {customizedPackages.map((trip) => (
                          <div
                            key={trip.id}
                            className="flex-shrink-0 basis-1/4 p-2"
                          >
                            <TripCard {...trip} />
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </>
              )}
            </div>
          ) : null}
        </section>

        {/* Related Packages Section */}
        {relatedPackages.length > 0 && (
          <section className="py-16 px-4 md:px-8 lg:px-16 bg-slate-50">
            <div className="max-w-7xl mx-auto">
              <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Other {isCategoryInternational ? 'International' : 'India'} Destinations
                </h2>
                <div className="w-20 h-1 bg-primary rounded-full" />
              </div>

              {/* ✅ MOBILE SCROLLER */}
              {isMobile ? (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {relatedPackages.map((trip) => (
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
                  {/* DESKTOP CAROUSEL */}
                  <div className="relative">

                    {/* LEFT */}
                    <button
                      onClick={() => {
                        setCarouselIndex2((prev) => Math.max(prev - 1, 0))
                      }}
                      disabled={carouselIndex2 === 0}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    {/* RIGHT */}
                    <button
                      onClick={() => {
                        const maxIndex = Math.max(0, relatedPackages.length - cardsPerView)
                        setCarouselIndex2((prev) => Math.min(prev + 1, maxIndex))
                      }}
                      disabled={carouselIndex2 === Math.max(0, relatedPackages.length - cardsPerView)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40"
                    >
                      <ChevronRight size={20} />
                    </button>

                    {/* TRACK */}
                    <div className="overflow-hidden">
                      <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{
                          transform: `translateX(-${carouselIndex2 * (100 / cardsPerView)}%)`,
                        }}
                      >
                        {relatedPackages.map((trip) => (
                          <div
                            key={trip.id}
                            className="flex-shrink-0 basis-1/4 p-2"
                          >
                            <TripCard {...trip} />
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {/* Customer Reviews Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-semibold text-sm mb-4">
                ⭐ Customer Reviews
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                What Our Travelers Say
              </h2>

              {reviewsLoading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading reviews...</p>
                </div>
              ) : reviewsError ? (
                <div className="text-center py-12">
                  <p className="text-red-600">{reviewsError}</p>
                </div>
              ) : reviews.length > 0 ? (
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={24}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <div className="text-left">
                    <p className="text-3xl font-bold text-gray-900">{reviewStats.avgRating}</p>
                    <p className="text-gray-600 text-sm">{reviewStats.totalReviews} reviews across platforms</p>
                  </div>
                </div>
              ) : null}

              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Trusted by thousands of travelers. Here's what they have to say about their Wanderphilia experiences.
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
            ) : galleryImages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No gallery images available yet. Check back soon!</p>
              </div>
            ) : (
              <GalleryCarousel images={galleryImages} />
            )}
          </div>
        </section>
      </main>

      <Footer />

      <RequestCallbackDialog
        open={callbackOpen}
        onOpenChange={setCallbackOpen}
        title={categoryName}
        price={lowestPrice || 0}
      />
    </div>
  )
}