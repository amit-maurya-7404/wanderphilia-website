'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { TripCard } from '@/components/trip-card'
import { ReviewCard } from '@/components/review-card'
import { GalleryCarousel } from '@/components/gallery-carousel'
import { trips } from '@/lib/data'
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
  category: string
  alt?: string
  createdAt: string
}

export default function TripsPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [carouselIndex1, setCarouselIndex1] = useState(0)
  const [carouselIndex2, setCarouselIndex2] = useState(0)
  const [familyCarouselIndex, setFamilyCarouselIndex] = useState(0)
  const [customizedCarouselIndex, setCustomizedCarouselIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [cardsPerView, setCardsPerView] = useState(4)

  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewsError, setReviewsError] = useState<string | null>(null)

  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [galleryLoading, setGalleryLoading] = useState(true)
  const [galleryError, setGalleryError] = useState<string | null>(null)

  // Get all trips
  const allTrips = useMemo(() => trips, [])

  // Get featured trips for carousel (first few trips)
  const featuredTrips = useMemo(() => allTrips.slice(0, 6), [allTrips])

  // Create carousel images from featured trips
  const carouselImages = useMemo(() => {
    const tripImages = featuredTrips.map(trip => trip.image)
    const dummyImages = [
      '/images/dummy1.jpg',
      '/images/dummy2.jpg',
      '/images/dummy3.jpg',
      '/images/dummy4.jpg',
    ]
    return tripImages.length > 0 ? tripImages : dummyImages
  }, [featuredTrips])

  // Get popular packages (all trips for now)
  const popularPackages = useMemo(() => allTrips.slice(0, 8), [allTrips])

  // Get family packages (filter by easy difficulty or create sample)
  const familyPackages = useMemo(() => {
    const familyTrips = allTrips.filter(trip => trip.difficulty === 'Easy').slice(0, 4)
    if (familyTrips.length < 4) {
      // Add some sample family packages
      const samples = [
        {
          id: 'family-sample-1',
          title: 'Family Himalayan Adventure',
          image: '/images/dummy1.jpg',
          destination: 'Himalayas',
          duration: 7,
          price: 55000,
          rating: 4.8,
          slug: 'family-himalayan-adventure',
          category: 'Himachal',
          tripType: 'India' as const,
          description: 'Perfect family getaway to the majestic Himalayas',
          difficulty: 'Easy' as const,
          groupSize: 12,
          highlights: ['Family-friendly activities', 'Scenic views', 'Comfortable stays'],
          itinerary: [],
          included: ['Hotel', 'Meals', 'Guides'],
          notIncluded: ['Flights'],
          dates: [{ startDate: '2024-05-01', endDate: '2024-05-07', spots: 12 }]
        },
        {
          id: 'family-sample-2',
          title: 'Family Kerala Backwaters',
          image: '/images/dummy2.jpg',
          destination: 'Kerala',
          duration: 5,
          price: 45000,
          rating: 4.9,
          slug: 'family-kerala-backwaters',
          category: 'Kerala',
          tripType: 'India' as const,
          description: 'Relaxing family vacation in God\'s Own Country',
          difficulty: 'Easy' as const,
          groupSize: 10,
          highlights: ['Houseboat stay', 'Ayurveda', 'Cultural experiences'],
          itinerary: [],
          included: ['Hotel', 'Meals', 'Boat rides'],
          notIncluded: ['Flights'],
          dates: [{ startDate: '2024-06-01', endDate: '2024-06-05', spots: 10 }]
        }
      ]
      return [...familyTrips, ...samples].slice(0, 4)
    }
    return familyTrips
  }, [allTrips])

  // Customized packages
  const customizedPackages = useMemo(() => [
    {
      id: 'custom-1',
      title: 'Build Your Dream Trip',
      image: '/images/dummy3.jpg',
      destination: 'Custom Destination',
      duration: 0,
      price: 0,
      rating: 5,
      slug: 'custom-dream-trip',
      category: 'Custom',
      tripType: 'India' as const,
      description: 'Create your perfect itinerary with our travel experts',
      difficulty: 'Easy' as const,
      groupSize: 0,
      highlights: ['Custom duration', 'Choose activities', 'Flexible dates'],
      itinerary: [],
      included: [],
      notIncluded: [],
      dates: []
    },
    {
      id: 'custom-2',
      title: 'Talk to Travel Expert',
      image: '/images/dummy4.jpg',
      destination: 'Expert Consultation',
      duration: 0,
      price: 0,
      rating: 5,
      slug: 'expert-consultation',
      category: 'Custom',
      tripType: 'India' as const,
      description: 'Get personalized guidance from our travel specialists',
      difficulty: 'Easy' as const,
      groupSize: 0,
      highlights: ['Expert consultation', 'Personalized plan', 'Best value'],
      itinerary: [],
      included: [],
      notIncluded: [],
      dates: []
    }
  ], [])

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
                alt="Wanderphilia trips carousel"
                fill
                sizes="100vw"
                className={`object-cover transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
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
                Wanderphilia Adventures
              </span>
              <div className="w-12 h-1 bg-primary rounded-full" />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Discover Your Next Adventure
            </h1>

            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Explore incredible destinations across India and the world. From majestic mountains to pristine beaches, find your perfect getaway.
            </p>

            <div className="inline-block px-6 py-3 bg-primary/20 rounded-full border border-primary/40">
              <p className="text-white font-semibold">
                {allTrips.length} Amazing {allTrips.length === 1 ? 'Trip' : 'Trips'} Available
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

        {/* Popular Packages Section */}
        <section className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Popular Packages
            </h2>
            <div className="w-20 h-1 bg-primary rounded-full" />
          </div>

          {popularPackages.length > 0 ? (
            <div>
              {isMobile ? (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {popularPackages.map((trip) => (
                    <div key={trip.id} className="min-w-[75%] flex-shrink-0">
                      <TripCard {...trip} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setCarouselIndex1((prev) => Math.max(prev - 1, 0))}
                    disabled={carouselIndex1 === 0}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => {
                      const maxIndex = Math.max(0, popularPackages.length - cardsPerView)
                      setCarouselIndex1((prev) => Math.min(prev + 1, maxIndex))
                    }}
                    disabled={carouselIndex1 === Math.max(0, popularPackages.length - cardsPerView)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{ transform: `translateX(-${carouselIndex1 * (100 / cardsPerView)}%)` }}
                    >
                      {popularPackages.map((trip) => (
                        <div key={trip.id} className="flex-shrink-0 basis-1/4 p-2">
                          <TripCard {...trip} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-slate-600">No packages available at the moment.</p>
            </div>
          )}
        </section>

        {/* Family Packages Section */}
        <section className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Family Packages</h2>
            <div className="w-20 h-1 bg-primary rounded-full" />
          </div>
          {familyPackages.length > 0 ? (
            <div>
              {isMobile ? (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {familyPackages.map((trip) => (
                    <div key={trip.id} className="min-w-[75%] flex-shrink-0">
                      <TripCard {...trip} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setFamilyCarouselIndex((prev) => Math.max(prev - 1, 0))}
                    disabled={familyCarouselIndex === 0}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40"
                  >
                    <ChevronLeft size={20} />
                  </button>
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
                  <div className="overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{ transform: `translateX(-${familyCarouselIndex * (100 / cardsPerView)}%)` }}
                    >
                      {familyPackages.map((trip) => (
                        <div key={trip.id} className="flex-shrink-0 basis-1/4 p-2">
                          <TripCard {...trip} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </section>

        {/* Customized Packages Section */}
        <section className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Customized Packages</h2>
            <div className="w-20 h-1 bg-primary rounded-full" />
          </div>
          {customizedPackages.length > 0 ? (
            <div>
              {isMobile ? (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {customizedPackages.map((trip) => (
                    <div key={trip.id} className="min-w-[75%] flex-shrink-0">
                      <TripCard {...trip} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setCustomizedCarouselIndex((prev) => Math.max(prev - 1, 0))}
                    disabled={customizedCarouselIndex === 0}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40"
                  >
                    <ChevronLeft size={20} />
                  </button>
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
                  <div className="overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{ transform: `translateX(-${customizedCarouselIndex * (100 / cardsPerView)}%)` }}
                    >
                      {customizedPackages.map((trip) => (
                        <div key={trip.id} className="flex-shrink-0 basis-1/4 p-2">
                          <TripCard {...trip} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </section>

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
                      <Star key={i} size={24} className="fill-yellow-400 text-yellow-400" />
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
                <a href="/contact" className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 transition-colors">
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
                Wanderphilia Gallery
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
    </div>
  )
}