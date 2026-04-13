'use client'

import { trips } from '@/lib/data'
import { HoneymoonPackageCard } from '@/components/honeymoon-package-card'

export function HoneymoonPackagesSection() {
  // Filter trips suitable for honeymoon (easy and moderate difficulty)
  const honeymoonPackages = trips
    .filter((trip) => trip.difficulty !== 'Hard' && trip.groupSize <= 20)
    .slice(0, 3)

  return (
    <section className="py-16 md:pt-10 bg-linear-to-b from-white via-pink-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-pink-100 text-pink-700 font-semibold text-sm mb-4">
            💕 Romantic Getaways
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Honeymoon Packages
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create unforgettable memories with your loved one. Our exclusive honeymoon packages offer luxury, romance, and adventure.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {honeymoonPackages.map((trip) => (
            <HoneymoonPackageCard
              key={trip.id}
              id={trip.id}
              title={trip.title}
              destination={trip.destination}
              image={trip.image}
              price={trip.price}
              duration={trip.duration}
              rating={trip.rating}
              groupSize={trip.groupSize}
              slug={trip.slug}
              highlights={trip.highlights}
            />
          ))}
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '🛏️', title: 'Luxury Stays', desc: 'Premium resorts and romantic hotels' },
            { icon: '🍽️', title: 'Gourmet Dining', desc: 'Fine dining and local cuisine experiences' },
            { icon: '💇', title: 'Spa & Wellness', desc: 'Couples spa treatments and relaxation' },
          ].map((feature, idx) => (
            <div key={idx} className="text-center">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-linear-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full hover:from-pink-600 hover:to-rose-600 transition-all"
          >
            Plan Your Honeymoon →
          </a>
        </div>
      </div>
    </section>
  )
}
