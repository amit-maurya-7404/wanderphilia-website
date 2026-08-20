'use client'

import { useState, useEffect } from 'react'
import { trips, getLowestPriceForTrips } from '@/lib/data'
import { sectionMappings } from '@/lib/section-mappings'

function getCheapestPriceForCategory(categoryId: string, fallbackPrice: number): number {
  const mapping = sectionMappings[categoryId];
  if (!mapping || !mapping.available) return fallbackPrice;
  const activeTrips = trips.filter(t =>
    mapping.available.includes(t.id) &&
    (t.category?.toLowerCase() === categoryId ||
      t.destination?.toLowerCase().includes(categoryId) ||
      t.region?.toLowerCase() === categoryId)
  );
  const price = getLowestPriceForTrips(activeTrips);
  return price > 0 ? price : fallbackPrice;
}
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface TripTypeCardProps {
  title: string
  image: string
  region?: string
  price: number
}

function RegionCard({ title, image, price, region }: TripTypeCardProps) {
  const categoryId = (region || title).toLowerCase().replace(/\s+/g, '-')
  const mapping = sectionMappings[categoryId]
  const tripCount = mapping?.available?.length || 0

  return (
    <Link href={`/trips/${categoryId}`} target="_blank" rel="noopener noreferrer" className="block w-full">
      <div className="group relative overflow-hidden rounded-2xl h-[50vh] md:h-[60vh] cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 w-full hover:-translate-y-1.5 border border-slate-100/50 bg-slate-900">
        {/* Background Image */}
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
        />

        {/* Premium Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

        {/* Top Badges / Info */}
        {tripCount > 0 && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-white/90 backdrop-blur-xs text-[#ff5d09] text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
              {tripCount} {tripCount === 1 ? 'Tour' : 'Tours'}
            </span>
          </div>
        )}

        {/* Bottom Content Area */}
        <div className="absolute inset-0 flex flex-col justify-end p-5 text-white z-10">
          {/* Glass-styled title block */}
          <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            {/* Title with inline arrow */}
            <h3 className="text-xl md:text-2xl font-black tracking-tight mb-1 group-hover:text-orange-400 transition-colors duration-300 flex items-center gap-1.5">
              {title}
              <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 inline-block font-normal text-sm md:text-lg">
                →
              </span>
            </h3>

            {/* Pricing */}
            <p className="text-xs md:text-sm text-slate-200/90 font-medium">
              Starting from <span className="font-extrabold text-white text-sm md:text-base">₹{price.toLocaleString('en-IN')}</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function TripTypesSection() {

  const [isMobile, setIsMobile] = useState(false)
  const [cardsPerView, setCardsPerView] = useState(4)

  const [indiaIndex, setIndiaIndex] = useState(0)
  const [intlIndex, setIntlIndex] = useState(0)

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

  useEffect(() => {
    setIndiaIndex(0)
    setIntlIndex(0)
  }, [cardsPerView])

  const indiaRegions = [
    { title: 'Leh Ladakh', region: 'Leh Ladakh', image: '/images/leh-ladakh.jpg', price: getCheapestPriceForCategory('leh-ladakh', 15800) },
    { title: 'Spiti', region: 'Spiti', image: '/images/spiti-valley.jpg', price: getCheapestPriceForCategory('spiti', 24499) },
    { title: 'Himachal', region: 'Himachal', image: '/images/himachal.jpg', price: getCheapestPriceForCategory('himachal', 6999) },
    { title: 'Kashmir', region: 'Kashmir', image: '/images/kashmir.jpg', price: getCheapestPriceForCategory('kashmir', 24499) },
    { title: 'Sikkim', region: 'Sikkim', image: '/images/sikkim.png', price: getCheapestPriceForCategory('sikkim', 21999) },
  ]

  const internationalRegions = [
    { title: 'Vietnam', region: 'Vietnam', image: '/images/vietnam.png', price: getCheapestPriceForCategory('vietnam', 32999) },
    { title: 'Bhutan', region: 'Bhutan', image: '/images/Bhutan_cat.jpg', price: getCheapestPriceForCategory('bhutan', 109900) },
    { title: 'Singapore', region: 'Singapore', image: '/images/singapore.png', price: getCheapestPriceForCategory('singapore', 49900) },
    { title: 'Thailand', region: 'Thailand', image: '/images/thailand.jpg', price: getCheapestPriceForCategory('thailand', 99900) },
    { title: 'Bali', region: 'Bali', image: '/images/bali.jpg', price: getCheapestPriceForCategory('bali', 23999) },
  ]

  const maxIndia = Math.max(0, indiaRegions.length - cardsPerView)
  const maxIntl = Math.max(0, internationalRegions.length - cardsPerView)

  return (
    <section className="py-20  ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= INDIA ================= */}
        <div id="india-trips" className="mb-20 text-center scroll-mt-20">

          <h2 className="text-4xl md:text-5xl font-bold mb-10">India Trips</h2>

          <div className="relative">

            {isMobile ? (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {indiaRegions.map((item) => (
                  <div key={item.region} className="w-[90%] shrink-0">
                    <RegionCard {...item} />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <button
                  onClick={() => setIndiaIndex((p) => Math.max(p - 1, 0))}
                  disabled={indiaIndex === 0}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={() => setIndiaIndex((p) => Math.min(p + 1, maxIndia))}
                  disabled={indiaIndex === maxIndia}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40"
                >
                  <ChevronRight size={20} />
                </button>

                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateX(-${indiaIndex * (100 / cardsPerView)}%)`,
                    }}
                  >
                    {indiaRegions.map((item) => (
                      <div key={item.region} className="shrink-0 basis-1/4 p-2">
                        <RegionCard {...item} />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ================= INTERNATIONAL ================= */}
        <div id="international-trips" className="text-center scroll-mt-20">

          <h2 className="text-4xl md:text-5xl font-bold mb-10">International Trips</h2>

          <div className="relative">

            {isMobile ? (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {internationalRegions.map((item) => (
                  <div key={item.region} className="w-[90%] shrink-0">
                    <RegionCard {...item} />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <button
                  onClick={() => setIntlIndex((p) => Math.max(p - 1, 0))}
                  disabled={intlIndex === 0}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={() => setIntlIndex((p) => Math.min(p + 1, maxIntl))}
                  disabled={intlIndex === maxIntl}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40"
                >
                  <ChevronRight size={20} />
                </button>

                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateX(-${intlIndex * (100 / cardsPerView)}%)`,
                    }}
                  >
                    {internationalRegions.map((item) => (
                      <div key={item.region} className="shrink-0 basis-1/4 p-2">
                        <RegionCard {...item} />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </section>
  )
}