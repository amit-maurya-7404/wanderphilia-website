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
    { title: 'Meghalaya', region: 'Meghalaya', image: '/images/meghalaya.jpg', price: getCheapestPriceForCategory('meghalaya', 21499) },
  ]

  const internationalRegions = [
    { title: 'Bhutan', region: 'Bhutan', image: '/images/Bhutan_cat.jpg', price: getCheapestPriceForCategory('bhutan', 109900) },
    { title: 'Singapore', region: 'Singapore', image: '/images/singapore.png', price: getCheapestPriceForCategory('singapore', 49900) },
    { title: 'Nepal', region: 'Nepal', image: '/images/everest.jpg', price: getCheapestPriceForCategory('nepal', 99900) },
    { title: 'Indonesia', region: 'Indonesia', image: '/images/bali.jpg', price: getCheapestPriceForCategory('indonesia', 69900) },
    { title: 'Switzerland', region: 'Switzerland', image: '/images/swiss.jpg', price: getCheapestPriceForCategory('switzerland', 129900) },
    { title: 'Peru', region: 'Peru', image: '/images/amazon.jpg', price: getCheapestPriceForCategory('peru', 94900) },
    { title: 'Iceland', region: 'Iceland', image: '/images/iceland.jpg', price: getCheapestPriceForCategory('iceland', 114900) },
    { title: 'Japan', region: 'Japan', image: '/images/japan.jpg', price: getCheapestPriceForCategory('japan', 139900) },
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
                  <div key={item.region} className="min-w-[75%] shrink-0">
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
                  <div key={item.region} className="min-w-[75%] shrink-0">
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