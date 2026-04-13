import Image from 'next/image'
import { Star } from 'lucide-react'

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  image: string
  rating: number
  trip: string
}

export function TestimonialCard({
  quote,
  author,
  role,
  image,
  rating,
  trip,
}: TestimonialCardProps) {
  return (
    <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 hover:border-primary/20">
      {/* Top Border Accent */}
      <div className="w-12 h-1 bg-primary rounded-full mb-6" />

      {/* Rating Stars */}
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={18}
            className={`transition-colors ${
              i < rating
                ? 'fill-primary text-primary'
                : 'text-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-gray-700 mb-8 leading-relaxed text-base font-medium">
        &quot;{quote}&quot;
      </p>

      {/* Trip Tag */}
      <div className="mb-6 inline-block px-3 py-1 bg-primary/10 rounded-full">
        <p className="text-xs text-primary font-bold uppercase tracking-wide">
          {trip}
        </p>
      </div>

      {/* Author Section */}
      <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
        <Image
          src={image}
          alt={author}
          width={56}
          height={56}
          className="rounded-full object-cover ring-2 ring-primary/20"
        />
        <div>
          <p className="font-bold text-gray-900 text-base">{author}</p>
          <p className="text-gray-500 text-sm">{role}</p>
        </div>
      </div>
    </div>
  )
}
