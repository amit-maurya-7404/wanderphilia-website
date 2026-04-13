'use client'

import { trips } from '@/lib/data'
import { TripCard } from '@/components/trip-card'

export function UpcomingGroupToursSection() {
  // Get upcoming trips with available spots
  const upcomingTrips = trips
    .filter((trip) => trip.dates.some((date) => date.spots > 0))
    .slice(0, 6)

  return (
    <section className="py-16 md:pt-20 bg-linear-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
            ✨ Limited Spots Available
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Upcoming Group Tours
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join our curated group adventures to amazing destinations. Early bird discounts available!
          </p>
        </div>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingTrips.map((trip) => (
            <TripCard key={trip.id} {...trip} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="/trips"
            className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 transition-colors"
          >
            View All Tours →
          </a>
        </div>
      </div>
    </section>
  )
}
