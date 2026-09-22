'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { TripCard } from '@/components/trip-card'
import { Button } from '@/components/ui/button'
import { TripHeroCarousel } from '@/components/trip-hero-carousel'
import { RequestCallbackDialog } from '@/components/request-callback-dialog'
import { ChristmasSnowfall } from '@/components/christmas-snowfall'
import { trips, getLowestPriceForTrips, type TripMediaItem } from '@/lib/data'
import { getAllCategories } from '@/lib/trip-categories'
import { sectionMappings } from '@/lib/section-mappings'
import { getChristmasNewYearTrips } from '@/lib/christmas-filter'
import { gtag } from '@/lib/gtag'
import { useRef, useEffect } from 'react'
import {
  Sparkles,
  Phone,
  MessageCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Gift,
  Flame,
  ShieldCheck,
  Users,
  Compass,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from 'lucide-react'

interface CategorySliderCardProps {
  id: string
  name: string
  image: string
  price: number
  tripCount: number
}

function CategorySliderCard({ id, name, image, price, tripCount }: CategorySliderCardProps) {
  return (
    <Link href={`/christmas-new-year/${id}`} className="block w-full">
      <div className="group relative overflow-hidden rounded-2xl h-[44vh] sm:h-[48vh] md:h-[54vh] cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 w-full hover:-translate-y-1.5 border border-slate-800/80 bg-slate-900">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300" />
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-white/90 backdrop-blur-xs text-[#ff5d09] text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
            {tripCount} {tripCount === 1 ? 'Tour' : 'Tours'}
          </span>
        </div>
        <div className="absolute inset-0 flex flex-col justify-end p-5 text-white z-10">
          <div className="transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-xl md:text-2xl font-black tracking-tight mb-1 group-hover:text-orange-400 transition-colors duration-300 flex items-center gap-1.5">
              {name}
              <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-8px] group-hover:translate-x-0 inline-block font-normal text-sm md:text-lg">
                →
              </span>
            </h3>
            <p className="text-xs md:text-sm text-slate-200/90 font-medium">
              Starting from <span className="font-extrabold text-white text-sm md:text-base">₹{price.toLocaleString('en-IN')}</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

function HolidayDestinationSlider({
  title,
  subtitle,
  destinations,
}: {
  title: string
  subtitle?: string
  destinations: CategorySliderCardProps[]
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10)
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const card = scrollRef.current.querySelector('.slider-card') as HTMLElement
    const cardWidth = card ? card.clientWidth : 300
    const scrollAmount = (cardWidth + 24) * (window.innerWidth < 768 ? 1 : 2)
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    checkScroll()
    const ref = scrollRef.current
    if (ref) {
      ref.addEventListener('scroll', checkScroll)
      return () => ref.removeEventListener('scroll', checkScroll)
    }
  }, [destinations])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700/80 text-white flex items-center justify-center hover:bg-slate-800 hover:border-amber-400 hover:text-amber-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md cursor-pointer"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700/80 text-white flex items-center justify-center hover:bg-slate-800 hover:border-amber-400 hover:text-amber-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md cursor-pointer"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 scrollbar-hide snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {destinations.map((item) => (
          <div
            key={item.id}
            className="slider-card w-[78vw] sm:w-[320px] md:w-[290px] lg:w-[280px] shrink-0 snap-start"
          >
            <CategorySliderCard {...item} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ChristmasNewYearCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const [callbackOpen, setCallbackOpen] = useState(false)
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null)

  const rawCategory = (params?.category as string) || ''
  const categoryId = rawCategory.toLowerCase()

  const allCategories = getAllCategories()
  const currentCategory = useMemo(() => {
    return (
      allCategories.find(
        (c) => c.id.toLowerCase() === categoryId || c.name.toLowerCase() === categoryId
      ) || {
        id: categoryId,
        name: categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace(/-/g, ' '),
        image: `/images/${categoryId}.jpg`,
      }
    )
  }, [allCategories, categoryId])

  // Get all trips for this specific category
  const allCategoryTrips = useMemo(() => {
    return trips.filter(
      (t) =>
        t.category.trim().toLowerCase() === currentCategory.name.toLowerCase() ||
        t.category.trim().toLowerCase() === currentCategory.id ||
        t.slug.toLowerCase().includes(categoryId)
    )
  }, [currentCategory, categoryId])

  // Filter only Christmas & New Year itineraries (18-31 Dec under the hood)
  const matchingHolidayTrips = useMemo(() => {
    return getChristmasNewYearTrips(allCategoryTrips)
  }, [allCategoryTrips])

  // Other holiday destinations to explore
  const otherHolidayCategories = useMemo(() => {
    const allowed = ['kashmir', 'spiti', 'himachal', 'vietnam', 'bali', 'bhutan', 'leh-ladakh', 'thailand']
    return allowed
      .filter((id) => id !== currentCategory.id)
      .slice(0, 4)
      .map((id) => allCategories.find((c) => c.id === id))
      .filter((c): c is typeof allCategories[number] => Boolean(c))
      .map((cat) => {
        const catTrips = trips.filter(
          (t) =>
            t.category.trim().toLowerCase() === cat.name.toLowerCase() ||
            t.category.trim().toLowerCase() === cat.id
        )
        const price = getLowestPriceForTrips(catTrips)
        const mappingCount = sectionMappings[cat.id]?.available?.length || 0
        return {
          id: cat.id,
          name: cat.name,
          image: cat.image,
          price: price > 0 ? price : 15000,
          tripCount: mappingCount > 0 ? mappingCount : 1,
        }
      })
  }, [allCategories, currentCategory.id])

  // Hero media for this destination
  const heroMedia: TripMediaItem[] = useMemo(() => {
    const images = allCategoryTrips.map((t) => t.image).filter(Boolean)
    if (images.length > 0) {
      return images.slice(0, 4).map((src) => ({
        type: 'image',
        src,
        alt: `${currentCategory.name} Holiday Scene`,
      }))
    }
    return [
      { type: 'image', src: currentCategory.image, alt: currentCategory.name },
      { type: 'image', src: '/images/dummy1.jpg', alt: `${currentCategory.name} Landscape` },
    ]
  }, [allCategoryTrips, currentCategory])

  const handleWhatsAppChat = () => {
    gtag.outboundLink('https://wa.me/919217664099')
    const message = `Hi Wanderphilia! I'm planning for a Christmas & New Year Trip to ${currentCategory.name}. Can you share available packages and details?`
    const encoded = encodeURIComponent(message)
    window.open(`https://wa.me/919217664099?text=${encoded}`, '_blank')
  }

  const destinationFaqs = [
    {
      q: `What is special about visiting ${currentCategory.name} during Christmas & New Year?`,
      a: `${currentCategory.name} offers magical holiday landscapes, festive local celebrations, bonfires, and special gala dinners crafted by our team for the holiday season.`,
    },
    {
      q: `How do I book a customized holiday package for ${currentCategory.name}?`,
      a: `Simply click on "Request a Callback" or message us directly on WhatsApp. Our holiday travel experts will design a custom itinerary with confirmed stays and transfers.`,
    },
    {
      q: `Are flights and transfers included for ${currentCategory.name} holiday trips?`,
      a: `All our packages include seamless on-ground transportation, premium stays, sightseeing tours, and dedicated trip captains. Flight assistance is also provided upon request.`,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-primary selection:text-white">
      <ChristmasSnowfall density={40} />

      <Navbar forceWhiteDesktop={false} />

      <main className="grow">
        {/* ================= HERO SECTION ================= */}
        <div className="relative h-[55vh] sm:h-[60vh] md:h-[72vh] min-h-[460px] overflow-hidden">
          <TripHeroCarousel media={heroMedia} />

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/60 to-slate-950/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />

          {/* Accent Blurs */}
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="absolute inset-x-0 bottom-0 flex items-end">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-10 lg:pb-12">
              <div className="text-white max-w-2xl">
                {/* Back Link */}
                <Link
                  href="/christmas-new-year"
                  className="mb-3 inline-flex items-center gap-1.5 text-xs sm:text-sm text-amber-300 hover:text-amber-200 transition-colors font-semibold"
                >
                  <ArrowLeft size={16} /> All Holiday Destinations
                </Link>

                {/* Festive Badge */}
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500/20 via-primary/25 to-red-500/20 px-3.5 py-1 text-xs sm:text-sm font-bold text-amber-300 ring-1 ring-amber-400/40 backdrop-blur-md">
                  <Sparkles size={14} className="text-amber-300" />
                  <span>Christmas & New Year Special</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  {currentCategory.name} Holiday Getaways
                </h1>

                {/* Subtitle */}
                <p className="mt-3 text-xs sm:text-base text-slate-200/90 leading-relaxed max-w-xl">
                  Celebrate the holidays in {currentCategory.name} with curated group departures, festive bonfires, and unforgettable memories.
                </p>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Button
                    size="lg"
                    className="min-w-44 bg-gradient-to-r from-[#ff6e0b] to-[#ff5d09] text-white hover:brightness-110 font-bold shadow-lg shadow-orange-950/40 rounded-xl cursor-pointer border border-amber-400/30 transition-all hover:scale-105"
                    onClick={() => setCallbackOpen(true)}
                  >
                    <Phone size={18} className="mr-2" /> Request Callback
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="min-w-44 border-white/40 text-white hover:text-white hover:border-white hover:bg-white/10 bg-slate-900/70 backdrop-blur-md rounded-xl cursor-pointer transition-all hover:scale-105"
                    onClick={handleWhatsAppChat}
                  >
                    <MessageCircle size={18} className="mr-2 text-emerald-400" /> Chat With Us
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= ITINERARIES SECTION ================= */}
        <section className="py-14 sm:py-20 bg-slate-950 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block px-4 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary font-semibold text-xs tracking-wider uppercase mb-3">
                ✨ {currentCategory.name} Special Departures
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                Holiday Itineraries for {currentCategory.name}
              </h2>
              <p className="mt-3 text-xs sm:text-base text-slate-400">
                Curated Christmas & New Year tours for {currentCategory.name}.
              </p>
            </div>

            {/* If matching itineraries exist for this destination */}
            {matchingHolidayTrips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {matchingHolidayTrips.map((trip) => (
                  <TripCard key={trip.id} {...trip} linkPrefix="/christmas-new-year/trips" darkTheme />
                ))}
              </div>
            ) : (
              /* If no matching dates yet for this destination */
              <div className="space-y-14">
                {/* Destination Inquiry Card */}
                <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6 sm:p-10 shadow-2xl">
                  <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="relative z-10 max-w-2xl mx-auto text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center mb-5 shadow-inner">
                      <Sparkles size={30} className="animate-bounce" />
                    </div>

                    <h3 className="text-xl sm:text-3xl font-black text-white">
                      Holiday Batches for {currentCategory.name} Finalizing!
                    </h3>

                    <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Exclusive Christmas & New Year departures for {currentCategory.name} are filling fast. Request a callback now or connect on WhatsApp to get custom holiday dates and early bird discounts for your group.
                    </p>

                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      <Button
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-xl cursor-pointer shadow-lg shadow-orange-950/50 transition-all hover:scale-105 text-sm"
                        onClick={() => setCallbackOpen(true)}
                      >
                        <Phone size={16} className="mr-2" /> Request Callback for {currentCategory.name}
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/10 bg-slate-900 px-6 py-3 rounded-xl cursor-pointer transition-all hover:scale-105 text-sm"
                        onClick={handleWhatsAppChat}
                      >
                        <MessageCircle size={16} className="mr-2 text-emerald-400" /> WhatsApp Holiday Desk
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Other Holiday Destinations (Horizontal Slider) */}
                {otherHolidayCategories.length > 0 && (
                  <div className="pt-6">
                    <HolidayDestinationSlider
                      title="Explore Other Holiday Destinations"
                      subtitle="More top holiday getaways for Christmas & New Year celebrations"
                      destinations={otherHolidayCategories}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ================= DESTINATION FAQS ================= */}
        <section className="py-14 sm:py-18 bg-slate-900/60 border-t border-slate-800/80">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <HelpCircle size={15} /> Got Questions?
              </div>
              <h3 className="text-xl sm:text-3xl font-bold text-white">
                Frequently Asked Questions about {currentCategory.name}
              </h3>
            </div>

            <div className="space-y-3">
              {destinationFaqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800/80 bg-slate-900/80 overflow-hidden transition-colors"
                >
                  <button
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between font-semibold text-sm sm:text-base text-white hover:text-amber-400 transition-colors cursor-pointer"
                    onClick={() => setSelectedFaq(selectedFaq === idx ? null : idx)}
                  >
                    <span>{faq.q}</span>
                    <ChevronRight
                      size={18}
                      className={`text-slate-400 transition-transform duration-300 shrink-0 ml-2 ${
                        selectedFaq === idx ? 'rotate-90 text-amber-400' : ''
                      }`}
                    />
                  </button>
                  {selectedFaq === idx && (
                    <div className="px-4 sm:px-5 pb-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <RequestCallbackDialog
        open={callbackOpen}
        onOpenChange={setCallbackOpen}
        title={`${currentCategory.name} - Christmas & New Year`}
        price={0}
      />
    </div>
  )
}
