'use client'

import React, { useMemo, useState, useEffect } from 'react'
import Image from 'next/image'
import type { Trip } from '@/lib/data'

interface DurationFilterProps {
  trips: Trip[]
  selectedDuration: number | null // This will represent the selected nights
  onChange: (nights: number | null) => void
}

const categoryFallbackImages: Record<string, string> = {
  'bhutan': '/images/Bhutan_cat.jpg',
  'nepal': '/images/nepal-dest.jpg',
  'thailand': '/images/thailand.jpg',
  'indonesia': '/images/indonesia-dest.jpg',
  'bali': '/images/bali.jpg',
  'switzerland': '/images/switzerland-dest.jpg',
  'peru': '/images/peru-dest.jpg',
  'japan': '/images/japan.jpg',
  'ladakh': '/images/leh-ladakh.jpg',
  'leh-ladakh': '/images/leh-ladakh.jpg',
  'spiti': '/images/spiti-valley.jpg',
  'kashmir': '/images/kashmir.jpg',
  'meghalaya': '/images/meghalaya.jpg',
  'himachal': '/images/himachal.jpg',
  'singapore': '/images/singapore.png',
  'sikkim': '/images/sikkim.png',
  'vietnam': '/images/vietnam.png',
}

function getTripLowestPrice(trip: Trip): number {
  const lowestPrice = trip.costingDetails?.length
    ? trip.costingDetails
        .map((item) => {
          const match = item.value.match(/[\d,]+/)
          return match ? parseInt(match[0].replace(/,/g, ''), 10) : NaN
        })
        .filter((value) => !Number.isNaN(value) && value > 0)
        .reduce((min, value) => Math.min(min, value), Infinity)
    : trip.price

  return Number.isFinite(lowestPrice) ? lowestPrice : trip.price
}

function DurationCard({
  item,
  isSelected,
  onClick,
  categoryFallback,
}: {
  item: { nights: number; cheapestPrice: number; image: string }
  isSelected: boolean
  onClick: () => void
  categoryFallback: string
}) {
  const [imageSrc, setImageSrc] = useState(item.image || categoryFallback)

  // Sync state if item.image or categoryFallback changes
  useEffect(() => {
    setImageSrc(item.image || categoryFallback)
  }, [item.image, categoryFallback])

  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 w-[140px] md:w-[160px] cursor-pointer group select-none"
    >
      {/* Image container */}
      <div
        className={`relative h-[100px] md:h-[120px] rounded-2xl overflow-hidden bg-slate-900 transition-all duration-300 ${
          isSelected
            ? 'ring-3 ring-[#ff6e0b] ring-offset-2 scale-[0.98]'
            : 'hover:scale-[1.02] hover:shadow-md'
        }`}
      >
        <Image
          src={imageSrc}
          alt={`${item.nights} Nights Tour`}
          fill
          className="object-cover opacity-85 group-hover:opacity-95 transition-opacity duration-300"
          sizes="(max-width: 768px) 140px, 160px"
          onError={() => {
            if (imageSrc !== categoryFallback) {
              setImageSrc(categoryFallback)
            } else if (imageSrc !== '/images/dummy1.jpg') {
              setImageSrc('/images/dummy1.jpg')
            }
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        {/* Nights text */}
        <span className="absolute bottom-3 left-3 text-white text-base md:text-lg font-black tracking-tight drop-shadow-md">
          {item.nights} {item.nights === 1 ? 'night' : 'nights'}
        </span>
      </div>

      {/* Info labels outside card */}
      <div className="mt-3 px-1">
        <span className="block text-[10px] md:text-xs text-gray-400 font-medium leading-none mb-1">
          {item.cheapestPrice > 0 ? 'Starting From' : 'Price'}
        </span>
        <span className="block text-xs md:text-sm font-extrabold text-gray-900 leading-none">
          {item.cheapestPrice > 0 ? `₹${item.cheapestPrice.toLocaleString('en-IN')}` : 'On Request'}
        </span>
      </div>
    </div>
  )
}

export function DurationFilter({ trips, selectedDuration, onChange }: DurationFilterProps) {
  // Compute cheapest trip for each nights duration dynamically for range 5 to 11 nights
  const durationItems = useMemo(() => {
    const fixedNights = [5, 6, 7, 8, 9, 10, 11]

    return fixedNights.map((nightCount) => {
      // Find trips matching this night count
      const matchingTrips = trips.filter((trip) => {
        const tripNights = trip.nights !== undefined ? trip.nights : (trip.duration ? trip.duration - 1 : 0)
        return tripNights === nightCount
      })

      if (matchingTrips.length === 0) {
        return {
          nights: nightCount,
          cheapestPrice: 0,
          image: '',
        }
      }

      // Find the cheapest trip among matching ones
      let cheapestTrip = matchingTrips[0]
      let lowestPrice = getTripLowestPrice(cheapestTrip)

      matchingTrips.forEach((trip) => {
        const price = getTripLowestPrice(trip)
        if (price > 0 && (lowestPrice === 0 || price < lowestPrice)) {
          cheapestTrip = trip
          lowestPrice = price
        }
      })

      return {
        nights: nightCount,
        cheapestPrice: lowestPrice,
        image: cheapestTrip.image,
      }
    })
  }, [trips])

  // Get category from first trip to determine fallback image
  const firstTripCategory = trips[0]?.category?.toLowerCase().trim() || ''
  const categoryFallback = categoryFallbackImages[firstTripCategory] || '/images/dummy1.jpg'

  if (trips.length === 0) return null

  return (
    <div className="w-full py-8 border-b border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
            Choose Trip Duration
          </h2>
          {selectedDuration !== null && (
            <button
              onClick={() => onChange(null)}
              className="text-sm font-semibold text-[#ff6e0b] hover:text-[#e05f00] transition-colors cursor-pointer"
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* Scrollable list of cards */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:-mx-0 md:px-0">
          {durationItems.map((item) => {
            const isSelected = selectedDuration === item.nights
            return (
              <DurationCard
                key={item.nights}
                item={item}
                isSelected={isSelected}
                onClick={() => onChange(isSelected ? null : item.nights)}
                categoryFallback={categoryFallback}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
