import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TripCard } from '@/components/trip-card'
import { trips } from '@/lib/data'

export function FeaturedTripsSection() {
  const featuredTrips = trips.slice(0, 3)

  return (
    <section id="featured" className="mt-[10vw] md:mt-[5vw] px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center items-center justify-center ">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-1 bg-primary rounded-full" />
            <span className="text-primary font-semibold text-sm tracking-widest uppercase">
              Curated Experiences
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Featured Adventures
          </h2>
          <p className="text-xl text-center text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Handpicked journeys designed for explorers who demand more. Each trip is carefully curated to deliver unforgettable memories and authentic experiences.
          </p>
        </div>

        {/* Trip Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredTrips.map((trip) => (
            <TripCard
              key={trip.id}
              {...trip}
            />
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Button asChild className="hidden  md:flex w-[14vw]  mt-0 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-semibold h-auto">
            <Link href="/trips?type=International">Explore All</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
