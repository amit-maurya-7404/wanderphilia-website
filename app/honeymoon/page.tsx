'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { HoneymoonPackagesSection } from '@/components/honeymoon-packages-section'
import { Button } from '@/components/ui/button'
import { MessageCircle, Phone } from 'lucide-react'
import { TripHeroCarousel } from '@/components/trip-hero-carousel'
import { RequestCallbackDialog } from '@/components/request-callback-dialog'
import type { TripMediaItem } from '@/lib/data'

const heroMedia: TripMediaItem[] = [
  { type: 'image', src: '/images/dummy4.jpg', alt: 'Honeymoon retreat by the water' },
  { type: 'image', src: '/images/dummy3.jpeg', alt: 'Couple exploring a romantic destination' }
]

export default function HoneymoonPage() {
  const [callbackOpen, setCallbackOpen] = useState(false)
  const categoryName = 'Honeymoon Escapes'

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="grow">
        <section className="relative h-[50vh] sm:h-[50vh] md:h-[70vh] overflow-hidden pt-20">
          <TripHeroCarousel media={heroMedia} />

          <div className="absolute inset-0 bg-linear-to-r from-slate-950/90 via-slate-950/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-5 md:px-6 pb-6 sm:pb-8 lg:pb-10">
              <div className=" text-white">
                <div className="max-w-2xl">
                  <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                    Honeymoon Escapes
                  </div>

                  <h1 className="text-2xl sm:text-4xl md:text-4xl font-bold tracking-tight leading-tight">
                    Romantic journeys designed for unforgettable couple adventures.
                  </h1>

                  {/* <p className="mt-4 text-sm sm:text-base md:text-lg max-w-2xl text-slate-100 leading-7">
                    From intimate stays to dreamy sunsets, every package is crafted to make your honeymoon feel magical and effortless.
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
                      className="min-w-45 border-white/60 text-white hover:text-white hover:border-white hover:bg-white/10 bg-white/10"
                    >
                      <MessageCircle  size={18} className="mr-2" /> Chat With Us
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* <section className="bg-slate-50 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[1.3fr_0.9fr] lg:items-start">
              <div className="rounded-4xl border border-slate-200/80 bg-white p-10 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Plan your escape</p>
                <h2 className="mt-5 text-3xl font-bold text-slate-950">Luxury experiences for couples who want privacy and romance.</h2>
                <p className="mt-5 text-base leading-8 text-slate-600">
                  Every honeymoon package blends serene accommodations, local experiences, and thoughtful details so you can focus on each other.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Private stays</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">Handpicked boutique hotels and quiet resorts.</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Curated experiences</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">Romantic dinners, couples’ spa days, and unforgettable moments.</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Flexible pace</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">Relaxed itineraries with optional adventure and downtime.</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Romantic details</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">Special touches built into every journey.</p>
                  </div>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  { title: 'Signature stay', value: 'Boutique resorts' },
                  { title: 'Best season', value: 'Oct - Feb' },
                  { title: 'Highlights', value: 'Sunsets, private dining' },
                  { title: 'Perfect for', value: 'Couples & honeymooners' },
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

        <section className="py-2 md:py-0">
          <div className="max-w-full">
            <HoneymoonPackagesSection />
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
