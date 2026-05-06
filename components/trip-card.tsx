'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import type { Trip } from '@/lib/data'
import { gtag } from '@/lib/gtag'

type TripCardProps = Trip

export function TripCard({
  title,
  image,
  destination,
  duration,
  price,
  rating,
  slug,
  category,
  itinerary,
  costingDetails,
}: TripCardProps) {
  const [callbackOpen, setCallbackOpen] = useState(false)
  const ignoreClickRef = useRef(false)

  const lowestPrice = costingDetails?.length
    ? costingDetails
        .map((item) => {
          const match = item.value.match(/[\d,]+/)
          return match ? parseInt(match[0].replace(/,/g, ''), 10) : NaN
        })
        .filter((value) => !Number.isNaN(value) && value > 0)
        .reduce((min, value) => Math.min(min, value), Infinity)
    : price

  const displayPrice = Number.isFinite(lowestPrice) ? lowestPrice : price
  const routeSummary = itinerary?.length
    ? itinerary.slice(0, 4).map((day) => `${day.day}D ${day.title}`).join(' • ') + (itinerary.length > 4 ? ` • +${itinerary.length - 4}` : '')
    : destination

  // Convert category to URL-friendly ID
  const categoryId = category?.toLowerCase().replace(/\s+/g, '-') || 'all'

  return (
    <div
      onClick={() => {
        if (callbackOpen || ignoreClickRef.current) return
        gtag.event({
          action: 'click',
          category: 'Navigation',
          label: `Trip Card: ${title}`,
        });
        window.open(`/trips/${categoryId}/${slug}`, '_blank')
      }}
      className="group relative overflow-hidden rounded-lg shadow-xl h-[50vh] md:h-[60vh] cursor-pointer"
    >
      {/* IMAGE */}
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-700"
      />

      {/* DARK GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

      {/* TOP PRICE BADGE */}
      <div className="absolute top-4 left-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
        ₹{displayPrice.toLocaleString('en-IN')} onwards
      </div>

      {/* BOTTOM CONTENT */}
      <div className="absolute bottom-0 w-full p-4 text-white">

        {/* TITLE */}
        <h3 className="text-md font-bold leading-snug line-clamp-2">
          {title}
        </h3>

        {/* ROUTE / TAG */}
        <p className="text-xs text-gray-300 mt-1 line-clamp-1">
          {routeSummary}
        </p>

        {/* DETAILS ROW */}
        <div className="flex items-center justify-between mt-3 text-xs">
          <span>🕒 {duration}D / {duration - 1}N</span>
          <span>⭐ {rating.toFixed(1)}</span>
        </div>

        {/* DATE / LOCATION */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-300">
          <span>{destination}</span>
        </div>
      </div>
    </div>
  )
}
