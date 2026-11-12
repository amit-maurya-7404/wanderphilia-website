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
  title?: string
  city?: string
  theme?: string
  createdAt: string
}

export default function RajasthanPage() {
  console.log("=== RAJASTHAN PAGE RENDERING ===")
  const categoryId = 'rajasthan'
  const categoryName = 'Rajasthan'
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
  const [galleryCityFilter, setGalleryCityFilter] = useState<string>('All')

  const displayedGalleryImages = useMemo(() => {
    if (galleryCityFilter === 'All') return galleryImages
    const filterKey = galleryCityFilter.toLowerCase().replace(/[^a-z0-9]/g, '')
    return galleryImages.filter(img => {
      const c = (img.city || '').toLowerCase().replace(/[^a-z0-9]/g, '')
      const path = (img.image || '').toLowerCase().replace(/[^a-z0-9]/g, '')
      const title = (img.title || '').toLowerCase().replace(/[^a-z0-9]/g, '')
      return c.includes(filterKey) || path.includes(filterKey) || title.includes(filterKey)
    })
  }, [galleryImages, galleryCityFilter])

  // Central mapping system for trip sections
  const { getTripsBySection, sectionMap, dynamicTrips } = useDestinationTrips(categoryId)

  // Get all trips for this category (available packages)
  const categoryTrips = useMemo(() => {
    return getTripsBySection('available')
  }, [getTripsBySection, dynamicTrips])

  // Get first trip for category description/type
  const firstTrip = categoryTrips[0]
  const isCategoryInternational = firstTrip?.tripType === 'International'

  const lowestPrice = useMemo(() => {
    return getLowestPriceForTrips(categoryTrips) || 19000
  }, [categoryTrips])

  // Get related packages (other India destinations)
  const relatedPackages = useMemo(() => {
    return getTripsBySection('related')
  }, [getTripsBySection, dynamicTrips])

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

  const fallbackRajasthanImages = [
    '/images/Rajasthan/jaipur/amer-fort-jaipur.webp',
    '/images/Rajasthan/jaipur/hawa-mahal-jaipur.webp',
    '/images/Rajasthan/udaipur/lake-pichola-view.jpg',
    '/images/Rajasthan/jodhpur/mehrangarh-fort-jodhpur.jpg',
    '/images/Rajasthan/jaisalmer-desert/sam-sand-dunes-sunset.jpg',
    '/images/Rajasthan/jaisalmer-city/gadisar-lake-sunset.webp',
    '/images/Rajasthan/jaipur/nahargarh-fort-sunset.webp',
    '/images/Rajasthan/udaipur/udaipur-city-palace-aerial.jpg',
    '/images/Rajasthan/jawai/jawai-leopard-jeep-safari.jpg',
  ]

  // Create carousel images - use trip images from category or fallback
  const carouselImages = useMemo(() => {
    const categoryImages = categoryTrips.flatMap(trip => trip.images || (trip.image ? [trip.image] : [])).filter(Boolean)
    return categoryImages.length > 0 ? categoryImages : fallbackRajasthanImages
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
        const response = await fetch('/api/gallery')
        if (!response.ok) {
          throw new Error('Unable to load gallery')
        }
        const data = await response.json()
        // Filter images for this category
        const filtered = data.filter((img: any) => img.category === categoryId)
        if (filtered.length > 0) {
          setGalleryImages(filtered)
        } else {
          // Fallback gallery items
          setGalleryImages([
            { _id: '1', image: '/images/Rajasthan/jaipur/hawa-mahal-jaipur.webp', category: 'rajasthan', alt: 'Hawa Mahal Jaipur', title: 'Hawa Mahal', createdAt: '2026-01-01' },
            { _id: '2', image: '/images/Rajasthan/jaipur/amer-fort-jaipur.webp', category: 'rajasthan', alt: 'Amer Fort Jaipur', title: 'Amer Fort', createdAt: '2026-01-01' },
            { _id: '3', image: '/images/Rajasthan/jaipur/nahargarh-fort-sunset.webp', category: 'rajasthan', alt: 'Nahargarh Fort Sunset', title: 'Nahargarh Sunset', createdAt: '2026-01-01' },
            { _id: '4', image: '/images/Rajasthan/udaipur/udaipur-city-palace-aerial.jpg', category: 'rajasthan', alt: 'City Palace Udaipur', title: 'City Palace', createdAt: '2026-01-01' },
            { _id: '5', image: '/images/Rajasthan/udaipur/lake-pichola-view.jpg', category: 'rajasthan', alt: 'Lake Pichola Udaipur', title: 'Lake Pichola', createdAt: '2026-01-01' },
            { _id: '6', image: '/images/Rajasthan/jodhpur/mehrangarh-fort-jodhpur.jpg', category: 'rajasthan', alt: 'Mehrangarh Fort Jodhpur', title: 'Mehrangarh Fort', createdAt: '2026-01-01' },
            { _id: '7', image: '/images/Rajasthan/jodhpur/jodhpur-overview-sunset.jpg', category: 'rajasthan', alt: 'Jodhpur Blue City Sunset', title: 'Blue City Sunset', createdAt: '2026-01-01' },
            { _id: '8', image: '/images/Rajasthan/jaisalmer-city/jaisalmer-golden-fort.jpg', category: 'rajasthan', alt: 'Golden Fort Jaisalmer', title: 'Sonar Qila', createdAt: '2026-01-01' },
            { _id: '9', image: '/images/Rajasthan/jaisalmer-desert/sam-sand-dunes-sunset.jpg', category: 'rajasthan', alt: 'Sam Sand Dunes Sunset', title: 'Sam Dunes Sunset', createdAt: '2026-01-01' },
            { _id: '10', image: '/images/Rajasthan/jaisalmer-desert/camel-safari-desert.webp', category: 'rajasthan', alt: 'Thar Camel Safari', title: 'Camel Safari', createdAt: '2026-01-01' },
            { _id: '11', image: '/images/Rajasthan/jawai/jawai-leopard-jeep-safari.jpg', category: 'rajasthan', alt: 'Jawai Leopard Safari', title: 'Jawai Leopard Safari', createdAt: '2026-01-01' },
            { _id: '12', image: '/images/Rajasthan/jawai/jawai-granite-hills-landscape.jpg', category: 'rajasthan', alt: 'Jawai Granite Hills', title: 'Jawai Hills Landscape', createdAt: '2026-01-01' },
          ])
        }
      } catch (error) {
        setGalleryError((error as Error).message)
      } finally {
        setGalleryLoading(false)
      }
    }
    fetchGallery()
  }, [categoryId])

  const [selectedDuration, setSelectedDuration] = useState<number | null>(null)

  const allCategoryTrips = useMemo(() => {
    const combined = [...categoryTrips, ...(typeof groupPackages !== 'undefined' ? groupPackages : []), ...familyPackages, ...(typeof honeymoonPackages !== 'undefined' ? honeymoonPackages : []), ...customizedPackages]
    const seen = new Set<string>()
    return combined.filter(trip => {
      if (seen.has(trip.id)) return false
      seen.add(trip.id)
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
    const fallbackReviews: ReviewItem[] = [
      {
        _id: '1',
        name: 'Bhavin Thakker',
        platform: 'Google',
        rating: 5,
        comment: 'Our Rajasthan trip with Wanderphilia was sheer perfection! The hotel in Jaipur and Agra, plus the sunrise Taj Mahal and Nahargarh sunset view were unforgettable.',
        createdAt: '2026-02-14'
      },
      {
        _id: '2',
        name: 'Rohan Deshmukh',
        platform: 'Facebook',
        rating: 5,
        comment: 'The private AC vehicle and dedicated driver made the family trip so comfortable. Elephant village in Jaipur was a huge hit with the kids!',
        createdAt: '2026-01-20'
      },
      {
        _id: '3',
        name: 'Meera Kapoor',
        platform: 'Google',
        rating: 5,
        comment: 'Highly professional concierge support. The Vrindavan Darshan en-route and smooth check-ins made our holiday seamless.',
        createdAt: '2026-01-05'
      },
      {
        _id: '4',
        name: 'Pooja Agarwal',
        platform: 'Justdial',
        rating: 5,
        comment: 'Incredible experience covering Amber fort, Ranthambore and Agra. The guides were knowledgeable and everything was well-organized.',
        createdAt: '2025-12-18'
      }
    ]

    const list = reviews.length > 0 ? reviews : fallbackReviews
    const avgRating = (list.reduce((sum, r) => sum + r.rating, 0) / list.length).toFixed(1)
    const totalReviews = reviews.length > 0 ? reviews.length : 248
    const displayReviews = list.slice(0, 6)
    return { avgRating, totalReviews, displayReviews }
  }, [reviews])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="grow">
        {/* Hero Section with Carousel */}
        <div className="relative h-[50vh] sm:h-[50vh] md:h-[70vh] min-h-75 pt-20">
          <TripHeroCarousel
            media={
              firstTrip?.heroMedia ||
              fallbackRajasthanImages.map((src, i) => ({
                type: 'image' as const,
                src,
                alt: `Rajasthan Hero ${i + 1}`
              }))
            }
          />

          <div className="absolute inset-0 bg-linear-to-r from-slate-950/90 via-slate-950/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-5 md:px-6 pb-6 sm:pb-8 lg:pb-10">
              <div className="text-white">
                <div className="max-w-2xl">
                  <div className="mb-4 inline-flex items-center rounded-full bg-amber-400/15 px-3 py-1 text-sm font-semibold text-amber-200 ring-1 ring-amber-300/20">
                    Starting Price
                    <span className="ml-2 text-white">₹{(lowestPrice || 0).toLocaleString('en-IN')} / person</span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                    20+ Rajasthan Tour Packages 2026
                  </h1>

                  <p className={`mt-3 md:mt-0 text-sm sm:text-base md:text-lg max-w-2xl text-white leading-relaxed ${!isDescExpanded ? 'line-clamp-3 md:line-clamp-none' : ''}`}>
                    Experience the regal grandeur of Rajasthan with handpicked palace stays, historic forts, elephant encounters, tranquil wildlife, and the timeless wonder of the Taj Mahal.
                  </p>
                  <button
                    onClick={() => setIsDescExpanded(!isDescExpanded)}
                    className="md:hidden text-amber-300 font-semibold text-xs mt-2 flex items-center gap-1 cursor-pointer select-none"
                  >
                    {isDescExpanded ? 'View Less ▲' : 'View More ▼'}
                  </button>

                  <div className="mt-5 md:mt-5 flex flex-row gap-2 sm:flex-row sm:items-center">
                    <Button
                      size="lg"
                      className="min-w-30 bg-amber-400 text-white hover:bg-amber-300 cursor-pointer"
                      onClick={() => setCallbackOpen(true)}
                    >
                      <Phone size={18} className="mr-0" /> Request a Callback
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="min-w-32 border-white/60 text-slate-800 hover:text-white hover:border-white hover:bg-white/10 bg-white cursor-pointer"
                      onClick={() => {
                        const message = `Hi Wanderphilia, I want to inquire about Rajasthan from Website`
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

        {/* Duration Filter */}
        <DurationFilter
          trips={allCategoryTrips}
          selectedDuration={selectedDuration}
          onChange={setSelectedDuration}
        />

        {/* 1. Group Trip Section */}
        {filteredGroupPackages.length > 0 && (
          <section className="py-10 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4">
                {categoryName} Group Trips
              </h2>
              <div className="w-20 h-1 bg-primary rounded-full" />
            </div>

            <div>
              {/* ✅ MOBILE SCROLLER */}
              <div className="flex md:hidden gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {filteredGroupPackages.map((trip) => (
                  <div key={`grp-${trip.id}`} className="w-[90%] shrink-0">
                    <TripCard {...trip} />
                  </div>
                ))}
              </div>

              <div className="hidden md:block relative">
                {/* DESKTOP CAROUSEL */}
                <div className="relative">
                  <button
                    onClick={() => setGroupCarouselIndex((prev) => Math.max(prev - 1, 0))}
                    disabled={groupCarouselIndex === 0}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    onClick={() => {
                      const maxIndex = Math.max(0, filteredGroupPackages.length - cardsPerView)
                      setGroupCarouselIndex((prev) => Math.min(prev + 1, maxIndex))
                    }}
                    disabled={groupCarouselIndex === Math.max(0, filteredGroupPackages.length - cardsPerView)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight size={20} />
                  </button>

                  <div className="overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${groupCarouselIndex * (100 / cardsPerView)}%)`,
                      }}
                    >
                      {filteredGroupPackages.map((trip) => (
                        <div key={`grp-card-${trip.id}`} className="shrink-0 basis-1/3 p-2">
                          <TripCard {...trip} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 2. Family Trip Section */}
        {filteredFamilyPackages.length > 0 && (
          <section className="py-10 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4">
                {categoryName} Family Trips
              </h2>
              <div className="w-20 h-1 bg-primary rounded-full" />
            </div>

            <div>
              {/* ✅ MOBILE SCROLLER */}
              <div className="flex md:hidden gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {filteredFamilyPackages.map((trip) => (
                  <div key={`fam-${trip.id}`} className="w-[90%] shrink-0">
                    <TripCard {...trip} />
                  </div>
                ))}
              </div>

              <div className="hidden md:block relative">
                {/* DESKTOP CAROUSEL */}
                <div className="relative">
                  <button
                    onClick={() => setFamilyCarouselIndex((prev) => Math.max(prev - 1, 0))}
                    disabled={familyCarouselIndex === 0}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    onClick={() => {
                      const maxIndex = Math.max(0, filteredFamilyPackages.length - cardsPerView)
                      setFamilyCarouselIndex((prev) => Math.min(prev + 1, maxIndex))
                    }}
                    disabled={familyCarouselIndex === Math.max(0, filteredFamilyPackages.length - cardsPerView)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight size={20} />
                  </button>

                  <div className="overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${familyCarouselIndex * (100 / cardsPerView)}%)`,
                      }}
                    >
                      {filteredFamilyPackages.map((trip) => (
                        <div key={`fam-card-${trip.id}`} className="shrink-0 basis-1/3 p-2">
                          <TripCard {...trip} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 3. Couple Trip Section */}
        {filteredHoneymoonPackages.length > 0 && (
          <section className="py-10 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4">
                {categoryName} Couple Trips
              </h2>
              <div className="w-20 h-1 bg-primary rounded-full" />
            </div>

            <div>
              {/* ✅ MOBILE SCROLLER */}
              <div className="flex md:hidden gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {filteredHoneymoonPackages.map((trip) => (
                  <div key={`couple-${trip.id}`} className="w-[90%] shrink-0">
                    <TripCard {...trip} />
                  </div>
                ))}
              </div>

              <div className="hidden md:block relative">
                {/* DESKTOP CAROUSEL */}
                <div className="relative">
                  <button
                    onClick={() => setHoneymoonCarouselIndex((prev) => Math.max(prev - 1, 0))}
                    disabled={honeymoonCarouselIndex === 0}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    onClick={() => {
                      const maxIndex = Math.max(0, filteredHoneymoonPackages.length - cardsPerView)
                      setHoneymoonCarouselIndex((prev) => Math.min(prev + 1, maxIndex))
                    }}
                    disabled={honeymoonCarouselIndex === Math.max(0, filteredHoneymoonPackages.length - cardsPerView)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight size={20} />
                  </button>

                  <div className="overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${honeymoonCarouselIndex * (100 / cardsPerView)}%)`,
                      }}
                    >
                      {filteredHoneymoonPackages.map((trip) => (
                        <div key={`couple-card-${trip.id}`} className="shrink-0 basis-1/3 p-2">
                          <TripCard {...trip} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 4. Available Trips Section */}
        <section className="py-10 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4">
              Available {categoryName} Trips
            </h2>
            <div className="w-20 h-1 bg-primary rounded-full" />
          </div>

          {filteredCategoryTrips.length > 0 ? (
            <div>
              {/* ✅ MOBILE SCROLLER */}
              <div className="flex md:hidden gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {filteredCategoryTrips.map((trip) => (
                  <div key={`avail-${trip.id}`} className="w-[90%] shrink-0">
                    <TripCard {...trip} />
                  </div>
                ))}
              </div>

              <div className="hidden md:block relative">
                {/* DESKTOP CAROUSEL */}
                <div className="relative">
                  <button
                    onClick={() => setCarouselIndex1((prev) => Math.max(prev - 1, 0))}
                    disabled={carouselIndex1 === 0}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    onClick={() => {
                      const maxIndex = Math.max(0, filteredCategoryTrips.length - cardsPerView)
                      setCarouselIndex1((prev) => Math.min(prev + 1, maxIndex))
                    }}
                    disabled={carouselIndex1 === Math.max(0, filteredCategoryTrips.length - cardsPerView)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight size={20} />
                  </button>

                  <div className="overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${carouselIndex1 * (100 / cardsPerView)}%)`,
                      }}
                    >
                      {filteredCategoryTrips.map((trip) => (
                        <div key={`avail-card-${trip.id}`} className="shrink-0 basis-1/3 p-2">
                          <TripCard {...trip} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12">
              <NoPackagesCallbackForm
                nights={selectedDuration}
                destinationName={categoryName}
              />
            </div>
          )}
        </section>

        {/* 5. Related Trips Section */}
        {relatedPackages.length > 0 && (
          <section className="py-10 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
            <div>
              <div className="mb-12">
                <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4">
                  Related Trips - Other {isCategoryInternational ? 'International' : 'India'} Destinations
                </h2>
                <div className="w-20 h-1 bg-primary rounded-full" />
              </div>

              {/* ✅ MOBILE SCROLLER */}
              <div className="flex md:hidden gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {relatedPackages.map((trip) => (
                  <div key={`rel-${trip.id}`} className="w-[90%] shrink-0">
                    <TripCard {...trip} />
                  </div>
                ))}
              </div>

              <div className="hidden md:block relative">
                {/* DESKTOP CAROUSEL */}
                <div className="relative">
                  <button
                    onClick={() => setCarouselIndex2((prev) => Math.max(prev - 1, 0))}
                    disabled={carouselIndex2 === 0}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    onClick={() => {
                      const maxIndex = Math.max(0, relatedPackages.length - cardsPerView)
                      setCarouselIndex2((prev) => Math.min(prev + 1, maxIndex))
                    }}
                    disabled={carouselIndex2 === Math.max(0, relatedPackages.length - cardsPerView)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight size={20} />
                  </button>

                  <div className="overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${carouselIndex2 * (100 / cardsPerView)}%)`,
                      }}
                    >
                      {relatedPackages.map((trip) => (
                        <div key={`rel-card-${trip.id}`} className="shrink-0 basis-1/3 p-2">
                          <TripCard {...trip} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
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
              ) : reviewStats.totalReviews > 0 ? (
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
            ) : reviewStats.displayReviews.length === 0 ? (
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

            {!reviewsLoading && (
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

            {!reviewsLoading && (
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

            {/* City Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {['All', 'Jaipur', 'Udaipur', 'Jodhpur', 'Jaisalmer', 'Jawai'].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setGalleryCityFilter(city)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    galleryCityFilter === city
                      ? 'bg-primary text-white shadow-md shadow-primary/25 scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-100 hover:text-primary border border-gray-200 shadow-xs'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>

            {galleryLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading gallery images...</p>
              </div>
            ) : galleryError ? (
              <div className="text-center py-12">
                <p className="text-red-600">{galleryError}</p>
              </div>
            ) : displayedGalleryImages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No gallery images available for this selection.</p>
              </div>
            ) : (
              <GalleryCarousel key={galleryCityFilter} images={displayedGalleryImages} />
            )}
          </div>
        </section>
      </main>

      <Footer />

      <RequestCallbackDialog
        open={callbackOpen}
        onOpenChange={setCallbackOpen}
        title={categoryName}
        price={lowestPrice || 19000}
      />
    </div>
  )
}
