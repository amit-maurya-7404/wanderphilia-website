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

  return (
    <Link href={`/trips/${categoryId}`} target="_blank" rel="noopener noreferrer">
      <div className="group relative overflow-hidden rounded-xl h-[50vh] md:h-[60vh] cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500 w-full hover:-translate-y-2">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-70 group-hover:opacity-85 transition-opacity" />

        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-200">
            Starting ₹ {price.toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </Link>
  )
}

export function IndiaTripsSection() {
  const [isMobile, setIsMobile] = useState(false)
  const [cardsPerView, setCardsPerView] = useState(4)
  const [index, setIndex] = useState(0)

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
    setIndex(0)
  }, [cardsPerView])

  const indiaRegions = [
    { title: 'Ladakh', region: 'Leh Ladakh', image: '/images/leh-ladakh.jpg', price: getCheapestPriceForCategory('leh-ladakh', 15800) },
    { title: 'Spiti', region: 'Spiti', image: '/images/spiti-valley.jpg', price: getCheapestPriceForCategory('spiti', 24499) },
    { title: 'Himachal', region: 'Himachal', image: '/images/himachal.jpg', price: getCheapestPriceForCategory('himachal', 6999) },
    { title: 'Kashmir', region: 'Kashmir', image: '/images/kashmir.jpg', price: getCheapestPriceForCategory('kashmir', 24499) },
    { title: 'Meghalaya', region: 'Meghalaya', image: '/images/meghalaya.jpg', price: getCheapestPriceForCategory('meghalaya', 21499) },
  ]

  const maxIndex = Math.max(0, indiaRegions.length - cardsPerView)

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div id="india-trips" className="mb-20 text-center scroll-mt-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-10">India Trips</h2>

          <div className="relative">
            {isMobile ? (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {indiaRegions.map((item) => (
                  <div key={item.region} className="min-w-[75%] shrink-0">
                    <RegionCard {...item} />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <button
                  onClick={() => setIndex((p) => Math.max(p - 1, 0))}
                  disabled={index === 0}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={() => setIndex((p) => Math.min(p + 1, maxIndex))}
                  disabled={index === maxIndex}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-40"
                >
                  <ChevronRight size={20} />
                </button>

                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateX(-${index * (100 / cardsPerView)}%)`,
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
      </div>
    </section>
  )
}
