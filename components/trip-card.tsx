import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, Users } from 'lucide-react'

interface TripCardProps {
  id: string
  title: string
  image: string
  destination: string
  duration: number
  price: number
  rating: number
  difficulty: 'Easy' | 'Moderate' | 'Hard'
  slug: string
}

export function TripCard({
  id,
  title,
  image,
  destination,
  duration,
  price,
  rating,
  difficulty,
  slug,
}: TripCardProps) {
  const difficultyColor =
    difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
    difficulty === 'Moderate' ? 'bg-amber-100 text-amber-700' :
    'bg-rose-100 text-rose-700'

  return (
    <Link href={`/trips/${slug}`}>
      <div className="group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white h-full flex flex-col hover:-translate-y-2">
        {/* Image Container with Premium Overlay */}
        <div className="relative h-64 overflow-hidden bg-gray-300">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-125 transition-transform duration-700"
          />
          {/* Gradient Overlay. .*/}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Rating Badge - Positioned on Image .*/}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
            <span className="text-sm font-bold text-gray-900">{rating}</span>
            <span className="text-primary text-lg">★</span>
          </div>

          {/* Difficulty Badge */}
          <div className="absolute bottom-4 left-4">
            <Badge className={`${difficultyColor} text-xs font-semibold px-3 py-1`}>
              {difficulty}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col grow">
          {/* Destination */}
          <div className="flex items-center gap-2 text-sm text-primary font-semibold mb-2 uppercase tracking-wide">
            <MapPin size={16} />
            <span>{destination}</span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-4 leading-tight">
            {title}
          </h3>

          {/* Duration */}
          <div className="flex items-center gap-2 text-gray-600 text-sm mb-6">
            <Calendar size={16} className="text-primary/60" />
            <span>{duration} days • Round trip</span>
          </div>

          {/* Price and CTA */}
          <div className="mt-auto pt-6 border-t border-gray-200 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 mb-1">Starting from</p>
              <span className="text-2xl font-bold text-primary">
                ₹{price.toLocaleString('en-IN')}
              </span>
            </div>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold px-4"
            >
              Explore
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}
