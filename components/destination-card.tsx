import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface DestinationCardProps {
  title: string
  image: string
  description: string
  tripCount: number
  slug: string
}

export function DestinationCard({
  title,
  image,
  description,
  tripCount,
  slug,
}: DestinationCardProps) {
  return (
    <Link href={`/trips?destination=${slug}`} target="_blank" rel="noopener noreferrer">
      <div className="group relative overflow-hidden rounded-3xl h-96 cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
        {/* Background Image */}
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-125 transition-transform duration-700"
        />

        {/* Premium Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/0 opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        {/* Accent line on hover */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
          {/* Badge */}
          <div className="mb-6 inline-block w-fit px-4 py-2 bg-primary/20 backdrop-blur-sm border border-primary/40 rounded-full">
            <span className="text-xs text-primary font-bold uppercase tracking-widest">
              {tripCount} {tripCount === 1 ? 'Adventure' : 'Adventures'}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-3xl md:text-4xl font-bold mb-3 group-hover:text-primary transition-colors duration-300 leading-tight">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-200 mb-6 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-white/80 group-hover:text-primary transition-colors">
              Explore
            </span>
            <ArrowRight
              size={20}
              className="group-hover:translate-x-3 group-hover:text-primary transition-all"
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
