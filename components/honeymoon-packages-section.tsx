'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { trips, getLowestPriceForTrips } from '@/lib/data'
import { getAllCategories } from '@/lib/trip-categories'
import { sectionMappings } from '@/lib/section-mappings'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

interface CategorySliderCardProps {
  id: string
  name: string
  image: string
  price: number
  tripCount: number
}

function CategorySliderCard({ id, name, image, price, tripCount }: CategorySliderCardProps) {
  return (
    <Link href={`/trips/${id}`} target="_blank" rel="noopener noreferrer">
      <div className="group relative overflow-hidden rounded-xl h-[50vh] md:h-[60vh] cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500 w-full hover:-translate-y-2">
        {/* Background Image */}
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Premium Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-300" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          {/* Tour Count above name */}
          <span className="text-[10px] md:text-xs text-pink-400 font-bold uppercase tracking-wider mb-1">
            {tripCount} {tripCount === 1 ? 'Tour' : 'Tours'} Available
          </span>

          {/* Title */}
          <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
            {name}
          </h3>

          {/* Pricing */}
          <p className="text-sm text-gray-200">
            Starting ₹ {price.toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </Link>
  )
}

export function HoneymoonPackagesSection() {
  const pathname = usePathname()
  const isHoneymoonPage = pathname === '/honeymoon'

  const [isMobile, setIsMobile] = useState(false)
  const [cardsPerView, setCardsPerView] = useState(4)

  const [indiaIndex, setIndiaIndex] = useState(0)
  const [intlIndex, setIntlIndex] = useState(0)
  const [combinedIndex, setCombinedIndex] = useState(0)

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
    setCombinedIndex(0)
  }, [cardsPerView])

  const allCategories = getAllCategories()

  const indiaAllowed = ['sikkim', 'kashmir', 'himachal']
  const intlAllowed = ['singapore', 'thailand', 'bhutan', 'vietnam', 'bali']
  const combinedAllowed = ['singapore', 'sikkim', 'thailand', 'kashmir', 'himachal', 'bhutan', 'vietnam', 'bali']

  const getCategoryDetails = (allowedIds: string[]) => {
    return allowedIds
      .map(id => allCategories.find(c => c.id === id))
      .filter((c): c is typeof allCategories[number] => Boolean(c))
      .map(cat => {
        const categoryTrips = trips.filter(t =>
          t.category.trim().toLowerCase() === cat.name.toLowerCase() ||
          t.category.trim().toLowerCase() === cat.id
        )
        const price = getLowestPriceForTrips(categoryTrips)
        const mappingCount = sectionMappings[cat.id]?.available?.length || 0
        return {
          id: cat.id,
          name: cat.name,
          image: cat.image,
          price: price > 0 ? price : 15000,
          tripCount: mappingCount
        }
      })
  }

  const indiaCategories = getCategoryDetails(indiaAllowed)
  const intlCategories = getCategoryDetails(intlAllowed)
  const combinedCategories = getCategoryDetails(combinedAllowed)

  const maxIndia = Math.max(0, indiaCategories.length - cardsPerView)
  const maxIntl = Math.max(0, intlCategories.length - cardsPerView)
  const maxCombined = Math.max(0, combinedCategories.length - cardsPerView)

  return (
    <section className="py-16 md:pt-0 bg-linear-to-b from-white via-pink-50/10 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-pink-100 text-pink-700 font-semibold text-sm mb-4">
            💕 Romantic Getaways
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Honeymoon Destinations
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create unforgettable memories with your loved one. Choose a romantic destination to see our exclusive packages.
          </p>
        </div>

        {!isHoneymoonPage ? (
          /* ================= HOMEPAGE COMBINED SLIDER ================= */
          <div className="relative px-2">
            {/* Left Button */}
            {!isMobile && combinedCategories.length > cardsPerView && (
              <button
                onClick={() => setCombinedIndex(p => Math.max(p - 1, 0))}
                disabled={combinedIndex === 0}
                className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-white/95 text-slate-800 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition disabled:opacity-40 border border-slate-100 cursor-pointer"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Right Button */}
            {!isMobile && combinedCategories.length > cardsPerView && (
              <button
                onClick={() => setCombinedIndex(p => Math.min(p + 1, maxCombined))}
                disabled={combinedIndex === maxCombined}
                className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-white/95 text-slate-800 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition disabled:opacity-40 border border-slate-100 cursor-pointer"
              >
                <ChevronRight size={24} />
              </button>
            )}

            {isMobile ? (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {combinedCategories.map((cat) => (
                  <div key={cat.id} className="w-[90%] shrink-0">
                    <CategorySliderCard {...cat} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${combinedIndex * (100 / cardsPerView)}%)`,
                  }}
                >
                  {combinedCategories.map((cat) => (
                    <div key={cat.id} className="flex-shrink-0 basis-1/4 p-2">
                      <CategorySliderCard {...cat} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ================= MAIN PAGE SEPARATED SLIDERS ================= */
          <>
            {/* ================= INDIA ================= */}
            <div className="mb-24">
              {/* Centered Subheading with premium accents */}
              <div className="text-center mb-12 max-w-xl mx-auto">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-8 h-0.5 bg-pink-400 rounded-full" />
                  <span className="text-pink-600 font-semibold text-xs tracking-widest uppercase">Romantic Escape</span>
                  <div className="w-8 h-0.5 bg-pink-400 rounded-full" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900">India Honeymoon Getaways</h3>
              </div>

              <div className="relative px-2">
                {/* Left Button */}
                {!isMobile && indiaCategories.length > cardsPerView && (
                  <button
                    onClick={() => setIndiaIndex(p => Math.max(p - 1, 0))}
                    disabled={indiaIndex === 0}
                    className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-white/95 text-slate-800 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition disabled:opacity-40 border border-slate-100 cursor-pointer"
                  >
                    <ChevronLeft size={24} />
                  </button>
                )}

                {/* Right Button */}
                {!isMobile && indiaCategories.length > cardsPerView && (
                  <button
                    onClick={() => setIndiaIndex(p => Math.min(p + 1, maxIndia))}
                    disabled={indiaIndex === maxIndia}
                    className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-white/95 text-slate-800 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition disabled:opacity-40 border border-slate-100 cursor-pointer"
                  >
                    <ChevronRight size={24} />
                  </button>
                )}

                {isMobile ? (
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {indiaCategories.map((cat) => (
                      <div key={cat.id} className="w-[90%] shrink-0">
                        <CategorySliderCard {...cat} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${indiaIndex * (100 / cardsPerView)}%)`,
                      }}
                    >
                      {indiaCategories.map((cat) => (
                        <div key={cat.id} className="flex-shrink-0 basis-1/4 p-2">
                          <CategorySliderCard {...cat} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ================= INTERNATIONAL ================= */}
            <div className="mb-16">
              {/* Centered Subheading with premium accents */}
              <div className="text-center mb-12 max-w-xl mx-auto">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-8 h-0.5 bg-pink-400 rounded-full" />
                  <span className="text-pink-600 font-semibold text-xs tracking-widest uppercase">Global Romance</span>
                  <div className="w-8 h-0.5 bg-pink-400 rounded-full" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900">International Honeymoon Getaways</h3>
              </div>

              <div className="relative px-2">
                {/* Left Button */}
                {!isMobile && intlCategories.length > cardsPerView && (
                  <button
                    onClick={() => setIntlIndex(p => Math.max(p - 1, 0))}
                    disabled={intlIndex === 0}
                    className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-white/95 text-slate-800 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition disabled:opacity-40 border border-slate-100 cursor-pointer"
                  >
                    <ChevronLeft size={24} />
                  </button>
                )}

                {/* Right Button */}
                {!isMobile && intlCategories.length > cardsPerView && (
                  <button
                    onClick={() => setIntlIndex(p => Math.min(p + 1, maxIntl))}
                    disabled={intlIndex === maxIntl}
                    className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-white/95 text-slate-800 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition disabled:opacity-40 border border-slate-100 cursor-pointer"
                  >
                    <ChevronRight size={24} />
                  </button>
                )}

                {isMobile ? (
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {intlCategories.map((cat) => (
                      <div key={cat.id} className="w-[90%] shrink-0">
                        <CategorySliderCard {...cat} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${intlIndex * (100 / cardsPerView)}%)`,
                      }}
                    >
                      {intlCategories.map((cat) => (
                        <div key={cat.id} className="flex-shrink-0 basis-1/4 p-2">
                          <CategorySliderCard {...cat} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* CTA */}
        {!isHoneymoonPage && (
          <div className="mt-16 text-center">
            <Link
              href="/honeymoon"
              className="inline-block px-8 py-3 bg-linear-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full hover:from-pink-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 duration-300"
            >
              View All Honeymoon Escapes →
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
