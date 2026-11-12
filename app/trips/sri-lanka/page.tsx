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
import { useDestinationTrips } from '@/lib/use-dynamic-trips'
import { DurationFilter } from '@/components/duration-filter'
import { NoPackagesCallbackForm } from '@/components/no-packages-callback-form'
import { ChevronLeft, ChevronRight, Star, Phone, MessageCircle, HelpCircle } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

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

export default function SriLankaPage() {
  const categoryId = 'sri-lanka'
  const categoryName = 'Sri Lanka'
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

  // Central mapping system for trip sections
  const { getTripsBySection, dynamicTrips } = useDestinationTrips(categoryId)

  // Get all trips for this category (available packages)
  const categoryTrips = useMemo(() => {
    return getTripsBySection('available')
  }, [getTripsBySection, dynamicTrips])

  // Get first trip for category description/type
  const firstTrip = categoryTrips[0]
  const isCategoryInternational = true

  const lowestPrice = useMemo(() => {
    return getLowestPriceForTrips(categoryTrips) || 34999
  }, [categoryTrips])

  // Get related packages (other international destinations)
  const relatedPackages = useMemo(() => {
    return getTripsBySection('related')
  }, [getTripsBySection, dynamicTrips])

  // Create carousel hero media
  const heroMediaList = useMemo(() => {
    const sriLankaImages = [
      '/images/srilanka/hero.jpg',
      '/images/srilanka/sigiriya-rock.jpg',
      '/images/srilanka/nine-arches-bridge.jpg',
      '/images/srilanka/mirissa-beach.jpg',
      '/images/srilanka/nuwara-eliya.jpg',
      '/images/srilanka/bentota-beach.jpg'
    ]
    return sriLankaImages.map(src => ({
      type: 'image' as const,
      src,
      alt: 'Sri Lanka Tour Packages'
    }))
  }, [])

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
        const filtered = data.filter((img: any) => img.category === categoryId)
        if (filtered.length > 0) {
          setGalleryImages(filtered)
        } else {
          setGalleryImages([
            { _id: '1', image: '/images/srilanka/sigiriya-rock.jpg', category: 'sri-lanka', alt: 'Sigiriya Rock Fortress', createdAt: '' },
            { _id: '2', image: '/images/srilanka/nine-arches-bridge.jpg', category: 'sri-lanka', alt: 'Nine Arches Bridge Ella', createdAt: '' },
            { _id: '3', image: '/images/srilanka/nuwara-eliya.jpg', category: 'sri-lanka', alt: 'Nuwara Eliya Tea Gardens', createdAt: '' },
            { _id: '4', image: '/images/srilanka/mirissa-beach.jpg', category: 'sri-lanka', alt: 'Mirissa Coastline', createdAt: '' },
            { _id: '5', image: '/images/srilanka/colombo.jpg', category: 'sri-lanka', alt: 'Colombo Cityscape', createdAt: '' },
            { _id: '6', image: '/images/srilanka/bentota-beach.jpg', category: 'sri-lanka', alt: 'Bentota Golden Sands', createdAt: '' }
          ])
        }
      } catch (error) {
        setGalleryImages([
          { _id: '1', image: '/images/srilanka/sigiriya-rock.jpg', category: 'sri-lanka', alt: 'Sigiriya Rock Fortress', createdAt: '' },
          { _id: '2', image: '/images/srilanka/nine-arches-bridge.jpg', category: 'sri-lanka', alt: 'Nine Arches Bridge Ella', createdAt: '' },
          { _id: '3', image: '/images/srilanka/nuwara-eliya.jpg', category: 'sri-lanka', alt: 'Nuwara Eliya Tea Gardens', createdAt: '' },
          { _id: '4', image: '/images/srilanka/mirissa-beach.jpg', category: 'sri-lanka', alt: 'Mirissa Coastline', createdAt: '' },
          { _id: '5', image: '/images/srilanka/colombo.jpg', category: 'sri-lanka', alt: 'Colombo Cityscape', createdAt: '' }
        ])
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
    if (reviews.length === 0) {
      return { avgRating: '4.9', totalReviews: 479, displayReviews: [] }
    }
    const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    const totalReviews = reviews.length
    const displayReviews = reviews.slice(0, 6)
    return { avgRating, totalReviews, displayReviews }
  }, [reviews])

  const faqs = [
    {
      q: 'What is the best time of year to visit Sri Lanka?',
      a: 'Sri Lanka enjoys tropical sunshine year-round. The west and south coasts (Bentota, Galle, Mirissa) and the scenic hill country (Nuwara Eliya, Ella) are best visited between November and April. For the east coast (Trincomalee, Arugam Bay), May to September offers sunny and calm seas.'
    },
    {
      q: 'Do Indian passport holders need a visa to travel to Sri Lanka?',
      a: 'Yes, Indian tourists can easily apply for an Electronic Travel Authorization (ETA) online in minutes prior to departure or obtain an on-arrival visa at Colombo International Airport.'
    },
    {
      q: 'What are the top must-visit highlights in Sri Lanka?',
      a: 'Top highlights include the ancient Sigiriya Lion Rock Fortress, the scenic blue train journey from Nuwara Eliya to Ella, walking across the Nine Arches Bridge, wildlife safaris in Yala National Park, cultural Kandy Temple of the Tooth, and unwinding at Mirissa and Bentota beaches.'
    },
    {
      q: 'Is Sri Lanka safe and suitable for family tours and honeymoons?',
      a: 'Yes! Sri Lanka is exceptionally welcoming, hospitable, and safe for travelers. It offers luxurious beachside resorts, scenic hill resorts, private chauffeur guides, and wholesome activities suitable for families, couples, and groups alike.'
    },
    {
      q: 'What currency is used in Sri Lanka and can I use cards?',
      a: 'The official currency is the Sri Lankan Rupee (LKR). Major credit/debit cards (Visa, Mastercard) are widely accepted across hotels, malls, and restaurants in major cities, and ATMs are easily accessible.'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section with Carousel */}
        <div className="relative h-[50vh] sm:h-[50vh] md:h-[70vh] min-h-75 pt-20">
          <TripHeroCarousel media={heroMediaList} />

          <div className="absolute inset-0 bg-linear-to-r from-slate-950/90 via-slate-950/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-5 md:px-6 pb-6 sm:pb-8 lg:pb-10">
              <div className="text-white">
                <div className="max-w-3xl">
                  <div className="mb-4 inline-flex items-center rounded-full bg-amber-400/15 px-3 py-1 text-sm font-semibold text-amber-200 ring-1 ring-amber-300/20">
                    Starting Price
                    <span className="ml-2 text-white">₹{(lowestPrice || 34999).toLocaleString('en-IN')} / person</span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                    Sri Lanka Tour Packages 2026
                  </h1>

                  <p className={`mt-3 md:mt-0 text-sm sm:text-base md:text-lg max-w-2xl text-white leading-normal ${!isDescExpanded ? 'line-clamp-3 md:line-clamp-none' : ''}`}>
                    All-inclusive curated Sri Lanka Group & Customised Tour Packages 2026 for Friends, Families, Kids & Couples. Explore Sigiriya Lion Rock, misty tea hills of Nuwara Eliya, the iconic Nine Arches Bridge in Ella, wildlife in Yala, and the golden shores of Bentota & Mirissa.
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
                      className="min-w-30 bg-amber-400 text-white hover:bg-amber-300 cursor-pointer shadow-lg"
                      onClick={() => setCallbackOpen(true)}
                    >
                      <Phone size={18} className="mr-1" /> Request a Callback
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="min-w-32 border-white/60 text-slate-800 hover:text-white hover:border-white hover:bg-white/10 bg-white cursor-pointer shadow-lg"
                      onClick={() => {
                        const message = `Hi Wanderphilia, I want to inquire about Sri Lanka Tour Packages from Website`
                        const encodedMessage = encodeURIComponent(message)
                        window.open(
                          `https://wa.me/919217664099?text=${encodedMessage}`,
                          '_blank'
                        )
                      }}
                    >
                      <MessageCircle size={18} className="mr-1" /> Chat With Us
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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

              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Trusted by thousands of travelers. Here is what they have to say about their Wanderphilia journeys.
              </p>
            </div>

            {reviewsLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading reviews...</p>
              </div>
            ) : reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviewStats.displayReviews.map((review) => (
                  <ReviewCard key={review._id} {...review} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Reviews updating shortly.</p>
              </div>
            )}

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 border-t border-gray-200">
              {[
                { name: 'Google', rating: '4.9', reviews: 260, color: 'text-blue-600' },
                { name: 'Facebook', rating: '4.8', reviews: 180, color: 'text-blue-700' },
                { name: 'Justdial', rating: '4.9', reviews: 95, color: 'text-orange-600' },
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

        {/* Frequently Asked Questions */}
        <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs mb-3">
                <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Planning Your Sri Lanka Vacation
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mt-2">
                Everything you need to know about traveling to the Pearl of the Indian Ocean.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white rounded-2xl border border-slate-200 px-6 py-2 shadow-xs"
                >
                  <AccordionTrigger className="text-left font-bold text-slate-900 hover:text-emerald-700 hover:no-underline text-base py-4">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 text-sm leading-relaxed pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
                📸 Visual Stories
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Sri Lanka Visual Gallery
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Breathtaking glimpses of Sigiriya Lion Rock, misty tea hills, Nine Arches Bridge, and tranquil beaches.
              </p>
            </div>

            {galleryLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading gallery images...</p>
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
        price={lowestPrice || 34999}
      />
    </div>
  )
}

