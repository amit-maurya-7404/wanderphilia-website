'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { MapPin, Star, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { getAllCategories } from '@/lib/trip-categories'
import { trips } from '@/lib/data'
import { getPageSectionMapping } from '@/lib/section-mappings'
import { TripCard } from '@/components/trip-card'

export function MobileHeroSection() {
    const [destination, setDestination] = useState('')
    const [banners, setBanners] = useState<any[]>([
        { _id: '1', title: 'Special Winter Offer', image: '/images/LL2.jpg', isActive: true },
        { _id: '2', title: 'Group Discount 25%', image: '/images/dummy4.jpg', isActive: true },
        { _id: '3', title: 'Early Bird Booking', image: '/images/dummy3.jpg', isActive: true }
    ])

    const categories = useMemo(() => getAllCategories(), [])

    const featuredTripIds = useMemo(() => getPageSectionMapping('featured'), [])
    const featuredCards = useMemo(() => {
        return featuredTripIds
            .map(id => trips.find(trip => trip.id === id))
            .filter((trip): trip is typeof trips[number] => Boolean(trip))
    }, [featuredTripIds])

    const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || 'all')
    const router = useRouter()

    const [index, setIndex] = useState(0)
    const [isMobile, setIsMobile] = useState(false)
    const [cardsPerView, setCardsPerView] = useState(4)

    useEffect(() => {
        const update = () => {
            const mobile = window.innerWidth < 768
            setIsMobile(mobile)
            setCardsPerView(mobile ? 1 : 4)
        }

        update()
        window.addEventListener('resize', update)
        return () => window.removeEventListener('resize', update)
    }, [])

    // reset index when layout changes
    useEffect(() => {
        setIndex(0)
    }, [cardsPerView])

    const maxIndex = Math.max(0, featuredCards.length - cardsPerView)
    const [bannerIndex, setBannerIndex] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const [touchStartX, setTouchStartX] = useState(0)
    const [touchEndX, setTouchEndX] = useState(0)

    useEffect(() => {
    if (isPaused || banners.length === 0) return

    const interval = setInterval(() => {
        setBannerIndex((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(interval)
}, [isPaused, banners.length])
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.targetTouches[0].clientX)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEndX(e.targetTouches[0].clientX)
    }

    const handleTouchEnd = () => {
        const distance = touchStartX - touchEndX

        if (distance > 50) {
            // swipe left
            setBannerIndex((prev) => (prev + 1) % banners.length)
        }

        if (distance < -50) {
            // swipe right
            setBannerIndex((prev) =>
                prev === 0 ? banners.length - 1 : prev - 1
            )
        }
    }

    const nextSlide = () => {
        setIndex((prev) => Math.min(prev + 1, maxIndex))
    }

    const prevSlide = () => {
        setIndex((prev) => Math.max(prev - 1, 0))
    }

    const filteredCategories = useMemo(() => {
        if (!destination.trim()) return []
        return categories.filter(cat =>
            cat.name.toLowerCase().includes(destination.toLowerCase())
        )
    }, [destination, categories])

    return (
        <div className="relative z-10    md:hidden min-h-screen pt-20">
            {/* Background Pattern */}
            {/* <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-5"></div> */}
            <div className="absolute  inset-0 bg-linear-to-t from-white from-50% to-primary to-100%"></div>
            {/* [#ff5f2e]/90 */}
            <div className="relative z-10 px-4  pb-0 space-y-4">

                <div className="relative ">
                    {/* Search Bar */}
                    <div className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-full mt-4 pl-4 py-0 shadow-[0_8px_32px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] hover:scale-[1.02] hover:bg-white/30 transition-all duration-300">

                        <div className="flex items-center gap-3">
                            <MapPin className="text-primary" size={30} />

                            <input
                                type="text"
                                placeholder="Explore Best Itineraries"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                className="w-full outline-none bg-transparent text-black placeholder:text-gray-500 text-base"
                            />

                            <button
                                type="button"
                                className="inline-flex h-14 w-20 items-center justify-center rounded-r-full bg-white/30 text-primary transition hover:bg-white/20"
                            >
                                <Search size={23} />
                            </button>
                        </div>
                    </div>

                    {/* Suggestions Dropdown */}
                    {destination && (
                        <div className="absolute left-0 top-full mt-2 w-full bg-slate-800/90 backdrop-blur-md border border-slate-700 rounded-2xl shadow-lg max-h-48 overflow-y-auto z-50">

                            {filteredCategories.length > 0 ? (
                                filteredCategories.map(cat => (
                                    <div
                                        key={cat.id}
                                        onClick={() => {
                                            setDestination('')
                                            router.push(`/trips/${cat.id}`)
                                        }}
                                        className="p-3 hover:bg-slate-700 cursor-pointer text-white border-b border-slate-600 last:border-b-0"
                                    >
                                        {cat.name}
                                    </div>
                                ))
                            ) : (
                                <p className="p-3 text-sm text-gray-300">No results found</p>
                            )}

                        </div>
                    )}
                </div>

                {/* Rating + Instagram */}
                {/* <div className="flex gap-4">
        <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-4 text-center shadow-lg hover:border-white/40 transition-all">
          <p className="text-sm text-gray-300 mb-1">⭐ Rating</p>
          <p className="font-bold text-xl text-white">4.9</p>
        </div>

        <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-4 text-center shadow-lg hover:border-white/40 transition-all">
          <p className="text-sm text-gray-300 mb-1">📸 Followers</p>
          <p className="font-bold text-xl text-white">316K</p>
        </div>
      </div> */}

                {/* Offer Carousel */}
                <div
                    className="relative overflow-hidden rounded-3xl"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* TRACK */}
                    <div
                        className="flex transition-transform duration-700 ease-in-out"
                        style={{
                            transform: `translateX(-${bannerIndex * 100}%)`,
                        }}
                    >
                        {banners.map((banner) => (
                            <div key={banner._id} className="w-full shrink-0">
                                <img
                                    src={banner.image}
                                    alt={banner.title}
                                    className="w-full h-[25vh] object-cover rounded-3xl"
                                />
                            </div>
                        ))}
                    </div>

                    {/* DOTS */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                        {banners.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setBannerIndex(i)}
                                className={`h-2 rounded-full transition-all ${bannerIndex === i
                                        ? 'w-6 bg-white'
                                        : 'w-2 bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Categories */}
                <div className="overflow-x-auto flex gap-4 [scrollbar-width:none] ">
                    {categories.length > 0 ? categories.map((cat) => (
                        <div
                            key={cat.id}
                            className="flex flex-col items-center min-w-20 cursor-pointer group"
                            onClick={() => router.push(`/trips/${cat.id}`)}
                        >
                            <div className={`h-16 w-16 rounded-full backdrop-blur-md border shadow-lg group-hover:scale-105 transition-all flex items-center justify-center ${selectedCategory === cat.id
                                ? 'bg-primary/30 border-white'
                                : 'bg-primary/30 border-white'
                                }`}>
                                {cat.image ? (
                                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-full" />
                                ) : (
                                    <span className="text-white font-semibold text-sm">{cat.name[0]}</span>
                                )}
                            </div>
                            <p className="text-xs text-black mt-2 font-medium">{cat.name}</p>
                        </div>
                    )) : (
                        ['Leh Ladakh', 'Spiti', 'Kashmir', 'Himachal'].map((cat, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-center min-w-20 cursor-pointer group"
                            >
                                <div className="h-16 w-16 rounded-full bg-linear-to-br from-primary/30 to-primary/20 backdrop-blur-md border border-primary/40 shadow-lg group-hover:border-primary/60 transition-all flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">{cat[0]}</span>
                                </div>
                                <p className="text-xs text-white mt-2 font-medium">{cat}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Featured Manual Cards */}
                <div className="space-y-4">
                    <div className="relative">

                        {/* ✅ MOBILE SCROLLER */}
                        {isMobile ? (
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {featuredCards.map((trip) => (
                                    <div
                                        key={trip.id}
                                        className="min-w-[75%] shrink-0"
                                    >
                                        <TripCard {...trip} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                {/* LEFT ARROW */}
                                <button
                                    onClick={prevSlide}
                                    disabled={index === 0}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                {/* RIGHT ARROW */}
                                <button
                                    onClick={nextSlide}
                                    disabled={index === maxIndex}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40"
                                >
                                    <ChevronRight size={20} />
                                </button>

                                {/* TRACK */}
                                <div className="overflow-hidden">
                                    <div
                                        className="flex transition-transform duration-500 ease-in-out"
                                        style={{
                                            transform: `translateX(-${index * (100 / cardsPerView)}%)`,
                                        }}
                                    >
                                        {featuredCards.map((trip) => (
                                            <div
                                                key={trip.id}
                                                className="shrink-0 basis-1/4 p-2"
                                            >
                                                <TripCard {...trip} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                    </div>
                </div>

            </div>
        </div>
    )
}