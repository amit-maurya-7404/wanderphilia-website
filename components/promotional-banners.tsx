'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface SlideItem {
  id: number
  title: string
  highlight: string
  subtitle: string
  price: string
  duration: string
  image: string
  link: string
  themeColor: string
}

export function PromotionalBanners() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Touch Swipe states
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const minSwipeDistance = 50

  const slides: SlideItem[] = [
    {
      id: 1,
      title: "Bali's ZAMNA FEST",
      highlight: "WHERE TECHNO leads the night",
      subtitle: "Join the legendary techno festival under the Balinese palm trees with a premium group experience.",
      price: "₹62,999/-",
      duration: "7N-8D",
      image: "/images/banner-bali-zamna.png",
      link: "/trips/bali",
      themeColor: "from-amber-400 to-amber-500"
    },
    {
      id: 2,
      title: "Spiti Winter Expedition",
      highlight: "WHITE MAGIC OF THE HIMALAYAS",
      subtitle: "Embark on an extreme winter journey through frozen landscapes, monasteries, and snow valleys.",
      price: "₹24,499/-",
      duration: "7N-8D",
      image: "/images/banner-spiti-winter.png",
      link: "/trips/spiti",
      themeColor: "from-blue-400 to-blue-600"
    },
    {
      id: 3,
      title: "Ladakh Bike Odyssey",
      highlight: "CONQUER THE HIGHEST PASSES",
      subtitle: "Ride across majestic dry mountains and alongside pristine blue waters of Pangong Tso.",
      price: "₹15,800/-",
      duration: "9N-10D",
      image: "/images/banner-ladakh-bike.png",
      link: "/trips/leh-ladakh",
      themeColor: "from-cyan-400 to-cyan-600"
    },
    {
      id: 4,
      title: "Vietnam Wonders Cruise",
      highlight: "SAIL THROUGH HALONG BAY",
      subtitle: "Explore vibrant street food in Hanoi, cruise limestone karsts, and experience lantern-lit Hoi An.",
      price: "₹32,999/-",
      duration: "5N-6D",
      image: "/images/banner-vietnam-cruise.png",
      link: "/trips/vietnam",
      themeColor: "from-emerald-400 to-emerald-500"
    }
  ]

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  // Touch Swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }
  }

  return (
    <div className="w-full bg-slate-50 py-12 md:py-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Slider Wrapper */}
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl h-[45vh] sm:h-[40vh] md:h-[450px] bg-slate-900 border border-slate-800">
          
          {/* Slides Track with touch handlers for swipe */}
          <div 
            className="relative w-full h-full cursor-grab active:cursor-grabbing"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                {/* Background Banner Image */}
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover object-center opacity-85 select-none pointer-events-none"
                  priority={index === 0}
                />
                
                {/* Dark Premium Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/65 to-transparent z-11" />
                
                {/* Text Content Overlay */}
                <div className="absolute inset-0 z-12 flex items-center p-6 sm:p-10 md:p-14">
                  <div className="max-w-xl text-white space-y-4">
                    
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      Wanderphilia Specials
                    </div>
                    
                    {/* Main Title / Heading */}
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none bg-linear-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent">
                      {slide.title}
                    </h2>
                    
                    {/* Bold Subtitle / Hook */}
                    <p className="text-amber-400 font-extrabold text-sm sm:text-base md:text-lg uppercase tracking-wide">
                      {slide.highlight}
                    </p>
                    
                    {/* Description Paragraph */}
                    <p className="text-gray-300 text-xs sm:text-sm md:text-base font-medium line-clamp-2 sm:line-clamp-none max-w-lg leading-relaxed">
                      {slide.subtitle}
                    </p>
                    
                    {/* Price and Action Buttons */}
                    <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-4">
                      
                      {/* Price Details */}
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Starting Price</span>
                        <span className="text-xl sm:text-2xl font-black text-white">{slide.price}</span>
                      </div>
                      
                      {/* Duration */}
                      <div className="h-8 w-px bg-white/20" />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Duration</span>
                        <span className="text-base sm:text-lg font-black text-white">{slide.duration}</span>
                      </div>

                      {/* CTA Button */}
                      <Link 
                        href={slide.link}
                        className={`ml-2 px-5 py-3 rounded-full font-bold text-xs sm:text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all hover:scale-105 shadow-lg shadow-amber-400/20 duration-300`}
                      >
                        Book Now
                      </Link>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Left Arrow - hidden on mobile view */}
          <button
            onClick={prevSlide}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10 items-center justify-center text-white hover:bg-white hover:text-slate-950 hover:scale-110 transition duration-300 shadow-md cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Right Arrow - hidden on mobile view */}
          <button
            onClick={nextSlide}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10 items-center justify-center text-white hover:bg-white hover:text-slate-950 hover:scale-110 transition duration-300 shadow-md cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots Navigation */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentSlide ? 'bg-white w-6' : 'bg-white/40'
                }`}
              />
            ))}
          </div>

        </div>

        {/* Static Horizontal Community Trips Banner */}
        <div className="mt-8 relative rounded-2xl md:rounded-3xl overflow-hidden shadow-xl h-[120px] sm:h-[140px] md:h-[160px] bg-sky-950 group">
          <Image
            src="/images/everest.jpg"
            alt="Community Trips"
            fill
            className="object-cover object-center opacity-65 group-hover:scale-105 transition-transform duration-700 select-none pointer-events-none"
          />
          {/* Subtle cyan overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-sky-900/90 via-sky-850/50 to-transparent z-10" />
          
          <div className="absolute inset-0 z-11 flex flex-col sm:flex-row items-center justify-between p-6 sm:px-12 md:px-16 text-center sm:text-left">
            <div>
              <span className="text-[10px] sm:text-xs text-sky-300 font-extrabold uppercase tracking-widest block mb-1">Upcoming</span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-none">
                Community <span className="text-yellow-400">Trips</span>
              </h3>
            </div>
            
            <Link 
              href="/upcoming-tours"
              className="mt-3 sm:mt-0 px-6 py-2.5 rounded-full text-xs font-bold bg-white text-sky-950 hover:bg-yellow-400 hover:text-slate-900 hover:scale-105 shadow-md transition-all duration-300"
            >
              Explore Now
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
