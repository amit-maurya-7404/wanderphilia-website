'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { MessageCircle, Phone } from 'lucide-react'
import { TripHeroCarousel } from '@/components/trip-hero-carousel'
import { RequestCallbackDialog } from '@/components/request-callback-dialog'
import { gtag } from '@/lib/gtag'
import type { TripMediaItem } from '@/lib/data'
import { InternationalTripsSection } from '@/components/international-trips-section'

const heroMedia: TripMediaItem[] = [
  {
    type: 'image',
    src: '/images/dummy1.jpg',
    alt: 'Scenic upcoming tour landscape',
  },
  {
    type: 'image',
    src: '/images/dummy2.jpg',
    alt: 'Group travelers exploring outdoors',
  },
]

export default function UpcomingToursPage() {
  const [callbackOpen, setCallbackOpen] = useState(false)

  const categoryName = 'International Trips'

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="grow">
        <div className="relative h-[50vh] sm:h-[50vh] md:h-[70vh] min-h-[50vh] overflow-hidden">
          <TripHeroCarousel media={heroMedia} />

          <div className="absolute inset-0 bg-linear-to-r from-slate-950/90 via-slate-950/40 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 flex items-end">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-5 md:px-6 pb-6 sm:pb-8 lg:pb-10">
              <div className="text-white">
                <div className="max-w-2xl">
                  <div className="mb-4 inline-flex items-center rounded-full bg-amber-400/15 px-3 py-1 text-sm font-semibold text-amber-200 ring-1 ring-amber-300/20">
                    {categoryName}
                  </div>

                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-normal leading-tight">
                    Discover the next journeys crafted for curious travelers.
                  </h1>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button
                      size="lg"
                      className="min-w-45 bg-amber-400 text-white hover:bg-amber-300"
                      onClick={() => setCallbackOpen(true)}
                    >
                      <Phone size={18} className="mr-2" />
                      Request a Callback
                    </Button>

                    <Button
                      size="lg"
                      variant="outline"
                      className="min-w-45 border-white/60 text-slate-800 hover:text-white hover:border-white hover:bg-white/10 bg-white"
                      onClick={() => {
                        gtag.outboundLink('https://wa.me/919217664099')

                        const message = `Hi! I'm planning for a trip. Can you help me with details?`

                        const encodedMessage = encodeURIComponent(message)

                        window.open(
                          `https://wa.me/919217664099?text=${encodedMessage}`,
                          '_blank'
                        )
                      }}
                    >
                      <MessageCircle size={18} className="mr-2" />
                      Chat With Us
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="py-3 md:py-0">
          <div className="max-w-full mx-auto">
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