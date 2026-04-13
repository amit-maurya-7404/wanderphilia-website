import { Heart, Settings, CheckCircle } from 'lucide-react'

const features = [
  {
    icon: Heart,
    title: 'Energetic & Supportive Trip Captains',
    description: 'At Wanderphilia, Our trip captains are not just guides — they are the heart of every journey. With their positive energy, local insights, and passion for travel, they ensure the entire group feels comfortable, connected, and excited throughout the trip.'
  },
  {
    icon: Settings,
    title: '100% In-House Operations',
    description: 'At Wanderphilia, every journey is designed and managed by our own team with complete attention to detail. From planning the itinerary to guiding you on the trip, everything is handled directly by us. This means better coordination, smoother experiences, and the confidence of travelling with a team that truly cares about every moment of your journey.'
  },
  {
    icon: CheckCircle,
    title: 'One Stop Hassle Free Experience',
    description: 'From the moment you start planning your journey to the time you return with unforgettable memories, Wanderphilia takes care of everything. Travel planning, stays, transportation, experiences, and on-ground coordination — all thoughtfully organised by our team so you can simply relax, enjoy the adventure, and live every moment of the journey.'
  },
]

export function FeaturesSection() {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-1 bg-primary rounded-full" />
            <span className="text-primary font-semibold text-sm tracking-widest uppercase">
              Why Wanderphilia
            </span>
            <div className="w-12 h-1 bg-primary rounded-full" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            The Wanderphilia Difference
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            We don&apos;t just organize trips—we craft transformative experiences that redefine what travel can be.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="group p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 hover:border-primary/30 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                {/* Icon Container */}
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-primary/15 rounded-2xl group-hover:bg-primary/25 transition-colors">
                    <Icon className="text-primary group-hover:scale-110 transition-transform" size={36} />
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>

                {/* Accent Line */}
                <div className="w-8 h-1 bg-primary rounded-full mx-auto mt-6 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
