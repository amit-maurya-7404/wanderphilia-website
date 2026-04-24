import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white overflow-hidden relative">
      {/* Background Accent Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-40 -mt-40" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -ml-40 -mb-40" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Accent Label */}
        <div className="inline-block mb-6">
          <span className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-semibold rounded-full">
            ✨ Your Journey Awaits
          </span>
        </div>

        {/* Main Heading */}
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
          Ready to Explore?
        </h2>

        {/* Subheading */}
        <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed">
          Join thousands of adventurers who&apos;ve transformed their travel dreams into unforgettable realities. Your next extraordinary experience starts here.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-2xl mx-auto">
          <Button asChild className="bg-white text-white hover:bg-white/95 px-10 py-4 text-lg h-auto rounded-xl font-bold flex items-center justify-center gap-2">
            <Link href="/trips">
              Discover Adventures
              <ArrowRight size={20} />
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-2 border-white text-white bg-transparent hover:bg-white/10 px-10 py-4 text-lg h-auto rounded-xl font-bold">
            <Link href="#featured">Learn More</Link>
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-8 pt-8 border-t border-white/20">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">10K+</p>
            <p className="text-white/80 text-sm">Happy Adventurers</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-white/20" />
          <div className="text-center">
            <p className="text-3xl font-bold text-white">50+</p>
            <p className="text-white/80 text-sm">Dream Destinations</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-white/20" />
          <div className="text-center">
            <p className="text-3xl font-bold text-white">4.8★</p>
            <p className="text-white/80 text-sm">Trusted Ratings</p>
          </div>
        </div>
      </div>
    </section>
  )
}
