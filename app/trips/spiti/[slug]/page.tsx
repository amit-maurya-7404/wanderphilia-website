'use client'

import { TripReviewsSection } from '@/components/trip-reviews-section'
import { useState, useMemo, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { TripHeroCarousel } from '@/components/trip-hero-carousel'
import { RequestCallbackDialog } from '@/components/request-callback-dialog'
import { trips } from '@/lib/data'
import { MapPin, Calendar, Users, Star, Phone, MessageCircle, ChevronDown, Download } from 'lucide-react'
import { contactEmail, contactPhone, contactPhoneDisplay, instagramUrl } from '@/lib/contact'
import { TripGallerySection } from '@/components/trip-gallery-section'


export default function PackageDetailPage() {
  type SelectionItem = {
    name: string
    price: number
  }

  const [selections, setSelections] = useState<SelectionItem[]>([])
  const [showFullDesc, setShowFullDesc] = useState(false)

  const total = selections.reduce((sum, item) => sum + item.price, 0)
  const params = useParams()
  const slug = params?.slug as string
  const trip = useMemo(() => trips.find(t => t.slug === slug), [slug])

  // Calculate lowest price from costing table
  const lowestPrice = useMemo(() => {
    if (!trip?.costingDetails || trip.costingDetails.length === 0) {
      return trip?.price || 0
    }
    
    const prices = trip.costingDetails
      .map(item => {
        // Extract numeric value from price strings like "₹35,000"
        const match = item.value.match(/[\d,]+/)
        return match ? parseInt(match[0].replace(/,/g, ''), 10) : 0
      })
      .filter(price => price > 0)
    
    return prices.length > 0 ? Math.min(...prices) : trip.price || 0
  }, [trip])

  const [callbackOpen, setCallbackOpen] = useState(false)
  const [expandedDays, setExpandedDays] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [isClient, setIsClient] = useState(false)
  const tabContainerRef = useRef<HTMLDivElement>(null)
  const activeTabRef = useRef(activeTab)
  const router = useRouter()

  const handleBookNow = () => {
    if (!slug) return
    router.push(`/booking/package/${encodeURIComponent(slug)}`)
  }

  useEffect(() => {
    activeTabRef.current = activeTab
  }, [activeTab])

  if (!trip) return notFound()

  const scrollActiveTabIntoView = (tabId: string) => {
    if (typeof window === 'undefined' || !tabContainerRef.current) return

    const container = tabContainerRef.current
    const activeTab = container.querySelector(`[data-tab-id="${tabId}"]`) as HTMLElement

    if (activeTab) {
      const containerRect = container.getBoundingClientRect()
      const tabRect = activeTab.getBoundingClientRect()

      const isTabVisible = tabRect.left >= containerRect.left &&
        tabRect.right <= containerRect.right

      if (!isTabVisible) {
        const scrollLeft = tabRect.left - containerRect.left - (containerRect.width / 2) + (tabRect.width / 2)
        container.scrollTo({
          left: container.scrollLeft + scrollLeft,
          behavior: 'smooth'
        })
      }
    }
  }

  const difficultyColor =
    trip.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
      trip.difficulty === 'Moderate' ? 'bg-amber-100 text-amber-700' :
        'bg-rose-100 text-rose-700'

  const heroMedia = trip.heroMedia || [{ type: 'image' as const, src: trip.image, alt: trip.title }]

  const toggleDay = (dayNum: number) => {
    setExpandedDays(prev =>
      prev.includes(dayNum)
        ? prev.filter(d => d !== dayNum)
        : [...prev, dayNum]
    )
  }



  const scrollToSection = (id: string) => {
    if (typeof window === 'undefined') return
    const el = document.getElementById(id)
    if (el) {
      const navbarHeight = 80
      const tabNavbarHeight = 24
      const totalOffset = navbarHeight + tabNavbarHeight + 20

      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - totalOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
    scrollActiveTabIntoView(id)
  }

  useEffect(() => {
    setIsClient(true)
    if (typeof window === 'undefined') return

    const sections = [
      'overview',
      'itinerary',
      'inclusions',
      'exclusions',
      'costing',
      'note',
      'stays',
      'batches',
      'payment',
      'cancellation',
      'things-to-carry',
      'travel-essentials',
    ]

    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0
        let activeSection = activeTabRef.current

        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio
            activeSection = entry.target.id
          }
        })

        if (activeSection !== activeTabRef.current) {
          setActiveTab(activeSection)
          scrollActiveTabIntoView(activeSection)
        }
      },
      {
        rootMargin: '-50% 0px -50% 0px',
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      }
    )

    sections.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="grow">
        {/* HERO */}
        <div className="relative h-[50vh] sm:h-[45vh] md:h-[70vh]  overflow-hidden pt-20">
          <TripHeroCarousel media={heroMedia} />

          <div className="absolute inset-0 bg-linear-to-r from-slate-950/90 via-slate-950/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-5 md:px-6 pb-6 sm:pb-8 lg:pb-10">
              {/* <div className="rounded-4xl bg-slate-950/20 backdrop-blur-xl border border-white/10 p-5 sm:p-7 md:p-8 lg:p-10 text-white shadow-2xl shadow-slate-950/40">
                <div className="max-w-2xl">
                  <div className="mb-4 inline-flex items-center rounded-full bg-amber-400/15 px-3 py-1 text-sm font-semibold text-amber-200 ring-1 ring-amber-300/20">
                    Starting Price
<span className="ml-2 text-white">₹{lowestPrice.toLocaleString('en-IN')} / person</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                    {trip.title}
                  </h1>

                  <p className="mt-4 text-sm sm:text-base md:text-lg max-w-2xl text-slate-100 leading-7">
                    {trip.description}
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button
                      size="lg"
                      className="min-w-45 bg-amber-400 text-slate-950 hover:bg-amber-300"
                      onClick={() => setCallbackOpen(true)}
                    >
                      <Phone size={18} className="mr-2" /> Request a Callback
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="min-w-45 border-white/60 text-white hover:border-white hover:bg-white/10"
                    >
                      <MessageCircle size={18} className="mr-2" /> Chat With Us
                    </Button>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* STICKY TAB NAVBAR */}
        <div className="sticky top-20 z-40 bg-white border-b shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-5 md:px-6 flex">
            <div className="flex w-fit overflow-hidden">
              <div
                ref={tabContainerRef}
                className="flex w-fit overflow-x-auto gap-2 sm:gap-4 py-0 mr-auto"
              >
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'itinerary', label: 'Itinerary' },
                  { id: 'batches', label: 'Batches' },
                  { id: 'costing', label: 'Costing' },
                  { id: 'note', label: 'Note' },
                  { id: 'stays', label: 'Stays' },
                  { id: 'inclusions', label: 'Inclusions' },
                  { id: 'exclusions', label: 'Exclusions' },
                  { id: 'payment', label: 'Payment Policy' },
                  { id: 'cancellation', label: 'Cancellation' },
                  { id: 'things-to-carry', label: 'Things To Carry' },
                  { id: 'travel-essentials', label: 'Travel Essentials' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    data-tab-id={tab.id}
                    onClick={() => scrollToSection(tab.id)}
                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-[4vw] sm:px-[5vw] md:px-0 py-[4vh] sm:py-[5vh] md:py-[6vh]">
          <div className="grid lg:grid-cols-[2.5fr_1fr] gap-[4vw] lg:gap-[3vw]">
            {/* LEFT CONTENT */}
            <div className="space-y-[8vh]">
              {/* HEADER SECTION */}
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3">
                  {trip.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-slate-600 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} className="shrink-0" />
                    <span className="text-sm sm:text-base">{trip.destination}</span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} className="shrink-0" />
                    <span className="text-sm sm:text-base">
                      {trip.nights ? `${trip.nights}N / ${trip.duration}D` : `${trip.duration}D`}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Badge className={`${difficultyColor} text-xs sm:text-sm px-3 py-1`}>
                    {trip.difficulty}
                  </Badge>
                  <Badge className="bg-slate-100 text-slate-700 text-xs sm:text-sm px-3 py-1">
                    <Users size={14} className="mr-1" /> {trip.groupSize}
                  </Badge>
                  <Badge className="bg-amber-100 text-amber-700 text-xs sm:text-sm px-3 py-1">
                    <Star size={14} className="mr-1" /> {trip.rating}
                  </Badge>
                </div>
              </div>

              {/* OVERVIEW */}
              <section id="overview">
                <h2 className="text-2xl font-bold mb-4">Overview & Highlights</h2>
                <Card className="p-3 md:p-6 space-y-4 bg-linear-to-br from-slate-50 to-white">
                  <div className="space-y-4">
                    <div>
                      <p
                        style={
                          showFullDesc
                            ? {}
                            : {
                              display: '-webkit-box',
                              WebkitLineClamp: 4,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }
                        }
                        className="text-slate-700 leading-relaxed transition-all duration-300"
                      >
                        {trip.description}
                      </p>

                      <button
                        onClick={() => setShowFullDesc(!showFullDesc)}
                        className="mt-2 text-primary font-medium text-sm hover:underline"
                      >
                        {showFullDesc ? 'Show Less' : 'Show More'}
                      </button>
                    </div>

                    {trip.overviewPoints?.length ? (
                      <div className="rounded-3xl bg-slate-100 p-3 md:p-5">
                        <ul className="space-y-2 text-slate-700">
                          {trip.overviewPoints.map((point, idx) => (
                            <li key={idx} className="flex gap-3">
                              <span className="text-slate-400">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 pt-4">
                    {trip.highlights.map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="text-lg shrink-0">✨</span>
                        <span className="text-sm sm:text-base text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </section>

              {/* ITINERARY */}
              <section id="itinerary">
                <h2 className="text-2xl font-bold mb-4">Itinerary</h2>
                <div className="space-y-3">
                  {Array.isArray(trip.itinerary) && trip.itinerary.length > 0 ? trip.itinerary.map(day => (
                    <div
                      key={day.day}
                      className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <button
                        onClick={() => toggleDay(day.day)}
                        className="w-full flex items-start justify-between p-[3vw] sm:p-0 bg-white hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-start gap-3 text-left grow">
                          <div className="shrink-0">
                            <Badge className="bg-primary/10 text-primary text-xs font-semibold">
                              Day {day.day}
                            </Badge>
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-sm sm:text-base text-slate-900">
                              {day.title}
                            </h3>
                            {!expandedDays.includes(day.day) && (
                              <p className="text-xs sm:text-sm text-slate-600 line-clamp-1">
                                {Array.isArray(day.description) ? day.description[0] : day.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <ChevronDown
                          size={20}
                          className={`shrink-0 ml-2 transition-transform ${expandedDays.includes(day.day) ? 'rotate-180' : ''
                            }`}
                        />
                      </button>

                      {expandedDays.includes(day.day) && (
                        <div className="px-4 sm:px-5 pb-4 sm:pb-5 bg-slate-50 border-t">
                          {Array.isArray(day.description) ? (
                            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-slate-700 leading-relaxed">
                              {day.description.map((point, idx) => (
                                <li key={idx}>{point}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                              {day.description}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">
                      Itinerary details will be available shortly.
                    </div>
                  )}
                </div>
              </section>



              <section id="batches">
                <h2 className="text-2xl font-bold mb-4">Batch Dates</h2>
                <Card className="p-6 space-y-4">
                  {trip.batchDates?.map((batch, idx) => (
                    <div key={idx} className="rounded-3xl bg-slate-50 p-4 border border-slate-200">
                      <p className="text-base font-semibold text-slate-900">{batch.month}</p>
                      <ul className="mt-3 space-y-2 text-slate-700">
                        {batch.ranges.map((range, rangeIdx) => (
                          <li key={rangeIdx} className="flex gap-3">
                            <span className="text-slate-400">•</span>
                            <span>{range}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </Card>
              </section>

              <section id="costing">
                <h2 className="text-2xl font-bold mb-4">Costing Table</h2>
                <Card className="p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left divide-y divide-slate-200">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="px-4 py-3 text-sm font-semibold text-slate-700">Option</th>
                          <th className="px-4 py-3 text-sm font-semibold text-slate-700">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {trip.costingDetails?.map((item, idx) => (
                          <tr key={idx} className="bg-white hover:bg-slate-50">
                            <td className="px-4 py-4 text-slate-700 font-medium">{item.label}</td>
                            <td className="px-4 py-4 text-slate-700">{item.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </section>

              <section id="note">
                <h2 className="text-2xl font-bold mb-4">Note</h2>
                <Card className="p-6">
                  {Array.isArray(trip.note) ? (
                    <ul className="list-disc list-inside space-y-3 text-sm sm:text-base text-slate-700 leading-relaxed">
                      {trip.note.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                      {trip.note}
                    </p>
                  )}
                </Card>
              </section>

              <section id="stays">
                <h2 className="text-2xl font-bold mb-4">Stays</h2>
                <Card className="p-6">
                  <div className="space-y-3">
                    {trip.stays?.map((item, idx) => (
                      <div key={idx} className="flex gap-3">
                        <span className="text-lg shrink-0">•</span>
                        <span className="text-sm sm:text-base text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </section>

              <Accordion type="single" collapsible defaultValue="inclusions" className="space-y-4">
                <section id="inclusions">
                  <AccordionItem value="inclusions">
                    <AccordionTrigger>What's Included</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {trip.included.map((item, idx) => (
                          <div key={idx} className="flex gap-3">
                            <span className="text-lg shrink-0">✅</span>
                            <span className="text-sm sm:text-base text-slate-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </section>

                <section id="exclusions">
                  <AccordionItem value="exclusions">
                    <AccordionTrigger>What's Not Included</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {trip.notIncluded.map((item, idx) => (
                          <div key={idx} className="flex gap-3">
                            <span className="text-lg shrink-0">❌</span>
                            <span className="text-sm sm:text-base text-slate-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </section>

                <section id="payment">
                  <AccordionItem value="payment">
                    <AccordionTrigger>Payment Policy</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {trip.paymentPolicy?.map((item, idx) => (
                          <div key={idx} className="flex gap-3">
                            <span className="text-lg shrink-0">•</span>
                            <span className="text-sm sm:text-base text-slate-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </section>

                <section id="cancellation">
                  <AccordionItem value="cancellation">
                    <AccordionTrigger>Cancellation Policy</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {trip.cancellationPolicy?.map((item, idx) => (
                          <div key={idx} className="flex gap-3">
                            <span className="text-lg shrink-0">•</span>
                            <span className="text-sm sm:text-base text-slate-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </section>

                <section id="things-to-carry">
                  <AccordionItem value="things-to-carry">
                    <AccordionTrigger>Things To Carry</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {trip.thingsToCarry?.map((item, idx) => (
                          <div key={idx} className="flex gap-3">
                            <span className="text-lg shrink-0">•</span>
                            <span className="text-sm sm:text-base text-slate-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </section>

                <section id="travel-essentials">
                  <AccordionItem value="travel-essentials">
                    <AccordionTrigger>Travel Essentials</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-6">
                        {trip.travelEssentials?.map((group, idx) => (
                          <div key={idx}>
                            <h3 className="font-semibold text-base text-slate-900 mb-2">{group.title}</h3>
                            <div className="grid sm:grid-cols-2 gap-2">
                              {group.items.map((item, itemIdx) => (
                                <div key={itemIdx} className="rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-700">
                                  {item}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </section>
              </Accordion>

              {/* MOBILE CTA */}
              <div className="lg:hidden space-y-3">
                <Button size="lg" className="w-full" onClick={() => setCallbackOpen(true)}>
                  <Phone size={18} /> Enquire Now
                </Button>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="hidden lg:block space-y-[3vh]">
              <div className="lg:sticky lg:top-32">
                {/* PRICE CARD */}
                <Card className="p-6 shadow-lg border-slate-200 space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
                      {selections.length > 0 ? 'Current Selection' : 'Starting Price'}
                    </p>
                    <p className="text-3xl font-bold text-primary mt-1">
                      ₹{(selections.length > 0 ? total : lowestPrice).toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm text-slate-500 mt-2">
                      {selections.length > 0 ? `${selections.length} item${selections.length > 1 ? 's' : ''} selected` : 'per person'}
                    </p>
                  </div>

                  <div className="grid gap-3">
                    <Button
                      size="lg"
                      className="w-full justify-center"
                      onClick={handleBookNow}
                    >
                      <Phone size={18} /> Book Now
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full justify-center"
                      onClick={() => setCallbackOpen(true)}
                    >
                      <MessageCircle size={18} /> Request Callback
                    </Button>
                  </div>
                </Card>

                {/* CONTACT CARD */}
                <Card className="p-[4vw] mt-[3vh] border-slate-200">
                  <h3 className="font-semibold text-lg mb-1">Need Help?</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Contact our travel experts anytime
                  </p>

                  <div className="space-y-3 text-sm">
                    <a
                      href={`mailto:${contactEmail}`}
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <span className="font-semibold">{contactEmail}</span>
                    </a>
                    <a
                      href={`tel:${contactPhone}`}
                      className="flex items-center gap-2 text-slate-700 hover:text-primary"
                    >
                      <Phone size={16} />
                      {contactPhoneDisplay}
                    </a>
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-slate-700 hover:text-primary"
                    >
                      <MessageCircle size={16} />
                      Instagram
                    </a>
                  </div>
                </Card>

                {/* DOWNLOAD ITINERARY */}
                <Button
                  variant="outline"
                  className="w-full mt-[3vh] justify-center"
                  onClick={() => alert('Download feature coming soon!')}
                >
                  <Download size={18} /> Download Itinerary
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MOBILE BOTTOM CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white lg:hidden border-t shadow-2xl">
        <div className="max-w-6xl mx-auto px-[4vw] py-[3vh] flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500">
              {selections.length > 0 ? 'Total selected' : 'Starting at'}
            </p>
            <p className="text-lg font-bold">₹{(selections.length > 0 ? total : lowestPrice).toLocaleString('en-IN')}</p>
          </div>
          <Button onClick={handleBookNow} className="shrink-0">
            Book Now
          </Button>
        </div>
      </div>

      {/* ADD BOTTOM PADDING FOR MOBILE */}
      <div className="h-[12vh] lg:h-0 min-h-20 lg:min-h-0" />

            {/* REVIEWS SECTION */}
      <TripReviewsSection 
        tripSlug={trip.slug} 
        categoryId={trip.category.toLowerCase()} 
      />

      {/* GALLERY SECTION */}
      <TripGallerySection 
        categoryId={trip.category.toLowerCase()} 
        categoryName={trip.destination} 
      />

      <Footer />

      <RequestCallbackDialog
        open={callbackOpen}
        onOpenChange={setCallbackOpen}
        title={trip.title}
        price={lowestPrice}
      />
    </div>
  )
}
