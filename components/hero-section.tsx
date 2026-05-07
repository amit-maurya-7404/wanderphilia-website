'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin, ArrowRight, Search, Star, Users, Headphones, Award } from 'lucide-react'
import { MobileHeroSection } from './mobile-hero-section'
import { getAllCategories } from '@/lib/trip-categories'
import { gtag } from '@/lib/gtag'

export function HeroSection() {
  const [destination, setDestination] = useState('')
  const router = useRouter()

  const categories = useMemo(() => getAllCategories(), [])

  // Filter categories based on destination input
  const filteredCategories = useMemo(() => {
    if (!destination.trim()) return []
    return categories.filter(cat =>
      cat.name.toLowerCase().includes(destination.toLowerCase())
    )
  }, [destination, categories])

  const heroVideo = '/images/hero-video.mp4'

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
        <div className="flex flex-col justify-center items-center min-h-screen  text-center pb-32">
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
          {/* <p className="text-sm md:text-lg text-gray-200 mb-6 max-w-3xl leading-relaxed">
            Discover curated adventures that redefine travel. From snow-capped peaks to pristine beaches, we craft unforgettable journeys for the modern explorer.
          </p> */}



          <div className="pt-20 max-w-2xl w-full relative">
            <div className="flex flex-col sm:flex-row gap-3 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 hover:border-white/40 transition-all">
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                <Input
                  type="text"
                  placeholder="Where do you want to explore?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="pl-12 py-3 leading-6 bg-transparent border-0 text-white placeholder:text-gray-300 placeholder:leading-6 focus:ring-0 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (filteredCategories.length > 0) {
                    const selectedCat = filteredCategories[0]
                    setDestination('')
                    router.push(`/trips/${selectedCat.id}`)
                  } else if (destination.trim()) {
                    router.push(`/trips?destination=${destination}`)
                  }
                  // Track search action
                  gtag.event({
                    action: 'click',
                    category: 'CTA',
                    label: 'Hero Search Button',
                  });
                }}
                className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-[#FF8713] via-[#FF6E0B] to-[#FF5D09] hover:from-[#FFA033] hover:via-[#FF7E1A] hover:to-[#FF6A1A] transition-all duration-300 text-white font-semibold shrink-0"
              >
                <Search size={20} />
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {destination && filteredCategories.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-slate-800/90 backdrop-blur-md border border-slate-700 rounded-2xl shadow-lg max-h-48 overflow-y-auto z-50">
                {filteredCategories.map(cat => (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setDestination('')
                      router.push(`/trips/${cat.id}`)
                      gtag.event({
                        action: 'click',
                        category: 'Navigation',
                        label: `Search Suggestion: ${cat.name}`,
                      });
                    }}
                    className="p-3 hover:bg-slate-700 cursor-pointer text-white border-b border-slate-600 last:border-b-0"
                  >
                    {cat.name}
                  </div>
                ))}
              </div>
            )}
          </div>



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
              <p className="text-black font-semibold text-lg">Google Reviews</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-primary text-2xl font-bold">20,000+</span>
            <p className="text-black font-semibold text-lg">Happy Wanderers</p>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-green-600 text-2xl font-bold">24x7</span>
            <p className="text-black font-semibold text-lg">Support</p>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-blue-600 text-2xl font-bold">8 Years</span>
            <p className="text-black font-semibold text-lg">Experience</p>
          </div>

        </div>
      </div>
    </section>
  )
}
