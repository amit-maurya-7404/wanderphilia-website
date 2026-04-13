import { DestinationCard } from '@/components/destination-card'
import { destinations } from '@/lib/data'

export function DestinationsSection() {
  return (
    <section className="py-13 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-1 bg-primary rounded-full" />
            <span className="text-primary font-semibold text-sm tracking-widest uppercase">
              World Awaits
            </span>
            <div className="w-12 h-1 bg-primary rounded-full" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Trending Destinations
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            From ancient temples to untamed wilderness, discover the world&apos;s most extraordinary destinations curated by our travel experts.
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination) => (
            <DestinationCard
              key={destination.slug}
              {...destination}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
