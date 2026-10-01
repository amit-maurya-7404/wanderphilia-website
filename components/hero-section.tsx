'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { MapPin, Search, Star } from 'lucide-react'
import { MobileHeroSection } from './mobile-hero-section'
import { HeroSearchDialog } from './hero-search-dialog'
import { gtag } from '@/lib/gtag'

export function HeroSection() {
  const [destination, setDestination] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const router = useRouter()

  const heroVideo = '/images/hero-video.mp4'

  const handleOpenSearch = (initialVal?: string) => {
    if (typeof initialVal === 'string') {
      setDestination(initialVal)
    }
    setIsSearchOpen(true)
    gtag.event({
      action: 'click',
      category: 'CTA',
      label: 'Hero Search Bar Opened',
    })
  }

  return (
    <section className="relative overflow-hidden pt-26 md:pt-10 md:min-h-screen">
      {/* Background Image Carousel with Overlay (desktop only) */}
      <div className="absolute inset-0 z-0 pointer-events-none hidden md:block">
        <video
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-white/10 pointer-events-none" />
      </div>

      {/* Mobile Hero */}
      <MobileHeroSection />

      {/* Desktop Hero */}
      <div className="relative z-10 hidden md:flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center items-center min-h-screen text-center pb-32">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="w-12 h-1 bg-primary rounded-full" />
            <span className="text-primary font-semibold text-sm tracking-widest uppercase">
              Wanderphilia Experience
            </span>
            <div className="w-12 h-1 bg-primary rounded-full" />
          </div>

          <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight max-w-4xl">
            Wanderphilia A Global Community of explorers discovering world Together
          </h1>

          <div className="pt-20 max-w-2xl w-full relative">
            <div
              onClick={() => handleOpenSearch()}
              className="flex flex-col sm:flex-row gap-3 bg-white shadow-2xl p-2 rounded-full border border-white/80 hover:border-orange-300 hover:shadow-orange-500/10 transition-all cursor-pointer group"
            >
              <div className="flex-1 relative flex items-center">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary group-hover:scale-110 transition-transform" size={20} />
                <input
                  type="text"
                  readOnly
                  placeholder="Where do you want to explore?"
                  value={destination}
                  onFocus={() => handleOpenSearch()}
                  className="w-full pl-12 py-3 leading-6 bg-transparent border-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none text-base cursor-pointer"
                />
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleOpenSearch()
                }}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-[#FF8713] via-[#FF6E0B] to-[#FF5D09] hover:from-[#FFA033] hover:via-[#FF7E1A] hover:to-[#FF6A1A] transition-all duration-300 text-white font-semibold shrink-0 cursor-pointer shadow-sm hover:shadow-md"
              >
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Search Popup Modal */}
          <HeroSearchDialog
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            initialQuery={destination}
          />
        </div>
      </div>

      <div className="absolute bottom-0 md:bottom-0 left-1/2 -translate-x-1/2 w-full px-0 z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 bg-white/0 backdrop-blur-md pt-6 pb-6  max-w-full mx-auto shadow-xl">

          <div className="flex items-center justify-center gap-3">
            <Image
              src="/images/Google_logo.png"
              alt="Google logo"
              width={50}
              height={50}
              className="object-contain"
            />
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-1 mb-0">

                <span className="text-yellow-400 text-2xl font-bold">5</span>
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
              <p className="text-white font-semibold text-lg">Google Reviews</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-primary text-2xl font-bold">20,000+</span>
            <p className="text-white font-semibold text-lg">Happy Wanderers</p>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-green-600 text-2xl font-bold">24x7</span>
            <p className="text-white font-semibold text-lg">Support</p>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-blue-600 text-2xl font-bold">8 Years</span>
            <p className="text-white font-semibold text-lg">Experience</p>
          </div>

        </div>
      </div>
    </section>
  )
}
