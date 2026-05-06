'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { UpcomingGroupToursSection } from '@/components/upcoming-group-tours-section'
import { Button } from '@/components/ui/button'
import { MessageCircle, Phone } from 'lucide-react'
import { TripHeroCarousel } from '@/components/trip-hero-carousel'
import { RequestCallbackDialog } from '@/components/request-callback-dialog'
import { gtag } from '@/lib/gtag'
import type { TripMediaItem } from '@/lib/data'
import { TripTypesSection } from '@/components/trip-types-section'
import { IndiaTripsSection } from '@/components/india-trips-section'
import { InternationalTripsSection } from '@/components/international-trips-section'

const heroMedia: TripMediaItem[] = [
  { type: 'image', src: '/images/dummy1.jpg', alt: 'Scenic upcoming tour landscape' },
  { type: 'image', src: '/images/dummy2.jpg', alt: 'Group travelers exploring outdoors' }
]



export default function UpcomingToursPage() {
  const [callbackOpen, setCallbackOpen] = useState(false)
  const categoryName = 'International Trips'

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="grow">
        <div className="relative h-[50vh] sm:h-[50vh] md:h-[70vh] min-h-[50vh] overflow-hidden ">
          <TripHeroCarousel media={heroMedia} />

          <div className="absolute inset-0 bg-linear-to-r from-slate-950/90 via-slate-950/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-5 md:px-6 pb-6 sm:pb-8 lg:pb-10 ">
              <div className=" text-white">
                <div className="max-w-2xl ">
                  <div className="mb-4 inline-flex items-center rounded-full bg-amber-400/15 px-3 py-1 text-sm font-semibold text-amber-200 ring-1 ring-amber-300/20">
                    {categoryName}
                  </div>

                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-normal leading-tight">
                    Discover the next journeys crafted for curious travelers.
                  </h1>

                  {/* <p className="mt-4 text-sm sm:text-base md:text-lg max-w-2xl text-slate-100 leading-7">
                    Modern group tours with vibrant itineraries, local experts, and seamless support for every step.
                  </p> */}

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button
                      size="lg"
                      className="min-w-45 bg-amber-400 text-white hover:bg-amber-300"
                      onClick={() => setCallbackOpen(true)}
                    >
                      <Phone size={18} className="mr-2" /> Request a Callback
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="min-w-45 border-white/60 text-slate-800 hover:text-white hover:border-white hover:bg-white/10 bg-white"
                      onClick={() => {
                        gtag.outboundLink('https://wa.me/919217664099');

                        const message = `Hi! I'm planning for a trip. Can you help me with details?`

                        const encodedMessage = encodeURIComponent(message)

                        window.open(
                          `https://wa.me/919217664099?text=${encodedMessage}`,
                          '_blank'
                        )
                      }}
                    >
                      <MessageCircle size={18} className="mr-2" /> Chat With Us
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <section className="bg-slate-50 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[1.3fr_0.9fr] lg:items-start">
              <div className="rounded-[2rem] border border-slate-200/80 bg-white p-10 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">What to expect</p>
                <h2 className="mt-5 text-3xl font-bold text-slate-950">Group journeys built for comfort, connection, and discovery.</h2>
                <p className="mt-5 text-base leading-8 text-slate-600">
                  Every tour blends expert local guides, carefully paced itineraries, and premium stays so you can travel with confidence and joy.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Small groups</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">Comfortable group sizes for easy movement and deeper cultural access.</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Handpicked routes</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">Journeys that combine iconic sights with hidden local favorites.</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Expert support</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">From planning to departure, you have a dedicated team at every step.</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Flexible dates</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">Choose the best schedule for your group with customizable options.</p>
                  </div>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  { title: 'Next departure', value: 'May 2026' },
                  { title: 'Top route', value: 'Leh Ladakh & Kashmir' },
                  { title: 'Group size', value: '10-16 travelers' },
                  { title: 'Includes', value: 'Travel, stay, transport, guide' },
                ].map((item) => (
                  <div key={item.title} className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{item.title}</p>
                    <p className="mt-4 text-2xl font-bold text-slate-950">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section> */}

        <section className="py-3 md:py-0">
          <div className="max-w-full mx-auto ">
            <InternationalTripsSection />
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
