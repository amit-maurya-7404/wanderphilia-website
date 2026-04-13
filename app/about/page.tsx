'use client'

import React, { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail, MapPin, Phone } from 'lucide-react'

export default function AboutPage() {
  const [formValues, setFormValues] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.32),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(236,72,153,0.18),_transparent_30%)]" />
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="inline-flex rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                About Wanderphilia
              </p>
              <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
                Crafted travel experiences for the curious and bold.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-slate-200">
                Wanderphilia blends adventure, comfort, and local insight into journeys that feel personal, purposeful, and unforgettable.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Our Story Section */}
            <div className="mb-20 text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-1 bg-primary rounded-full" />
                <span className="text-primary font-semibold text-sm tracking-widest uppercase">
                  Our Story
                </span>
                <div className="w-12 h-1 bg-primary rounded-full" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Wanderphilia: Where Adventure Meets Community
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Born from a passion for authentic travel experiences, Wanderphilia has grown into a vibrant community of explorers who believe the best journeys are shared with like-minded souls.
              </p>
            </div>

            {/* Mission Section */}
            <div className="mb-20">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-1 bg-primary rounded-full" />
                    <span className="text-primary font-semibold text-sm tracking-widest uppercase">
                      Our Mission
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">
                    Creating Unforgettable Journeys Together
                  </h3>
                  <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p>
                      At Wanderphilia, our mission is to bring together people who share the same fire for travel, adventure, and unforgettable experiences. We believe travel is not just about ticking destinations off a list — it's about the energy of the people you meet, the crazy stories you create, and the moments that turn strangers into lifelong friends.
                    </p>
                    <p>
                      Through carefully crafted journeys, offbeat destinations, thrilling adventures, and authentic local experiences, we create trips where every traveller feels alive, free, and deeply connected to the journey.
                    </p>
                    <p className="font-semibold text-gray-900">
                      Wanderphilia is more than a travel company. It is a community of explorers, dreamers, and free spirits who believe the best memories are created when the right people come together in the right place.
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 p-8 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🌍</div>
                      <p className="text-lg font-semibold text-primary">Explore • Connect • Experience</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What Sets Us Apart */}
            <div className="mb-20">
              <div className="text-center mb-16">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  What Sets Us Apart
                </h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Our commitment to excellence and community-driven approach makes every journey extraordinary
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">👥</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Energetic Trip Captains</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Our trip captains are the heart of every journey, bringing positive energy, local insights, and creating unforgettable group experiences.
                  </p>
                </div>

                <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">⚙️</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">100% In-House Operations</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Every journey is designed and managed by our own team, ensuring complete attention to detail and seamless coordination.
                  </p>
                </div>

                <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Hassle-Free Experience</h4>
                  <p className="text-gray-600 leading-relaxed">
                    From planning to return, we handle everything so you can focus on creating memories and enjoying every moment.
                  </p>
                </div>
              </div>
            </div>

            {/* Our Approach */}
            <div className="mb-20">
              <div className="bg-gradient-to-r from-slate-50 to-white rounded-3xl p-12 border border-slate-200/50">
                <div className="max-w-4xl mx-auto text-center">
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Our Approach to Travel
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8 text-left">
                    <div>
                      <h4 className="text-xl font-semibold text-primary mb-3">Community-Led Journeys</h4>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        We bring together like-minded travellers through carefully curated group trips, customised holidays, honeymoons, and family getaways across India and international destinations.
                      </p>

                      <h4 className="text-xl font-semibold text-primary mb-3">Beyond Sightseeing</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Every journey goes beyond typical tourism — discovering hidden places, sharing moments with amazing people, and experiencing the true spirit of travel.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-primary mb-3">Authentic Experiences</h4>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        From offbeat mountain escapes and cultural immersions to romantic honeymoons and family adventures, we offer one-stop, hassle-free travel experiences.
                      </p>

                      <h4 className="text-xl font-semibold text-primary mb-3">Built on Trust</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Wanderphilia is a growing travel community built on trust, shared memories, and unforgettable stories. Wander | Connect | Experience | Repeat.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-slate-50 rounded-3xl p-12">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Ready to Start Your Journey?
                  </h3>
                  <p className="text-lg text-gray-600">
                    Share your travel dreams with us, and let's create something extraordinary together.
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                  <Card className="border-slate-200/80 bg-white">
                    <div className="space-y-4 px-6 pb-4">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Get in touch</p>
                        <h4 className="mt-3 text-2xl font-bold text-slate-950">Tell us your travel dreams</h4>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          Share your travel ideas and our team will help bring the perfect itinerary together.
                        </p>
                      </div>

                      {submitted ? (
                        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 text-sm text-slate-900">
                          <p className="font-semibold text-slate-950">Thanks for your message.</p>
                          <p className="mt-2 text-slate-600">We've received your request and will reach out within 24 hours.</p>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div>
                            <label htmlFor="name" className="text-sm font-medium text-slate-900">
                              Full name
                            </label>
                            <Input
                              id="name"
                              name="name"
                              value={formValues.name}
                              onChange={handleChange}
                              placeholder="Your name"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="text-sm font-medium text-slate-900">
                              Email address
                            </label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formValues.email}
                              onChange={handleChange}
                              placeholder="you@example.com"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="phone" className="text-sm font-medium text-slate-900">
                              Phone number
                            </label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formValues.phone}
                              onChange={handleChange}
                              placeholder="92176 64099"
                            />
                          </div>
                          <div>
                            <label htmlFor="message" className="text-sm font-medium text-slate-900">
                              Your travel plan
                            </label>
                            <Textarea
                              id="message"
                              name="message"
                              rows={5}
                              value={formValues.message}
                              onChange={handleChange}
                              placeholder="Tell us where you'd like to go and what matters most."
                              required
                            />
                          </div>
                          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
                            Send message
                          </Button>
                        </form>
                      )}
                    </div>
                  </Card>

                  <div className="space-y-8">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-6">Why Choose Wanderphilia?</h4>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-primary text-sm">✓</span>
                          </div>
                          <p className="text-gray-600">Personalized itineraries tailored to your preferences</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-primary text-sm">✓</span>
                          </div>
                          <p className="text-gray-600">Expert local guides and 24/7 support</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-primary text-sm">✓</span>
                          </div>
                          <p className="text-gray-600">Small group sizes for meaningful connections</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-primary text-sm">✓</span>
                          </div>
                          <p className="text-gray-600">Sustainable and responsible travel practices</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-slate-200/50">
                      <h5 className="font-semibold text-gray-900 mb-4">Quick Contact</h5>
                      <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-center gap-3">
                          <MapPin size={16} className="text-primary" />
                          <span>Laxmi Vihar Building, Walkeshwar, Mumbai</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail size={16} className="text-primary" />
                          <span>experiences@wanderphilia.com</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone size={16} className="text-primary" />
                          <span>+91 9217664099</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
