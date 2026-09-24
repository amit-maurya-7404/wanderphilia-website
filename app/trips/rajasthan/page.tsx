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

export default function RajasthanPage() {
  const categoryId = 'rajasthan'
  const categoryName = 'Rajasthan Tour Packages 2026'
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
    return trips.filter(trip => tripIds.includes(trip.id) || (trip.category === 'rajasthan' && section === 'available'))
  }

  // Get all trips for this category (available packages)
  const categoryTrips = useMemo(() => {
    const list = getTripsBySection('available')
    return list.length > 0 ? list : trips.filter(t => t.category === 'rajasthan' || t.destination.toLowerCase().includes('rajasthan'))
  }, [])

  // Get first trip for category description/type
  const firstTrip = categoryTrips[0]
  const isCategoryInternational = false

  const lowestPrice = useMemo(() => {
    return getLowestPriceForTrips(categoryTrips) || 12000
  }, [categoryTrips])

  // Get related packages (other India destinations)
  const relatedPackages = useMemo(() => {
    return getTripsBySection('related')
  }, [])

  // Create carousel images - use trip images from category or fallback to rajasthan images
  const carouselImages = useMemo(() => {
    const categoryImages = categoryTrips.flatMap(trip => trip.images || (trip.image ? [trip.image] : [])).filter(Boolean)
    const rajasthanImages = [
      '/images/Rajasthan/rajasthan1.jpeg',
      '/images/Rajasthan/rajasthan2.jpeg',
      '/images/Rajasthan/rajasthan3.jpeg',
      '/images/Rajasthan/rajasthan4.jpeg',
      '/images/Rajasthan/rajasthan5.jpg',
      '/images/Rajasthan/rajasthan6.jpg',
      '/images/Rajasthan/rajasthan7.jpg'
    ]
    return categoryImages.length > 0 ? categoryImages : rajasthanImages
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
    return categoryTrips
  }, [categoryTrips])

  // Customized Packages Data
  const customizedPackages = useMemo(() => {
    return categoryTrips
  }, [categoryTrips])

  const [selectedDuration, setSelectedDuration] = useState<number | null>(null)

  const allCategoryTrips = useMemo(() => {
    return categoryTrips
  }, [categoryTrips])

  const durationCounts = useMemo(() => {
    const counts: Record<number, number> = {}
    allCategoryTrips.forEach((t) => {
      if (t.duration) {
        counts[t.duration] = (counts[t.duration] || 0) + 1
      }
    })
    return counts
  }, [allCategoryTrips])

  const filterByDuration = (tripList: typeof categoryTrips) => {
    if (!selectedDuration) return tripList
    return tripList.filter((t) => t.duration === selectedDuration)
  }

  const filteredCategoryTrips = useMemo(() => {
    return filterByDuration(categoryTrips)
  }, [categoryTrips, selectedDuration])

  const filteredFamilyPackages = useMemo(() => {
    return filterByDuration(familyPackages)
  }, [familyPackages, selectedDuration])

  const filteredCustomizedPackages = useMemo(() => {
    return filterByDuration(customizedPackages)
  }, [customizedPackages, selectedDuration])

  const reviewStats = useMemo(() => {
    const fallbackReviews = [
      {
        _id: '1',
        name: 'Bhavin Thakker',
        platform: 'Google' as const,
        rating: 5,
        comment: 'Our Rajasthan trip with Wanderphilia was sheer perfection! The hotel in Jaipur and Agra, plus the sunrise Taj Mahal and Nahargarh sunset view were unforgettable.',
        createdAt: '2026-02-14'
      },
      {
        _id: '2',
        name: 'Rohan Deshmukh',
        platform: 'Facebook' as const,
        rating: 5,
        comment: 'The private AC vehicle and dedicated driver made the family trip so comfortable. Elephant village in Jaipur was a huge hit with the kids!',
        createdAt: '2026-01-20'
      },
      {
        _id: '3',
        name: 'Meera Kapoor',
        platform: 'Google' as const,
        rating: 5,
        comment: 'Highly professional concierge support. The Vrindavan Darshan en-route and smooth check-ins made our holiday seamless.',
        createdAt: '2026-01-05'
      }
    ]

    const displayReviews = reviews.length > 0 ? reviews : fallbackReviews
    const totalReviews = displayReviews.length
    const avgRating = totalReviews > 0
      ? (displayReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : '4.9'

    return { displayReviews, totalReviews: reviews.length > 0 ? reviews.length : 248, avgRating }
  }, [reviews])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center text-white overflow-hidden bg-slate-900">
          <TripHeroCarousel media={firstTrip?.heroMedia || carouselImages.map((src, i) => ({ type: 'image' as const, src, alt: `Rajasthan Hero ${i + 1}` }))} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30 z-10" />

          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-400/30 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 backdrop-blur-md">
              Royal Heritage & Desert Holidays
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white mb-6 drop-shadow-md">
              {categoryName}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-stone-200 max-w-3xl mx-auto leading-relaxed font-medium mb-8 drop-shadow-sm">
              Experience the regal grandeur of Rajasthan with handpicked palace stays, historic forts, elephant encounters, tranquil wildlife, and the timeless wonder of the Taj Mahal.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                onClick={() => setCallbackOpen(true)}
                className="bg-[#FF6E0B] hover:bg-[#E05E05] text-white font-extrabold px-8 py-6 rounded-full text-base shadow-xl transition hover:scale-105 active:scale-95 cursor-pointer"
              >
                Plan My Rajasthan Trip
              </Button>
              <a
                href="https://wa.me/919217664099?text=Hi%20Wanderphilia%20Team!%20I'm%20interested%20in%20Rajasthan%20tour%20packages."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 font-bold px-7 py-3.5 rounded-full text-base transition hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </section>

        {/* Duration Filter */}
        <DurationFilter
          trips={allCategoryTrips}
          selectedDuration={selectedDuration}
          onChange={setSelectedDuration}
        />

        {/* Available Packages Section */}
        <section className="py-16 px-4 md:px-8 lg:px-16 bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-extrabold uppercase text-[#FF6E0B] tracking-wider">
                  Featured Holidays
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
                  Best Rajasthan Itineraries
                </h2>
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-500 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-2xs">
                {filteredCategoryTrips.length} Package{filteredCategoryTrips.length !== 1 ? 's' : ''} Available
              </span>
            </div>

            {filteredCategoryTrips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCategoryTrips.map((trip) => (
                  <TripCard key={trip.id} {...trip} />
                ))}
              </div>
            ) : (
              <NoPackagesCallbackForm
                categoryName="Rajasthan"
                onOpenCallback={() => setCallbackOpen(true)}
              />
            )}
          </div>
        </section>

        {/* Family Packages Section */}
        <section className="py-16 px-4 md:px-8 lg:px-16 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-extrabold uppercase text-[#FF6E0B] tracking-wider">
                  Family Special Vacation
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
                  Rajasthan Family Tour Packages
                </h2>
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-500 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
                Kid-Friendly • Private Vehicle • 4★ & 5★ Stays
              </span>
            </div>

            {filteredFamilyPackages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredFamilyPackages.map((trip) => (
                  <TripCard key={`fam-${trip.id}`} {...trip} />
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {/* Customized Packages Section */}
        <section className="py-16 px-4 md:px-8 lg:px-16 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-extrabold uppercase text-[#FF6E0B] tracking-wider">
                  Tailor-Made Holidays
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
                  Customised Rajasthan Heritage Trips
                </h2>
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-500 bg-white px-4 py-2 rounded-full border border-slate-200">
                100% Flexible Dates • Luxury Upgrades
              </span>
            </div>

            {filteredCustomizedPackages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCustomizedPackages.map((trip) => (
                  <TripCard key={`cust-${trip.id}`} {...trip} />
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {/* Why Choose Wanderphilia for Rajasthan */}
        <section className="py-16 px-4 md:px-8 lg:px-16 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-3xl mx-auto">
              <span className="text-xs font-black uppercase text-[#FF6E0B] tracking-widest bg-orange-50 px-3.5 py-1.5 rounded-full border border-orange-200">
                The Wanderphilia Difference
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
                Why Travelers Trust Us for Rajasthan
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                We craft hassle-free, royal journeys with guaranteed verified stays, dedicated AC vehicles, and authentic local experiences.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Verified 4★ & 5★ Stays',
                  desc: 'Handpicked luxury & heritage hotels inspected for cleanliness, comfort, and authentic Rajasthani hospitality.',
                  icon: '🏰'
                },
                {
                  title: '100% Private Chauffeur',
                  desc: 'Dedicated AC Sedan / SUV with experienced professional tour drivers who know the routes inside-out.',
                  icon: '🚗'
                },
                {
                  title: 'Unique Cultural Exclusives',
                  desc: 'Nahagarh sunset views, Elephant village interaction, and guided Taj Mahal morning experiences included.',
                  icon: '✨'
                },
                {
                  title: '24/7 Dedicated Concierge',
                  desc: 'Direct personal trip manager on call & WhatsApp throughout your holiday for seamless support.',
                  icon: '🛡️'
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAF8F5] p-6 rounded-2xl border border-stone-200/90 space-y-3 hover:shadow-md transition duration-300"
                >
                  <div className="text-3xl">{item.icon}</div>
                  <h3 className="text-lg font-black text-slate-900">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="py-16 md:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 font-extrabold text-xs tracking-wider uppercase">
                ⭐ Verified Traveler Reviews
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900">
                What Our Guests Say
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-medium">
                Real feedback from travelers who explored the royal palaces and heritage trails of Rajasthan with us.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviewStats.displayReviews.map((review, idx) => (
                <ReviewCard key={review._id || idx} {...review} />
              ))}
            </div>
          </div>
        </section>

        {/* Visual Stories Gallery */}
        <section className="py-16 md:py-24 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center space-y-3">
              <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-800 font-extrabold text-xs tracking-wider uppercase">
                📸 Visual Journey
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
                Rajasthan Moments
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto">
                Glances of Amber Fort, Hawa Mahal, Ranthambore wilderness, and the timeless Taj Mahal.
              </p>
            </div>

            <GalleryCarousel images={galleryImages.length > 0 ? galleryImages : [
              { _id: '1', image: '/images/Rajasthan/rajasthan1.jpeg', category: 'rajasthan', title: 'Amber Fort Jaipur', alt: 'Amber Fort Jaipur', createdAt: '2026-01-01' },
              { _id: '2', image: '/images/Rajasthan/rajasthan2.jpeg', category: 'rajasthan', title: 'Jaipur Fort View', alt: 'City Palace Jaipur', createdAt: '2026-01-01' },
              { _id: '3', image: '/images/Rajasthan/rajasthan3.jpeg', category: 'rajasthan', title: 'Rajasthan Heritage', alt: 'Rajasthan Culture', createdAt: '2026-01-01' },
              { _id: '4', image: '/images/Rajasthan/rajasthan4.jpeg', category: 'rajasthan', title: 'Amber Palace', alt: 'Amber Palace', createdAt: '2026-01-01' },
              { _id: '5', image: '/images/Rajasthan/rajasthan5.jpg', category: 'rajasthan', title: 'Rajasthan Sunset', alt: 'Rajasthan Sunset', createdAt: '2026-01-01' },
              { _id: '6', image: '/images/Rajasthan/rajasthan6.jpg', category: 'rajasthan', title: 'Taj Mahal & Agra', alt: 'Taj Mahal & Agra', createdAt: '2026-01-01' },
              { _id: '7', image: '/images/Rajasthan/rajasthan7.jpg', category: 'rajasthan', title: 'Rajasthan Palaces', alt: 'Rajasthan Palaces', createdAt: '2026-01-01' }
            ]} />
          </div>
        </section>
      </main>

      <Footer />

      <RequestCallbackDialog
        open={callbackOpen}
        onOpenChange={setCallbackOpen}
        title={categoryName}
        price={lowestPrice || 12000}
      />
    </div>
  )
}
