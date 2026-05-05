'use client'


import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Award, Headphones, Star, Users } from 'lucide-react'
import Image from 'next/image'


export function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white overflow-hidden relative">
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
          <Button asChild className="bg-white border-2 text-white hover:bg-white/95 px-10 py-4 text-lg h-auto rounded-xl font-bold flex items-center justify-center gap-2">
            <Link href="/upcoming-tours">
              Discover Adventures
              <ArrowRight size={20} />
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-2 border-white text-white bg-transparent hover:bg-white/10 px-10 py-4 text-lg h-auto rounded-xl font-bold">
            <Link href="/about">Learn More</Link>
          </Button>
        </div>

        {/* Trust Badges */}
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-0 mt-10 max-w-4xl">
          <div className="flex flex-rows px-1 md:px-5 items-center bg-white rounded-xl text-center gap-3">
            <Image
              src="/images/Google_logo.png"
              alt="Google logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-1 mb-0">

                <span className="text-yellow-400 font-bold">5</span>
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              </div>
              <p className="text-black font-semibold text-sm">Google Reviews</p>
            </div>

          </div>

          <div className="flex flex-col py-3 items-center bg-white rounded-xl items-center text-center">
            <div className="flex items-center gap-1 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-primary font-bold">20,000+</span>
            </div>
            <p className="text-black font-semibold text-sm">Happy Wanderers</p>
          </div>

          <div className="flex flex-col py-3 items-center bg-white rounded-xl items-center text-center">
            <div className="flex items-center gap-1 mb-2">
              <Headphones className="w-5 h-5 text-green-600" />
              <span className="text-green-600 font-bold">24x7</span>
            </div>
            <p className="text-black font-semibold text-sm">Ground Support</p>
          </div>

          <div className="flex flex-col py-3 items-center bg-white rounded-xl items-center text-center">
            <div className="flex items-center gap-1 mb-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span className="text-blue-600 font-bold">8 Years</span>
            </div>
            <p className="text-black font-semibold text-sm">Experience</p>
          </div>
        </div>
      </div>
    </section>
  )
}
