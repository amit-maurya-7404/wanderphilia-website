'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { TripCard } from '@/components/trip-card'
import { trips } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getCategoriesByType } from '@/lib/trip-categories'

export default function TripsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedType, setSelectedType] = useState<string>('All')
  const [showAllCards, setShowAllCards] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [cardsPerView, setCardsPerView] = useState(4)

  const tripImages = [
    '/images/everest.jpg',
    '/images/leh-ladakh.jpg',
    '/images/swiss.jpg',
    '/images/bali.jpg',
    '/images/iceland.jpg',
    '/images/kashmir.jpg',
  ]

  // Extract unique categories from trips
  const categories = useMemo(() => {
    const categoryImageMap: Record<string, string> = {
      Bhutan: '/images/Bhutan_cat.jpg',
      Nepal: '/images/nepal-dest.jpg',
      Indonesia: '/images/indonesia-dest.jpg',
      Switzerland: '/images/switzerland-dest.jpg',
      Peru: '/images/peru-dest.jpg',
      Japan: '/images/japan.jpg',
      'Leh Ladakh': '/images/leh-ladakh.jpg',
      Spiti: '/images/spiti-valley.jpg',
      Kashmir: '/images/kashmir.jpg',
      Meghalaya: '/images/meghalaya.jpg',
      Himachal: '/images/himachal.jpg'
    }

    const cats = Array.from(new Set(trips.map(t => t.category))).sort()
    return [
      { id: 'all', name: 'All', image: '/images/dummy1.jpg' },
      ...cats.map((cat) => ({
        id: cat.toLowerCase().replace(/\s+/g, '-'),
        name: cat,
        image: categoryImageMap[cat] || `/images/${cat.toLowerCase().replace(/\s+/g, '-')}.jpg`
      }))
    ]
  }, [])

  // Get categories by trip type for display - show all categories
  const displayCategories = useMemo(() => {
    return categories
  }, [categories])

  // Read category and type from URL params on mount
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    const typeParam = searchParams.get('type')
    const regionParam = searchParams.get('region')
    const destinationParam = searchParams.get('destination')

    if (typeParam) {
      setSelectedType(typeParam)
    }

    if (categoryParam) {
      // Map mobile hero section IDs to proper category names
      const categoryMapping: { [key: string]: string } = {
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

      const mappedCategory = categoryMapping[categoryParam] || categoryParam
      setSelectedCategory(mappedCategory)
    } else if (regionParam) {
      // Handle legacy region params
      const categoryMapping: { [key: string]: string } = {
        'Leh Ladakh': 'Leh Ladakh',
        'Spiti': 'Spiti',
        'Himachal': 'Himachal',
        'Kashmir': 'Kashmir',
        'Meghalaya': 'Meghalaya',
        'Nepal': 'Nepal',
        'Indonesia': 'Indonesia',
        'Switzerland': 'Switzerland',
        'Peru': 'Peru',
        'Iceland': 'Iceland',
        'Japan': 'Japan',
        'Bhutan': 'Bhutan'
      }
      setSelectedCategory(categoryMapping[regionParam] || regionParam)
    } else if (destinationParam) {
      // Handle legacy destination params
      const categoryMapping: { [key: string]: string } = {
        'Leh Ladakh': 'Leh Ladakh',
        'Spiti': 'Spiti',
        'Himachal': 'Himachal',
        'Kashmir': 'Kashmir',
        'Meghalaya': 'Meghalaya',
        'Nepal': 'Nepal',
        'Indonesia': 'Indonesia',
        'Switzerland': 'Switzerland',
        'Peru': 'Peru',
        'Iceland': 'Iceland',
        'Japan': 'Japan',
        'Bhutan': 'Bhutan'
      }
      setSelectedCategory(categoryMapping[destinationParam] || destinationParam)
    }
  }, [searchParams])

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % tripImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [tripImages.length])

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

  // reset index when layout changes
  useEffect(() => {
    setCarouselIndex(0)
  }, [cardsPerView])

  // Filter trips by category and type
  const filteredTrips = useMemo(() => {
    let filtered = trips

    // Filter by type (India/International)
    if (selectedType !== 'All') {
      filtered = filtered.filter(trip => trip.tripType === selectedType)
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(trip => trip.category === selectedCategory)
    }

    return filtered
  }, [selectedCategory, selectedType])

  // Display logic: show 2 cards initially, all if showAllCards is true
  const displayedTrips = useMemo(() => {
    return showAllCards ? filteredTrips : filteredTrips.slice(0, 12)
  }, [filteredTrips, showAllCards])

  const handleCategoryScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('category-scroll')
    if (container) {
      const scrollAmount = 200
      if (direction === 'left') {
        container.scrollLeft -= scrollAmount
        setScrollPosition(Math.max(0, scrollPosition - scrollAmount))
      } else {
        container.scrollLeft += scrollAmount
        setScrollPosition(scrollPosition + scrollAmount)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section with Carousel */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          {/* Background Image Carousel */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            {tripImages.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt="Trip Background"
                fill
                className={`object-cover transition-opacity duration-1000 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
                priority={index === 0}
              />
            ))}
            
            {/* Dark Gradient Overlay with Radial Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/60" />
            <div className="absolute inset-0 bg-radial-gradient opacity-40" style={{
              background: 'radial-gradient(circle at 30% 50%, rgba(66, 184, 221, 0.1) 0%, transparent 50%)'
            }} />

            {/* Image Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-auto z-50">
              {tripImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentImageIndex
                      ? 'bg-primary w-8 h-2'
                      : 'bg-white/50 hover:bg-white/70 w-2 h-2'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <div className="mb-6">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-1 bg-primary rounded-full" />
                <span className="text-primary font-semibold text-sm tracking-widest uppercase">
                  Curated Expeditions
                </span>
                <div className="w-12 h-1 bg-primary rounded-full" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Explore Our <span className="text-primary">Amazing Trips</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
              Discover {filteredTrips.length} incredible destinations across the world
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Category Selection */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl text-center  font-bold text-primary mb-8">Select Category</h2>
            
            <div className="relative flex items-center gap-4">
              {/* Left Scroll Button */}
              <button
                onClick={() => handleCategoryScroll('left')}
                className="absolute -left-4 bottom-12 md:left-0 z-10 bg-white border border-gray-200 rounded-lg p-2 hover:bg-gray-50 transition-colors shadow-lg"
                aria-label="Scroll categories left"
              >
                <ChevronLeft size={20} className="text-gray-700" />
              </button>

              {/* Categories Container */}
              <div
                id="category-scroll"
                className="flex gap-6 overflow-x-auto pb-4 pl-6 md:pl-0 pr-6 md:pr-0 scroll-smooth"
                style={{ scrollBehavior: 'smooth' }}
              >
                {displayCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex flex-col items-center min-w-[70px] cursor-pointer group"
                    onClick={() => {
                      if (category.name === 'All') {
                        setSelectedCategory(category.name)
                        setShowAllCards(false)
                      } else {
                        router.push(`/category/${category.id}`)
                      }
                    }}
                  >
                    <div className={`relative h-16 w-16 rounded-full overflow-hidden border-2 shadow-lg group-hover:scale-105 transition-all duration-300 flex items-center justify-center ${
                      selectedCategory === category.name
                        ? 'border-primary/60 shadow-primary/20'
                        : 'border-primary/40 hover:border-primary/60'
                    }`}>
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                      {category.name === 'All' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                          <span className="text-white font-semibold text-sm">🌍</span>
                        </div>
                      )}
                    </div>
                    <p className={`text-xs mt-2 font-medium transition-colors ${
                      selectedCategory === category.name ? 'text-primary' : 'text-gray-700'
                    }`}>
                      {category.name}
                    </p>
                  </div>
                ))}
              </div>

              {/* Right Scroll Button */}
              <button
                onClick={() => handleCategoryScroll('right')}
                className="absolute -right-4 bottom-12 md:right-0 z-10 bg-white border border-gray-200 rounded-lg p-2 hover:bg-gray-50 transition-colors shadow-lg"
                aria-label="Scroll categories right"
              >
                <ChevronRight size={20} className="text-gray-700" />
              </button>
            </div>
          </div>

          {/* Trips Carousel */}
          {filteredTrips.length > 0 ? (
            <div>
              {/* ✅ MOBILE SCROLLER */}
              {isMobile ? (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide mb-8">
                  {displayedTrips.map((trip) => (
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
                  <div className="relative mb-8">

                    {/* LEFT */}
                    <button
                      onClick={() => {
                        setCarouselIndex((prev) => Math.max(prev - 1, 0))
                      }}
                      disabled={carouselIndex === 0}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    {/* RIGHT */}
                    <button
                      onClick={() => {
                        const maxIndex = Math.max(0, displayedTrips.length - cardsPerView)
                        setCarouselIndex((prev) => Math.min(prev + 1, maxIndex))
                      }}
                      disabled={carouselIndex === Math.max(0, displayedTrips.length - cardsPerView)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40"
                    >
                      <ChevronRight size={20} />
                    </button>

                    {/* TRACK */}
                    <div className="overflow-hidden">
                      <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{
                          transform: `translateX(-${carouselIndex * (100 / cardsPerView)}%)`,
                        }}
                      >
                        {displayedTrips.map((trip) => (
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

              {/* View All Button */}
              {filteredTrips.length > 12 && !showAllCards && (
                <div className="flex justify-center">
                  <Button
                    onClick={() => {
                      setShowAllCards(true)
                      setCarouselIndex(0)
                    }}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    View All ({filteredTrips.length} trips)
                  </Button>
                </div>
              )}

              {/* Show Less Button */}
              {showAllCards && filteredTrips.length > 12 && (
                <div className="flex justify-center">
                  <Button
                    onClick={() => {
                      setShowAllCards(false)
                      setCarouselIndex(0)
                    }}
                    variant="outline"
                    className="border-2 border-primary text-primary hover:bg-primary/10 px-8 py-3 rounded-lg font-semibold transition-all duration-300"
                  >
                    Show Less
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No trips in this category
              </h3>
              <p className="text-gray-600">
                Check back soon for more adventures!
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
