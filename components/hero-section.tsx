'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin, ArrowRight } from 'lucide-react'
import { MobileHeroSection } from './mobile-hero-section'

export function HeroSection() {
  const [destination, setDestination] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const heroImages = [
    '/images/dummy1.jpg',
    '/images/dummy2.jpg',
    '/images/dummy3.jpg',
    '/images/dummy4.jpg',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [heroImages.length])

  return (
    <section className="relative overflow-hidden bg-slate-950">
      {/* Background Image Carousel with Overlay (desktop only) */}
      <div className="absolute inset-0 z-0 pointer-events-none hidden md:block">
        {heroImages.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt="Hero Background"
            fill
            className={`object-cover transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'} `}
            priority={index === 0}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/70 to-slate-950/95 pointer-events-none" />
      </div>

      {/* Mobile Hero */}
      <MobileHeroSection />

      {/* Desktop Hero */}
      <div className="relative z-10 hidden md:flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center items-center min-h-screen text-center">
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
          <p className="text-sm md:text-lg text-gray-200 mb-6 max-w-3xl leading-relaxed">
            Discover curated adventures that redefine travel. From snow-capped peaks to pristine beaches, we craft unforgettable journeys for the modern explorer.
          </p>
          <div className="mb-8 max-w-2xl w-full">
            <div className="flex flex-col sm:flex-row gap-3 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 hover:border-white/40 transition-all">
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/4  text-primary" size={20} />
                <Input
                  type="text"
                  placeholder="Where do you want to explore?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="pl-12 py-3 leading-6 bg-transparent border-0 text-white placeholder:text-gray-300 placeholder:leading-6 focus:ring-0 focus:outline-none"
                />
              </div>
              <Button asChild className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl h-auto font-semibold flex items-center gap-2">
                <Link href={`/trips${destination ? `?destination=${destination}` : ''}`}>
                  Explore
                  <ArrowRight size={18} />
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md justify-center">
            <Button asChild className="bg-primary hover:bg-primary/90 text-white px-7 py-4 text-base rounded-xl h-auto font-semibold">
              <Link href="/trips">Discover All Trips</Link>
            </Button>
            <Button asChild variant="outline" className="border-1 md:border-2 border-white text-white bg-white/10 hover:bg-primary px-7 py-4 text-base rounded-xl h-auto font-semibold">
              <Link href="#featured">Learn Our Story</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/60 text-sm">Scroll to explore</span>
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}
