'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { trips } from '@/lib/data'

interface TripTypeCardProps {
  title: string
  image: string
  region?: string
  price: number
  slug: string
}

function RegionCard({ title, image, price, region, slug }: TripTypeCardProps) {
  return (
    <Link href={`/trips?region=${region || title}`}>
      <div className="group relative overflow-hidden rounded-3xl h-72 cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500 flex-shrink-0 w-80 hover:-translate-y-2">
        {/* Background Image */}
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/0 opacity-70 group-hover:opacity-85 transition-opacity" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          <h3 className="text-3xl font-bold mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-200 mb-4">
            Starting Price ₹ {price.toLocaleString('en-IN')}/
          </p>
        </div>
      </div>
    </Link>
  )
}

export function TripTypesSection() {
  const indiaTrips = trips.filter(trip => trip.tripType === 'India')
  const internationalTrips = trips.filter(trip => trip.tripType === 'International')

  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  // Group India trips by region
  const indiaRegions = [
    { title: 'Leh Ladakh', region: 'Leh Ladakh', image: '/images/leh-ladakh.jpg', price: 15800 },
    { title: 'Spiti', region: 'Spiti', image: '/images/spiti-valley.jpg', price: 24499 },
    { title: 'Kashmir', region: 'Kashmir', image: '/images/kashmir.jpg', price: 24499 },
    { title: 'Meghalaya', region: 'Meghalaya', image: '/images/meghalaya.jpg', price: 21499 },
    { title: 'Himachal', region: 'Himachal', image: '/images/himachal.jpg', price: 6999 },
  ]

  const internationalRegions = [
    { title: 'Nepal', region: 'Nepal', image: '/images/everest.jpg', price: 99900 },
    { title: 'Indonesia', region: 'Indonesia', image: '/images/bali.jpg', price: 69900 },
    { title: 'Switzerland', region: 'Switzerland', image: '/images/swiss.jpg', price: 129900 },
    { title: 'Peru', region: 'Peru', image: '/images/amazon.jpg', price: 94900 },
    { title: 'Iceland', region: 'Iceland', image: '/images/iceland.jpg', price: 114900 },
  ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* India Trips Section */}
        <div className="mb-20 text-center">
          <div className="flex items-center justify-center mb-12">
            <div>
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-1 bg-primary rounded-full" />
                <span className="text-primary text-center font-semibold text-sm tracking-widest uppercase">
                  Explore India
                </span>
                <div className="w-12 h-1 bg-primary rounded-full" />
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                India Trips
              </h2>
              <p className="text-xl text-gray-600 mt-4 max-w-2xl">
                A Journey Through Time, Colour And Culture
              </p>
            </div>

          </div>

          {/* Carousel */}
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto pb-4 scroll-smooth"
              style={{ scrollBehavior: 'smooth' }}
            >
              {indiaRegions.map((region) => (
                <RegionCard key={region.region} {...region} slug="" />
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={() => scroll('left')}
              className="absolute -left-6 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-white p-3 rounded-full shadow-lg transition-all hover:shadow-xl z-10 hidden lg:flex items-center justify-center"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="absolute -right-6 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-white p-3 rounded-full shadow-lg transition-all hover:shadow-xl z-10 hidden lg:flex items-center justify-center"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          <div className="flex justify-center">
            <Button asChild className="hidden  md:flex w-[14vw]  mt-8 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-semibold h-auto">
              <Link href="/trips?type=International">Explore All</Link>
            </Button>
          </div>

          <Button asChild className="md:hidden w-full bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-semibold h-auto mt-6">
            <Link href="/trips?type=India">Explore All India Trips</Link>
          </Button>
        </div>

        {/* International Trips Section */}
        <div>
          <div className="flex items-center justify-center mb-12">
            <div>
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-1 bg-primary rounded-full" />
                <span className="text-primary text-center font-semibold text-sm tracking-widest uppercase">
                  Beyond Borders
                </span>
                <div className="w-12 h-1 bg-primary rounded-full" />
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                International Trips
              </h2>
              <p className="text-xl text-gray-600 mt-4 max-w-2xl">
                Discover the World&apos;s Most Extraordinary Destinations
              </p>
            </div>

          </div>

          {/* Carousel */}
          <div className="relative">
            <div
              className="flex gap-6 overflow-x-auto pb-4 scroll-smooth"
              style={{ scrollBehavior: 'smooth' }}
            >
              {internationalRegions.map((region) => (
                <RegionCard key={region.region} {...region} slug="" />
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={() => scroll('left')}
              className="absolute -left-6 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-white p-3 rounded-full shadow-lg transition-all hover:shadow-xl z-10 hidden lg:flex items-center justify-center"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="absolute -right-6 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-white p-3 rounded-full shadow-lg transition-all hover:shadow-xl z-10 hidden lg:flex items-center justify-center"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          <div className="flex justify-center">
            <Button asChild className="hidden  md:flex w-[14vw]  mt-8 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-semibold h-auto">
              <Link href="/trips?type=International">Explore All</Link>
            </Button>
          </div>

          <Button asChild className="md:hidden w-full bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-semibold h-auto mt-6">
            <Link href="/">Explore All International Trips</Link>
            {/* trips?type=International */}
          </Button>
        </div>
      </div>
    </section>
  )
}
