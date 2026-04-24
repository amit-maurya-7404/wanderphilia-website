'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { MapPin, Star, Search } from 'lucide-react'
import { trips } from '@/lib/data'

export function MobileHeroSection() {
    const [destination, setDestination] = useState('')
    const [banners, setBanners] = useState<any[]>([
        { _id: '1', title: 'Special Winter Offer', image: '/images/dummy1.jpg', isActive: true },
        { _id: '2', title: 'Group Discount 25%', image: '/images/dummy4.jpg', isActive: true },
        { _id: '3', title: 'Early Bird Booking', image: '/images/dummy3.jpg', isActive: true }
    ])

    // Extract categories from trips data (excluding 'All')
    const categories = useMemo(() => {
        const categoryImageMap: Record<string, string> = {
            Bhutan: '/images/Bhutan_cat.jpg',
            Nepal: '/images/nepal-dest.jpg',
            Indonesia: '/images/indonesia-dest.jpg',
            Switzerland: '/images/switzerland-dest.jpg',
            Peru: '/images/peru-dest.jpg',
            Japan: '/images/japan.jpg',
            'Leh Ladakh': '/images/leh-ladakh.jpg',
            Spiti: '/images/spiti-valley.jpg',
            Kashmir: '/images/kashmir.jpg',
            Meghalaya: '/images/meghalaya.jpg',
            Himachal: '/images/himachal.jpg'
        }

        const cats = Array.from(new Set(trips.map(t => t.category))).sort()
        return cats.map(cat => ({
            _id: cat.toLowerCase().replace(/\s+/g, '-'), // Convert to URL-friendly ID
            name: cat,
            image: categoryImageMap[cat] || `/images/${cat.toLowerCase().replace(/\s+/g, '-')}.jpg`
        }))
    }, [])

    const [selectedCategory, setSelectedCategory] = useState(categories[0]?._id || 'all')
    const router = useRouter()

    const filteredCategories = useMemo(() => {
        if (!destination.trim()) return []
        return categories.filter(cat =>
            cat.name.toLowerCase().includes(destination.toLowerCase())
        )
    }, [destination, categories])

    const featuredCards = [
        {
            id: 'spiti',
            slug: 'spiti-valley',
            title: 'Spiti Valley Circuit',
            description: 'Complete exploration of the cold desert mountain valley',
            destination: 'Spiti',
            price: 28000,
            image: '/images/spiti-valley.jpg'
        },
        {
            id: 'himachal',
            slug: 'himachal-adventure',
            title: 'Manali to Leh Highway',
            description: 'Epic road trip through the Himalayan high passes',
            destination: 'Himachal',
            price: 38000,
            image: '/images/himachal.jpg'
        },
        {
            id: 'indonesia',
            slug: 'bali-culture',
            title: 'Bali Island Hopping',
            description: 'Explore major islands of the Indonesian paradise',
            destination: 'Indonesia',
            price: 42000,
            image: '/images/indonesia-dest.jpg'
        }
    ]

    return (
        <div className="relative z-10 md:hidden min-h-screen ">
            {/* Background Pattern */}
            {/* <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-5"></div> */}
            <div className="absolute inset-0 bg-gradient-to-t from-white from-[50%] to-primary to-[100%]"></div>
            {/* [#ff5f2e]/90 */}
            <div className="relative z-10 px-4 pt-20 pb-0 space-y-6">

                <div className="relative">
                    {/* Search Bar */}
                    <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-full pl-4 py-0 shadow-[0_8px_32px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] hover:scale-[1.02] hover:bg-white/30 transition-all duration-300">

                        <div className="flex items-center gap-3">
                            <MapPin className="text-primary" size={30} />

                            <input
                                type="text"
                                placeholder="Explore Best Itineraries"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                className="w-full outline-none bg-transparent text-white placeholder:text-gray-300 text-base"
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
                                        key={cat._id}
                                        onClick={() => {
                                            setDestination('')
                                            router.push(`/category/${cat._id}`)
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
                <div className="overflow-x-auto flex gap-4 [scrollbar-width:none]">
                    {banners.length > 0 ? banners.map((banner) => (
                        <div key={banner._id} className="min-w-[85%] h-auto rounded-3xl bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-md border border-white flex items-center justify-center shadow-lg hover:border-primary/50 transition-all">
                            <div className="text-center">
                                {/* <p className="text-white font-semibold text-lg">{banner.title}</p> */}
                                {banner.image && (
                                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover rounded-3xl" />
                                )}
                            </div>
                        </div>
                    )) : (
                        [1, 2, 3].map((item) => (
                            <div key={item} className="min-w-[85%] h-[40vh] rounded-3xl bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-md border border-primary/30 flex items-center justify-center shadow-lg hover:border-primary/50 transition-all">
                                <span className="text-white font-semibold text-lg">Offer Banner {item}</span>
                            </div>
                        ))
                    )}
                </div>

                {/* Categories */}
                <div className="overflow-x-auto flex gap-4 [scrollbar-width:none] ">
                    {categories.length > 0 ? categories.map((cat) => (
                        <div
                            key={cat._id || cat.name}
                            className="flex flex-col items-center min-w-[80px] cursor-pointer group"
                            onClick={() => router.push(`/category/${cat._id}`)}
                        >
                            <div className={`h-16 w-16 rounded-full backdrop-blur-md border shadow-lg group-hover:scale-105 transition-all flex items-center justify-center ${selectedCategory === cat._id
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
                                className="flex flex-col items-center min-w-[80px] cursor-pointer group"
                            >
                                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/30 to-primary/20 backdrop-blur-md border border-primary/40 shadow-lg group-hover:border-primary/60 transition-all flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">{cat[0]}</span>
                                </div>
                                <p className="text-xs text-white mt-2 font-medium">{cat}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Featured Manual Cards */}
                <div className="space-y-4">
                    <div className="overflow-x-auto flex gap-4 [scrollbar-width:none] pb-8">
                        {featuredCards.map((pkg) => (
                            <div
                                key={pkg.id}
                                onClick={() => {
                                    // Convert destination to category ID (lowercase with hyphens)
                                    const categoryId = pkg.destination.toLowerCase().replace(/\s+/g, '-')
                                    router.push(`/category/${categoryId}/${pkg.slug}`)
                                }}
                                className="group min-w-[260px] cursor-pointer overflow-hidden rounded-3xl border border-white/20 bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col"
                            >
                                {/* Image Container */}
                                <div className="relative h-48 overflow-hidden bg-gray-300">
                                    <img
                                        src={pkg.image}
                                        alt={pkg.title}
                                        className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col grow">
                                    {/* Destination Badge */}
                                    <div className="inline-block mb-3 w-fit px-3 py-1 bg-primary/15 border border-primary/30 rounded-full">
                                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                                            {pkg.destination}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h4 className="text-lg font-bold text-gray-900 line-clamp-2 mb-3 leading-tight group-hover:text-primary transition-colors">
                                        {pkg.title}
                                    </h4>

                                    {/* Description */}
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                                        {pkg.description}
                                    </p>

                                    {/* Price and CTA */}
                                    <div className="mt-auto pt-4 border-t border-gray-200 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">From</p>
                                            <p className="text-lg font-bold text-primary">
                                                ₹{pkg.price.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                            <span className="text-lg">→</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}