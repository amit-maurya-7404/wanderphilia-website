'use client'

import { Heart, MapPin, Calendar, Users, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface HoneymoonPackageCardProps {
  id: string
  title: string
  destination: string
  image: string
  price: number
  duration: number
  rating: number
  groupSize: number
  slug: string
  highlights: string[]
}

export function HoneymoonPackageCard({
  id,
  title,
  destination,
  image,
  price,
  duration,
  rating,
  groupSize,
  slug,
  highlights,
}: HoneymoonPackageCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-gray-100">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-200">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Luxury Badge */}
        <div className="absolute top-4 left-4 bg-linear-to-r from-pink-500 to-rose-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
          💎 Honeymoon Special
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
        >
          <Heart
            size={20}
            className={`transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
        </button>

        {/* Rating Badge */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-full">
          <Star size={16} className="fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold">{rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 grow flex flex-col">
        <div className="mb-3">
          <p className="text-pink-500 text-sm font-semibold mb-1">Romantic Getaway</p>
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{title}</h3>
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <MapPin size={18} className="text-pink-500" />
            <span className="text-sm font-medium">{destination}</span>
          </div>
        </div>

        {/* Highlights */}
        <div className="mb-4 grow">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Highlights</p>
          <ul className="space-y-1">
            {highlights.slice(0, 3).map((highlight, idx) => (
              <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-pink-500 mt-1">✨</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Details Row */}
        <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-200">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Duration</p>
            <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
              <Calendar size={16} className="text-pink-500" />
              {duration} Days
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Group Size</p>
            <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
              <Users size={16} className="text-pink-500" />
              {groupSize} Couples
            </p>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase mb-1">From</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{(price / 100000).toFixed(1)}L
            </p>
          </div>
          <Link href={`/trips/${slug}`} target="_blank" rel="noopener noreferrer">
            <Button className="bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold">
              Explore
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
