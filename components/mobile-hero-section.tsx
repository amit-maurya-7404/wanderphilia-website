'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Search, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { getAllCategories } from '@/lib/trip-categories'
import { trips } from '@/lib/data'
import { getPageSectionMapping } from '@/lib/section-mappings'
import { TripCard } from '@/components/trip-card'
import Link from 'next/link'

export function MobileHeroSection() {
    const [destination, setDestination] = useState('')
    const [banners] = useState<any[]>([
        { _id: '1', title: "Bali's Zamna Fest", image: '/images/mobile-hero-bali-zamna.png', link: '/trips/bali' },
        { _id: '2', title: "Spiti Winter Expedition", image: '/images/mobile-hero-spiti-winter.png', link: '/trips/spiti' },
        { _id: '3', title: "Ladakh Bike Odyssey", image: '/images/mobile-hero-ladakh-bike.png', link: '/trips/leh-ladakh' },
        { _id: '4', title: "Vietnam Wonders Cruise", image: '/images/mobile-hero-vietnam-cruise.png', link: '/trips/vietnam' }
    ])

    const categories = useMemo(() => getAllCategories(), [])
    const featuredTripIds = useMemo(() => getPageSectionMapping('featured'), [])

    const featuredCards = useMemo(() => {
        return featuredTripIds
            .map(id => trips.find(trip => trip.id === id))
            .filter((trip): trip is typeof trips[number] => Boolean(trip))
    }, [featuredTripIds])

    const router = useRouter()

    const [bannerIndex, setBannerIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setBannerIndex((prev) => (prev + 1) % banners.length)
        }, 4000)

        return () => clearInterval(interval)
    }, [banners.length])

    const filteredCategories = useMemo(() => {
        if (!destination.trim()) return []
        return categories.filter(cat =>
            cat.name.toLowerCase().includes(destination.toLowerCase())
        )
    }, [destination, categories])

    return (
        <div className="relative md:hidden min-h-screen pt-20">
            <div className="absolute inset-0 bg-linear-to-t from-white from-50% to-primary to-100%" />

            <div className="relative z-10 px-4 space-y-4">

                {/* SEARCH */}
                <div className="relative">
                    <div className="bg-white/90 backdrop-blur-xl rounded-full mt-4 pl-4 shadow-lg">
                        <div className="flex items-center gap-3">
                            <MapPin className="text-primary" size={24} />
                            <input
                                type="text"
                                placeholder="Explore Best Itineraries"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                className="w-full outline-none bg-transparent text-black"
                            />
                            <button className="h-12 w-16 flex items-center justify-center text-primary">
                                <Search size={20} />
                            </button>
                        </div>
                    </div>

                    {destination && (
                        <div className="absolute w-full bg-slate-800 text-white rounded-xl mt-2 z-50">
                            {filteredCategories.map(cat => (
                                <div
                                    key={cat.id}
                                    onClick={() => {
                                        setDestination('')
                                        router.push(`/trips/${cat.id}`)
                                    }}
                                    className="p-3 border-b border-slate-700"
                                >
                                    {cat.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex gap-3">

                    {/* CARD 1 */}
                    <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow flex-1">
                        <img src="/images/Google_logo.png" alt="" className="h-10 w-10 object-contain" />
                        <p className="font-semibold flex flex-row gap-1 items-center text-sm whitespace-nowrap">
                            5  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> Rating
                        </p>
                    </div>

                    {/* CARD 2 */}
                    <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow flex-1">
                        <img src="/images/victory-logo.png" alt="" className="h-10 w-10 object-contain" />
                        <p className="font-semibold text-sm whitespace-nowrap">
                            8+ Years <br /> Experience
                        </p>
                    </div>

                </div>

                {/* 🎯 CAROUSEL (FIXED HEIGHT) */}
                <div className="relative overflow-hidden rounded-2xl h-40 shadow-md">
                    <div
                        className="flex h-full transition-transform duration-500"
                        style={{
                            transform: `translateX(-${bannerIndex * 100}%)`
                        }}
                    >
                        {banners.map(banner => (
                            <Link 
                                href={banner.link || '#'} 
                                key={banner._id} 
                                className="w-full shrink-0 h-full relative block"
                            >
                                <img
                                    src={banner.image}
                                    alt={banner.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-4">
                                    <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider">Special Promotion</span>
                                    <h4 className="text-white text-base font-black tracking-tight leading-tight">{banner.title}</h4>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Banner slide dots */}
                    <div className="absolute bottom-2 right-4 flex gap-1 z-20">
                        {banners.map((_, index) => (
                            <div
                                key={index}
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                    index === bannerIndex ? 'bg-white w-3' : 'bg-white/40'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* CATEGORIES */}
                <div className="flex gap-4 overflow-x-auto scrollbar-hide">
                    {categories.map(cat => (
                        <div
                            key={cat.id}
                            onClick={() => router.push(`/trips/${cat.id}`)}
                            className="flex flex-col items-center min-w-20"
                        >
                            <div className="h-16 w-16 rounded-full bg-primary/30 flex items-center justify-center">
                                <img src={cat.image} className="rounded-full w-full h-full object-cover" />
                            </div>
                            <p className="text-xs  mt-2">{cat.name}</p>
                        </div>
                    ))}
                </div>

                {/* TRIPS */}
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {featuredCards.map(trip => (
                        <div key={trip.id} className="min-w-[75%]">
                            <TripCard {...trip} />
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}