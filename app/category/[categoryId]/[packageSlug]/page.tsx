'use client'

import { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { TripHeroCarousel } from '@/components/trip-hero-carousel'
import { TripDetailActions } from '@/components/trip-detail-actions'
import { UpcomingDepartures } from '@/components/upcoming-departures'
import { RequestCallbackDialog } from '@/components/request-callback-dialog'
import { trips } from '@/lib/data'
import { MapPin, Calendar, Users, CheckCircle, XCircle, Star, Phone, MessageCircle } from 'lucide-react'
import { contactEmail, contactPhone, contactPhoneDisplay, instagramUrl } from '@/lib/contact'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'


export default function PackageDetailPage() {
  const params = useParams()
  const packageSlug = params?.packageSlug as string
  const trip = useMemo(() => trips.find(t => t.slug === packageSlug), [packageSlug])
  const [callbackOpen, setCallbackOpen] = useState(false)

  if (!trip) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Package Not Found</h1>
            <p className="text-gray-600 mt-2">Sorry, the package you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!trip) {
    notFound()
  }

  const difficultyColor =
    trip.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
      trip.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'

  // Use heroMedia from trip data, fallback to main image
  const heroMedia = trip.heroMedia || [{ type: 'image' as const, src: trip.image, alt: trip.title }]

  const datesByMonth = trip.dates.reduce((groups, date) => {
    const month = new Date(date.startDate).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })

    if (!groups[month]) {
      groups[month] = []
    }

    groups[month].push(date)
    return groups
  }, {} as Record<string, typeof trip.dates>)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Carousel */}
        <TripHeroCarousel
          media={heroMedia}
        />

        {/* Trip Header */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative mt-[5vw] md:-mt-12 z-10 mb-[8vw] md:mb-12">
          {/* Desktop Version */}
          <div className="hidden md:block">
            <Card className="p-6 lg:p-8 bg-white shadow-lg">
              <div className="flex flex-col lg:flex-row justify-between items-start mb-4 gap-6">
                <div className="flex-1">
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
                    {trip.title}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin size={18} className="text-primary flex-shrink-0" />
                    <span className="text-base">{trip.destination}</span>
                  </div>
                </div>
                <div className="text-left lg:text-right">
                  <p className="text-3xl lg:text-4xl font-bold text-primary mb-1">
                    ₹{trip.price.toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm text-gray-600">per person</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-sm">
                  <Calendar size={14} className="mr-1.5" />
                  {trip.duration} Days
                </Badge>
                <Badge className={`${difficultyColor} text-sm`}>
                  {trip.difficulty}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  <Users size={14} className="mr-1.5" />
                  Max {trip.groupSize} people
                </Badge>
                <Badge variant="outline" className="flex items-center text-sm">
                  <Star size={14} className="mr-1.5 fill-primary text-primary" />
                  {trip.rating}
                </Badge>
              </div>
            </Card>
          </div>

          {/* Mobile Version */}
          <div className="md:hidden space-y-4">
            {/* Title and Location */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {trip.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={16} className="text-primary flex-shrink-0" />
                <span className="text-sm">{trip.destination}</span>
              </div>
            </div>

            {/* Badges Row */}
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className="text-xs">
                <Calendar size={12} className="mr-1" />
                {trip.duration}D
              </Badge>
              <Badge className={`${difficultyColor} text-xs`}>
                {trip.difficulty}
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Users size={12} className="mr-1" />
                {trip.groupSize}
              </Badge>
              <Badge variant="outline" className="flex items-center text-xs">
                <Star size={12} className="mr-1 fill-primary text-primary" />
                {trip.rating}
              </Badge>
            </div>
          </div>
        </div>

        <TripDetailActions title={trip.title} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <UpcomingDepartures datesByMonth={datesByMonth} />
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-28 md:pb-20">
          <div className="grid lg:grid-cols-1 gap-8">
            {/* Main Content */}
            <div className="space-y-10 md:space-y-5">
              {/* Overview */}
              <section className="order-2 md:order-none">
                <h2 className="text-[6vw] md:text-[2.4vw] font-bold text-gray-900 mb-4">
                  Overview
                </h2>
                <p className="text-[4vw] md:text-[1.5vw] text-gray-700 leading-relaxed">
                  {trip.description}
                </p>
              </section>

              {/* Highlights */}
              <section className="order-1 md:order-none">
                <h2 className="text-[6vw] md:text-[2.4vw] font-bold text-gray-900 mb-4">
                  Trip Highlights
                </h2>
                <ul className="space-y-3">
                  {trip.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Star size={16} className="text-primary mt-1 flex-shrink-0 fill-primary" />
                      <span className="text-[4vw] md:text-[1.5vw] text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Itinerary */}
              <section>
                <h2 className="text-[6vw] md:text-[2.4vw] font-bold text-gray-900 mb-6">
                  Detailed Itinerary
                </h2>
                <div className="space-y-4">
                  {trip.itinerary.map((day) => (
                    <Card key={day.day} className="overflow-hidden border-l-4 border-primary">
                      <div className="grid gap-4 lg:grid-cols-[280px_1fr] p-4">
                        <div className="h-46 overflow-hidden rounded-3xl bg-slate-100">
                          <Image
                            src={day.image ?? trip.image}
                            alt={day.title}
                            width={560}
                            height={360}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col justify-between">
                          <div>
                            <Badge className="bg-primary text-white text-lg py-2 px-3 mb-4 inline-flex items-center">
                              Day {day.day}
                            </Badge>
                            <h3 className="text-[5vw] md:text-[1.8vw] font-semibold text-gray-900 mb-2">
                              {day.title}
                            </h3>
                            <p className="text-[4vw] md:text-[1.4vw] text-gray-700 leading-relaxed">
                              {day.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Inclusion, Exclusion, Optional Activities, Important Information, Payment Terms */}
              <section>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="inclusion">
                    <AccordionTrigger className="text-xl font-semibold no-underline hover:no-underline">
                      <div className="flex text-[6vw] md:text-[2.4vw] items-center gap-2">
                        <CheckCircle className="text-green-600" />
                        Included
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-3 pt-4">
                        {trip.included.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700">
                            <CheckCircle size={18} className="text-green-600 mt-0.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="exclusion">
                    <AccordionTrigger className="text-xl font-semibold no-underline hover:no-underline">
                      <div className="flex text-[6vw] md:text-[2.4vw] items-center gap-2">
                        <XCircle className="text-red-600" />
                        Exclusion
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-3 pt-4">
                        {trip.notIncluded.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700">
                            <XCircle size={18} className="text-red-600 mt-0.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="optional-activities">
                    <AccordionTrigger className="text-[6vw] md:text-[2.4vw] font-semibold no-underline hover:no-underline">
                      Optional Activities
                    </AccordionTrigger>
                    <AccordionContent>
                      {trip.optionalActivities?.length ? (
                        <ul className="space-y-3 pt-4">
                          {trip.optionalActivities.map((item, index) => (
                            <li key={index} className="text-gray-700 leading-relaxed">
                              • {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-700 pt-4">No optional activities listed for this trip yet.</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="important-information">
                    <AccordionTrigger className="text-[6vw] md:text-[2.4vw] font-semibold no-underline hover:no-underline">
                      Important Information
                    </AccordionTrigger>
                    <AccordionContent>
                      {trip.importantInformation?.length ? (
                        <ul className="space-y-3 pt-4">
                          {trip.importantInformation.map((item, index) => (
                            <li key={index} className="text-gray-700 leading-relaxed">
                              • {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-700 pt-4">Important information will be added soon.</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="payment-terms">
                    <AccordionTrigger className="text-[6vw] md:text-[2.4vw] font-semibold no-underline hover:no-underline">
                      Payment Terms
                    </AccordionTrigger>
                    <AccordionContent>
                      {trip.paymentTerms?.length ? (
                        <ul className="space-y-3 pt-4">
                          {trip.paymentTerms.map((item, index) => (
                            <li key={index} className="text-gray-700 leading-relaxed">
                              • {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-700 pt-4">Payment terms will be available soon.</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </section>

              {/* Booking Section */}
              <section>
                <Card className="p-6 md:p-8 bg-white border border-slate-200 shadow-lg">
                  <div className="space-y-6">
                    <div className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-orange-900">
                      Summer Holiday Sale!
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] items-start">
                      <div className="space-y-4">
                        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                          {trip.duration} days &amp; {Math.max(trip.duration - 1, 1)} nights
                        </p>
                        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
                          {trip.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                          {trip.highlights.slice(0, 3).map((item, index) => (
                            <span key={index} className="inline-flex items-center gap-2">
                              {index > 0 && <span className="text-slate-400">•</span>}
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                        <div className="flex items-center justify-between gap-4">
                          <div className="text-sm text-slate-500">Rating</div>
                          <div className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-900 shadow-sm">
                            <Star size={16} className="text-primary" />
                            {trip.rating.toFixed(1)}
                          </div>
                        </div>
                        <div className="mt-6 space-y-2">
                          <p className="text-sm text-slate-500 line-through">
                            INR {Math.round(trip.price * 1.3).toLocaleString('en-IN')}
                          </p>
                          <p className="text-3xl font-bold text-primary">
                            INR {trip.price.toLocaleString('en-IN')}
                          </p>
                          <p className="text-sm font-semibold text-emerald-600">
                            SAVE INR {Math.round(trip.price * 0.3).toLocaleString('en-IN')}
                          </p>
                          <p className="text-xs text-slate-500">/Adult</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        onClick={() => setCallbackOpen(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-4 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                      >
                        <Phone size={18} />
                        Call Now
                      </button>
                      <button
                        onClick={() => setCallbackOpen(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-center text-sm font-semibold text-white transition hover:bg-primary/90"
                      >
                        <MessageCircle size={18} />
                        Request Callback
                      </button>
                    </div>
                  </div>
                </Card>
              </section>

              {/* Contact Card */}
              <section>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Questions?
                  </h3>
                  <p className="text-gray-700 text-sm mb-4">
                    Contact our travel experts for more information
                  </p>
                  <div className="space-y-3 mb-4">
                    <a href={`mailto:${contactEmail}`} className="block text-gray-700 hover:text-primary transition-colors text-sm">
                      Email: {contactEmail}
                    </a>
                    <a href={`tel:${contactPhone}`} className="block text-gray-700 hover:text-primary transition-colors text-sm">
                      Phone: {contactPhoneDisplay}
                    </a>
                    <a href={instagramUrl} target="_blank" rel="noreferrer" className="block text-gray-700 hover:text-primary transition-colors text-sm">
                      Instagram: @wanderphiliaa
                    </a>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`mailto:${contactEmail}`}>
                      Send Email
                    </Link>
                  </Button>
                </Card>
              </section>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 md:hidden">
        <div className="mx-0 mb-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-950/10">
          <div className="flex flex-row  sm:flex-row items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">From</p>
              <p className="text-lg font-semibold text-slate-900">INR {trip.price.toLocaleString('en-IN')}</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCallbackOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 shadow-sm hover:bg-slate-200 transition"
              >
                <MessageCircle size={18} />
              </button>
              <Button 
                onClick={() => setCallbackOpen(true)}
                className="h-11 rounded-2xl bg-primary px-5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="h-24 md:hidden" />
      <Footer />
      
      <RequestCallbackDialog 
        open={callbackOpen} 
        onOpenChange={setCallbackOpen}
        title={trip.title}
        price={trip.price}
      />
    </div>
  )
}
