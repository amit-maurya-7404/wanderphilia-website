'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { TripCard } from '@/components/trip-card'
import { ReviewCard } from '@/components/review-card'
import { GalleryGrid } from '@/components/gallery-grid'
import { trips } from '@/lib/data'
import { useParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

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
  title?: string
  category: 'mountains' | 'stays' | 'trips'
  alt?: string
  caption?: string
  createdAt: string
}

interface CategoryPageProps {
  params: Promise<{
    categoryId: string
  }>
}

export default function CategoryPage() {
  const params = useParams()
  const categoryId = params.categoryId as string
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [carouselIndex1, setCarouselIndex1] = useState(0)
  const [carouselIndex2, setCarouselIndex2] = useState(0)
  const [familyCarouselIndex, setFamilyCarouselIndex] = useState(0)
  const [customizedCarouselIndex, setCustomizedCarouselIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [cardsPerView, setCardsPerView] = useState(4)

  // Reviews state
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewsError, setReviewsError] = useState<string | null>(null)

  // Gallery state
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [galleryLoading, setGalleryLoading] = useState(true)
  const [galleryError, setGalleryError] = useState<string | null>(null)

  // Map category ID to proper category name
  const categoryMapping: Record<string, string> = {
    'leh-ladakh': 'Leh Ladakh',
    'spiti': 'Spiti',
    'himachal': 'Himachal',
    'kashmir': 'Kashmir',
    'meghalaya': 'Meghalaya',
    'nepal': 'Nepal',
    'indonesia': 'Indonesia',
    'switzerland': 'Switzerland',
    'peru': 'Peru',
    'iceland': 'Iceland',
    'japan': 'Japan',
    'bhutan': 'Bhutan'
  }

  const categoryName = categoryMapping[categoryId] || categoryId

  // Get all trips for this category
  const categoryTrips = useMemo(() => {
    return trips.filter(trip =>
      trip.category === categoryName ||
      trip.category.toLowerCase() === categoryId
    )
  }, [categoryId, categoryName])

  // Get first trip for category description/type
  const firstTrip = categoryTrips[0]
  const isCategoryInternational = firstTrip?.tripType === 'International'

  // Get related packages (same trip type, different categories)
  const relatedPackages = useMemo(() => {
    const filtered = trips.filter(trip =>
      trip.category !== categoryName &&
      trip.tripType === (firstTrip?.tripType || 'India')
    )
    // Return first 6 packages without shuffling to avoid hydration mismatch
    return filtered.slice(0, 6)
  }, [categoryName, firstTrip?.tripType])

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
        setGalleryImages(data)
      } catch (error) {
        setGalleryError((error as Error).message)
      } finally {
        setGalleryLoading(false)
      }
    }
    fetchGallery()
  }, [])

  // Family Packages Data
  const familyPackages = useMemo(() => {
    const tripTypeValue: 'India' | 'International' = isCategoryInternational ? 'International' : 'India'
    return [
      {
        id: `family-1-${categoryId}`,
        title: `Family ${categoryName} Adventure`,
        image: '/images/dummy1.jpg',
        destination: categoryName,
        duration: 5,
        price: 45000,
        rating: 4.8,
        slug: `family-adventure-${categoryId}`,
        category: categoryName,
        tripType: tripTypeValue,
        description: `Experience ${categoryName} with your family on this specially designed package`,
        difficulty: 'Easy' as const,
        groupSize: 10,
        highlights: ['Family-friendly activities', 'Comfortable accommodation', 'Kid-safe attractions'],
        itinerary: [],
        included: ['Hotel', 'Meals', 'Guides'],
        notIncluded: ['Flights'],
        dates: [{ startDate: '2024-05-01', endDate: '2024-05-05', spots: 10 }]
      },
      {
        id: `family-2-${categoryId}`,
        title: `Family ${categoryName} Getaway`,
        image: '/images/dummy2.jpg',
        destination: categoryName,
        duration: 7,
        price: 65000,
        rating: 4.9,
        slug: `family-getaway-${categoryId}`,
        category: categoryName,
        tripType: tripTypeValue,
        description: `Extended family vacation package for ${categoryName}`,
        difficulty: 'Easy' as const,
        groupSize: 12,
        highlights: ['Extended stay', 'Multiple attractions', 'Family activities'],
        itinerary: [],
        included: ['Hotel', 'Meals', 'Guides', 'Activities'],
        notIncluded: ['Flights'],
        dates: [{ startDate: '2024-06-01', endDate: '2024-06-07', spots: 12 }]
      },
      {
        id: `family-3-${categoryId}`,
        title: `Family ${categoryName} Explorer`,
        image: '/images/dummy3.jpg',
        destination: categoryName,
        duration: 10,
        price: 89000,
        rating: 4.7,
        slug: `family-explorer-${categoryId}`,
        category: categoryName,
        tripType: tripTypeValue,
        description: `Complete family exploration of ${categoryName}`,
        difficulty: 'Moderate' as const,
        groupSize: 15,
        highlights: ['Complete tour', 'All attractions', 'Expert guides'],
        itinerary: [],
        included: ['Hotel', 'Meals', 'Guides', 'Activities', 'Transportation'],
        notIncluded: ['Flights'],
        dates: [{ startDate: '2024-07-01', endDate: '2024-07-10', spots: 15 }]
      },
      {
        id: `family-4-${categoryId}`,
        title: `Family ${categoryName} Experience`,
        image: '/images/dummy4.jpg',
        destination: categoryName,
        duration: 6,
        price: 55000,
        rating: 4.85,
        slug: `family-experience-${categoryId}`,
        category: categoryName,
        tripType: tripTypeValue,
        description: `Immersive family experience in ${categoryName}`,
        difficulty: 'Easy' as const,
        groupSize: 10,
        highlights: ['Cultural experiences', 'Local food', 'Family entertainment'],
        itinerary: [],
        included: ['Hotel', 'Meals', 'Guides'],
        notIncluded: ['Flights'],
        dates: [{ startDate: '2024-08-01', endDate: '2024-08-06', spots: 10 }]
      }
    ]
  }, [categoryId, categoryName, isCategoryInternational])

  // Customized Packages Data
  const customizedPackages = useMemo(() => {
    const tripTypeValue: 'India' | 'International' = isCategoryInternational ? 'International' : 'India'
    return [
      {
        id: `custom-1-${categoryId}`,
        title: `Build Your ${categoryName} Trip`,
        image: '/images/dummy3.jpg',
        destination: categoryName,
        duration: 0,
        price: 0,
        rating: 5,
        slug: `custom-build-${categoryId}`,
        category: categoryName,
        tripType: tripTypeValue,
        description: `Create your custom itinerary for ${categoryName}`,
        difficulty: 'Easy' as const,
        groupSize: 0,
        highlights: ['Custom duration', 'Choose activities', 'Flexible dates'],
        itinerary: [],
        included: [],
        notIncluded: [],
        dates: []
      },
      {
        id: `custom-2-${categoryId}`,
        title: `Talk to ${categoryName} Expert`,
        image: '/images/dummy4.jpg',
        destination: categoryName,
        duration: 0,
        price: 0,
        rating: 5,
        slug: `custom-expert-${categoryId}`,
        category: categoryName,
        tripType: tripTypeValue,
        description: `Get expert guidance for your ${categoryName} trip`,
        difficulty: 'Easy' as const,
        groupSize: 0,
        highlights: ['Expert consultation', 'Personalized plan', 'Best value'],
        itinerary: [],
        included: [],
        notIncluded: [],
        dates: []
      }
    ]
  }, [categoryId, categoryName, isCategoryInternational])

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
        <section className="relative overflow-hidden bg-slate-950 min-h-[500px] flex items-center justify-center">
          {/* Background Carousel */}
          <div className="absolute inset-0 z-0">
            {carouselImages.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`${categoryName} carousel`}
                fill
                className={`object-cover transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                priority={index === 0}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/70 to-slate-950/95" />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="w-12 h-1 bg-primary rounded-full" />
              <span className="text-primary font-semibold text-sm tracking-widest uppercase">
                {isCategoryInternational ? 'International' : 'India'} Destination
              </span>
              <div className="w-12 h-1 bg-primary rounded-full" />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {categoryName}
            </h1>

            {firstTrip && (
              <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
                {firstTrip.description}
              </p>
            )}

            <div className="inline-block px-6 py-3 bg-primary/20 rounded-full border border-primary/40">
              <p className="text-white font-semibold">
                {categoryTrips.length} {categoryTrips.length === 1 ? 'Package' : 'Packages'} Available
              </p>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* Packages Section */}
        <section className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Available Packages
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
              Family Packages
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
              Customized Packages
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
              <GalleryGrid images={galleryImages} showFilter={true} />
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
