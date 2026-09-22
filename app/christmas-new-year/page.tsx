'use client'

import { useState, useMemo } from 'react'
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
  Compass,
  CheckCircle2,
  Gift,
  Flame,
  ShieldCheck,
  Users,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  MapPin,
  Globe,
} from 'lucide-react'

const heroMedia: TripMediaItem[] = [
  { type: 'image', src: '/images/kashmir.jpg', alt: 'Snowy winter wonderland in Kashmir' },
  { type: 'image', src: '/images/dummy1.jpg', alt: 'Scenic mountain holiday celebration' },
  { type: 'image', src: '/images/vietnam.png', alt: 'Tropical festive getaway' },
  { type: 'image', src: '/images/bali.jpg', alt: 'New Year celebration in Bali' },
]

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
      <div className="group relative overflow-hidden rounded-2xl h-[46vh] sm:h-[50vh] md:h-[54vh] cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 w-full hover:-translate-y-1.5 border border-slate-800/80 bg-slate-900">
        {/* Background Image */}
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
        />

        {/* Premium Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300" />

        {/* Top Badges / Info */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-white/90 backdrop-blur-xs text-[#ff5d09] text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
            {tripCount} {tripCount === 1 ? 'Tour' : 'Tours'}
          </span>
        </div>

        {/* Bottom Content Area */}
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
  badge,
  badgeIcon,
  destinations,
}: {
  title: string
  subtitle?: string
  badge?: string
  badgeIcon?: React.ReactNode
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
      {/* Header with Title and Left/Right Arrows */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          {badge && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-xs uppercase tracking-wider mb-2.5">
              {badgeIcon}
              <span>{badge}</span>
            </div>
          )}
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 text-xs sm:text-base text-slate-400 max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>

        {/* Navigation Arrows */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700/80 text-white flex items-center justify-center hover:bg-slate-800 hover:border-amber-400 hover:text-amber-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md cursor-pointer"
            aria-label="Previous Destinations"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700/80 text-white flex items-center justify-center hover:bg-slate-800 hover:border-amber-400 hover:text-amber-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md cursor-pointer"
            aria-label="Next Destinations"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
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

const faqs = [
  {
    q: 'What makes Christmas & New Year group trips special?',
    a: 'Our holiday departures combine premium stays, curated itineraries, local celebrations, bonfires in the mountains, and like-minded travelers with experienced trip leaders.',
  },
  {
    q: 'How far in advance should I book for the holiday season?',
    a: 'Holiday flights and boutique accommodations get booked up early. We recommend securing your slot as early as possible to guarantee confirmed bookings and avoid peak season surges.',
  },
  {
    q: 'Can I request a custom private itinerary for my group or family?',
    a: 'Yes! If you are traveling with friends or family, we can craft a tailor-made private departure customized to your dates, stay preferences, and celebration plans.',
  },
  {
    q: 'What experiences are included in holiday tours?',
    a: 'Depending on the destination, packages include sightseeing, local guide support, transfers, stays, festive bonfires, gala dinners, and special celebration activities.',
  },
]

export default function ChristmasNewYearPage() {
  const [callbackOpen, setCallbackOpen] = useState(false)
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null)
  const categoryName = 'Christmas & New Year Special'

  // Dynamically filter matching itineraries under the hood
  const matchingTrips = useMemo(() => {
    return getChristmasNewYearTrips(trips)
  }, [])

  const allCategories = getAllCategories()

  // Helper to resolve category data with realistic prices & mappings
  const resolveCategory = (id: string, defaultPrice: number = 15000): CategorySliderCardProps => {
    const cat = allCategories.find((c) => c.id === id) || {
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' '),
      image: `/images/${id}.jpg`,
    }
    const categoryTrips = trips.filter(
      (t) =>
        t.category.trim().toLowerCase() === cat.name.toLowerCase() ||
        t.category.trim().toLowerCase() === cat.id
    )
    const price = getLowestPriceForTrips(categoryTrips)
    const mappingCount = sectionMappings[cat.id]?.available?.length || 0
    return {
      id: cat.id,
      name: cat.name,
      image: cat.image,
      price: price > 0 ? price : defaultPrice,
      tripCount: mappingCount > 0 ? mappingCount : categoryTrips.length || 1,
    }
  }

  // 1. New Year in India destinations
  const indiaDestinations: CategorySliderCardProps[] = useMemo(() => {
    const allowed = ['kashmir', 'spiti', 'himachal', 'leh-ladakh', 'meghalaya', 'sikkim']
    return allowed.map((id) => resolveCategory(id, 15000))
  }, [allCategories])

  // 2. International New Year Trips destinations
  const internationalDestinations: CategorySliderCardProps[] = useMemo(() => {
    const allowed = ['vietnam', 'bali', 'bhutan', 'thailand', 'singapore', 'nepal', 'indonesia', 'japan']
    return allowed.map((id) => resolveCategory(id, 25000))
  }, [allCategories])

  const handleWhatsAppChat = () => {
    gtag.outboundLink('https://wa.me/919217664099')
    const message = `Hi Wanderphilia! I'm interested in booking a Christmas & New Year Trip. Can you share available packages and details?`
    const encoded = encodeURIComponent(message)
    window.open(`https://wa.me/919217664099?text=${encoded}`, '_blank')
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-primary selection:text-white">
      {/* Gentle Ambient Snowfall */}
      <ChristmasSnowfall density={40} />

      <Navbar forceWhiteDesktop={false} />

      <main className="grow">
        {/* ================= HERO SECTION (Properly Aligned & Mobile Structured) ================= */}
        <div className="relative h-[55vh] sm:h-[60vh] md:h-[72vh] min-h-[460px] overflow-hidden">
          <TripHeroCarousel media={heroMedia} />

          {/* Dark luxury gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/60 to-slate-950/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />

          {/* Glowing Holiday Accent Blurs */}
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="absolute inset-x-0 bottom-0 flex items-end">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-10 lg:pb-12">
              <div className="text-white max-w-2xl">
                {/* Festive Badge */}
                <div className="mb-3.5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500/20 via-primary/25 to-red-500/20 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-amber-300 ring-1 ring-amber-400/40 backdrop-blur-md shadow-lg shadow-amber-950/30">
                  <Sparkles size={15} className="text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Christmas & New Year Holiday Specials</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  End the Year with an{' '}
                  <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                    Unforgettable Adventure
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="mt-3 text-xs sm:text-base text-slate-200/90 leading-relaxed max-w-xl">
                  Celebrate the magic of the holidays with curated group departures, snowy Himalayan trails, and tropical beach countdowns.
                </p>

                {/* Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Button
                    size="lg"
                    className="min-w-44 bg-gradient-to-r from-[#ff6e0b] to-[#ff5d09] text-white hover:brightness-110 font-bold shadow-lg shadow-orange-950/40 rounded-xl cursor-pointer border border-amber-400/30 transition-all hover:scale-105"
                    onClick={() => setCallbackOpen(true)}
                  >
                    <Phone size={18} className="mr-2" /> Request a Callback
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

        {/* ================= HIGHLIGHTS TICKER ================= */}
        <section className="border-y border-slate-800/80 bg-slate-900/60 py-5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
                  <Gift size={20} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Curated Holiday Tours</h4>
                  <p className="text-[11px] text-slate-400">Handpicked Routes</p>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0 text-red-400">
                  <Flame size={20} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Holiday Celebrations</h4>
                  <p className="text-[11px] text-slate-400">Bonfires & Gala Feasts</p>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Confirmed Stays</h4>
                  <p className="text-[11px] text-slate-400">Peak Season Guaranteed</p>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Dedicated Captains</h4>
                  <p className="text-[11px] text-slate-400">Seamless Support</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= ITINERARIES & DESTINATIONS SECTION ================= */}
        <section className="py-14 sm:py-20 bg-slate-950 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
            {/* If direct matching itineraries exist */}
            {matchingTrips.length > 0 && (
              <div>
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <span className="inline-block px-4 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary font-semibold text-xs tracking-wider uppercase mb-3">
                    ✨ Featured Holiday Departures
                  </span>
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white">
                    Special Holiday Itineraries
                  </h2>
                  <p className="mt-3 text-xs sm:text-base text-slate-400">
                    Handpicked tours departing for Christmas & New Year celebrations.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {matchingTrips.map((trip) => (
                    <TripCard key={trip.id} {...trip} linkPrefix="/christmas-new-year/trips" darkTheme />
                  ))}
                </div>
              </div>
            )}

            {/* Early bird inquiry banner when few itineraries exist */}
            {matchingTrips.length === 0 && (
              <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6 sm:p-10 shadow-2xl">
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-2xl mx-auto text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center mb-5 shadow-inner">
                    <Sparkles size={30} className="animate-bounce" />
                  </div>

                  <h3 className="text-xl sm:text-3xl font-black text-white">
                    Holiday Batches Finalizing!
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Special holiday departures are filling fast. Request a callback now to lock in pre-launch rates or get a custom holiday itinerary crafted for your group.
                  </p>

                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-xl cursor-pointer shadow-lg shadow-orange-950/50 transition-all hover:scale-105 text-sm"
                      onClick={() => setCallbackOpen(true)}
                    >
                      <Phone size={16} className="mr-2" /> Request Callback
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
            )}

            {/* ================= SECTION 1: NEW YEAR IN INDIA (HORIZONTAL SLIDER) ================= */}
            <div id="india-holiday-slider">
              <HolidayDestinationSlider
                title="New Year in India"
                subtitle="Celebrate the holidays with snowy peaks, festive mountain bonfires & serene valleys across India"
                badge="New Year in India"
                badgeIcon={<MapPin size={13} className="text-amber-300" />}
                destinations={indiaDestinations}
              />
            </div>

            {/* ================= SECTION 2: INTERNATIONAL NEW YEAR TRIPS (HORIZONTAL SLIDER) ================= */}
            <div id="international-holiday-slider">
              <HolidayDestinationSlider
                title="International New Year Trips"
                subtitle="Ring in the global countdown across tropical beaches, iconic skylines & cultural wonders worldwide"
                badge="International New Year"
                badgeIcon={<Globe size={13} className="text-amber-300" />}
                destinations={internationalDestinations}
              />
            </div>
          </div>
        </section>

        {/* ================= WHY TRAVEL WITH WANDERPHILIA ================= */}
        <section className="py-14 sm:py-18 bg-slate-900/60 border-t border-slate-800/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h3 className="text-xl sm:text-3xl font-bold text-white">
                The Wanderphilia Holiday Promise
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-2">
                Why thousands of travelers choose us to ring in the New Year
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-slate-800/90 bg-slate-900/90 p-6 hover:border-amber-500/40 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                  <CheckCircle2 size={22} />
                </div>
                <h4 className="text-base font-bold text-white mb-2">Zero Peak Surcharge Surprises</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Transparent upfront pricing with confirmed stays and transfers locked in advance.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800/90 bg-slate-900/90 p-6 hover:border-amber-500/40 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center mb-4">
                  <Flame size={22} />
                </div>
                <h4 className="text-base font-bold text-white mb-2">Festive Celebrations Included</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Curated celebration moments, bonfires in the hills, and unforgettable memories.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800/90 bg-slate-900/90 p-6 hover:border-amber-500/40 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-4">
                  <Compass size={22} />
                </div>
                <h4 className="text-base font-bold text-white mb-2">Dedicated Tour Captains</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Experienced trip leaders who manage logistics and ensure a safe, joyful trip.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= HOLIDAY FAQS ================= */}
        <section className="py-14 sm:py-18 bg-slate-950 border-t border-slate-800/80">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <HelpCircle size={15} /> Got Questions?
              </div>
              <h3 className="text-xl sm:text-3xl font-bold text-white">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
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

        {/* ================= FINAL CTA BANNER ================= */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-r from-amber-600 via-primary to-orange-600 p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-2xl">
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
              Ready to Welcome 2027 with Wanderphilia?
            </h3>
            <p className="mt-3 text-xs sm:text-base text-amber-100 max-w-xl mx-auto">
              Holiday spots fill up fast. Speak to our travel experts today and secure your spot on an unforgettable journey.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                size="lg"
                className="bg-slate-950 text-white hover:bg-slate-900 font-bold px-7 py-3 rounded-xl cursor-pointer shadow-xl text-sm"
                onClick={() => setCallbackOpen(true)}
              >
                <Phone size={16} className="mr-2 text-amber-400" /> Request Callback
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 bg-white/20 font-bold px-7 py-3 rounded-xl cursor-pointer text-sm"
                onClick={handleWhatsAppChat}
              >
                <MessageCircle size={16} className="mr-2" /> Chat on WhatsApp
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <RequestCallbackDialog
        open={callbackOpen}
        onOpenChange={setCallbackOpen}
        title={categoryName}
        price={0}
      />
    </div>
  )
}
