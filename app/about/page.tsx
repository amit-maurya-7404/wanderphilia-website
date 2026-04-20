'use client'

import React, { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AboutHeroSection } from '@/components/about-hero-section'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail, MapPin, Phone } from 'lucide-react'
import { contactEmail, contactPhoneDisplayInternational } from '@/lib/contact'
import { FAQ } from '@/components/faq'

export default function AboutPage() {
  const [formValues, setFormValues] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      })

      if (response.ok) {
        setSubmitted(true)
        // Reset form after 3 seconds
        setTimeout(() => {
          setFormValues({ name: '', email: '', phone: '', message: '' })
          setSubmitted(false)
        }, 3000)
      } else {
        alert('Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('An error occurred. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="bg-white">
        <Navbar />
      </div>
      <main className="flex-grow">
        <AboutHeroSection />

        <section className="bg-white rounded-3xl mt-[4vh] md:mt-[15vh]  py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-[10vh]">
              {/* <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary mb-3">
                Wanderphilia – Our Story
              </p> */}
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                <span className="text-primary">Wanderphilia</span> – Our Story
              </h2>
            </div>

            <div className="overflow-hidden rounded-4xl  ">
              <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] items-stretch">
                <div className="relative min-h-[360px] lg:min-h-[400px]">
                  <img
                    src="/images/user2.jpg"
                    alt="Wanderphilia founder"
                    className="h-full md:h-[80vh] w-full object-cover"
                  />
                </div>

                <div className="flex items-center p-3 md:px-10">
                  <div className="mx-auto w-full max-w-2xl max-h-[520px] lg:max-h-[80vh] overflow-y-auto pr-4 lg:pl-4 lg:pr-0 text-gray-700 text-base md:text-[17px] leading-8 lg:direction-rtl custom-scroll">

                    {/* Inner wrapper */}
                    <div className="lg:direction-ltr">
                      <ul className="list-disc pl-5 space-y-3 marker:text-orange-500">
                        <li>There was a time when success had safe answers — Doctor, Engineer, Teacher.</li>

                        <li>Travel was just a break… not a path.</li>

                        <li>
                          But every time we travelled, we felt something more —
                          freedom, excitement, stories that stayed with us.
                        </li>

                        <li>
                          Planning those journeys? Complicated. Confusing. Impersonal.
                        </li>

                        <li>Somewhere, travel lost its joy.</li>

                        <li>And that’s where Wanderphilia began.</li>

                        <li>
                          Not just as a company—but as a better way to travel.
                        </li>

                        <li>
                          We set out to make travel effortless, personal, and seamless—
                          powered by strong systems, a passionate team, and smart technology.
                        </li>

                        <li className="font-semibold text-gray-900">
                          Because travel should feel simple. It should feel exciting. It should feel like you.
                        </li>

                        <li>
                          Today, Wanderphilia is built for those who want the thrill of exploring—
                          without the stress of planning.
                        </li>

                        <li>No chaos. No confusion. Just beautifully crafted journeys that flow.</li>

                        <li>
                          We don’t just plan trips. We create experiences you’ll carry long after you return.
                        </li>

                        <li>
                          Because in the end, it’s not about where you go—
                        </li>

                        <li className="text-xl font-semibold text-gray-900">
                          it’s about how it makes you feel.
                        </li>
                      </ul>
                    </div>



                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#ffffff] rounded-3xl mt-[4vh] md:mt-[15vh] py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-[10vh]">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 ">
                Our Mission – <span className="text-primary">Wanderphilia</span>
              </h2>
            </div>

            <div className="overflow-hidden rounded-[2rem] ">
              <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] items-stretch">

                {/* Image */}
                <div className=" relative min-h-[360px] lg:min-h-[400px] lg:order-2">
                  <img
                    src="/images/user2.jpg"
                    alt="Wanderphilia founder"
                    className="h-full md:h-[80vh] w-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex items-center p-3 md:px-10">
                  <div className="mx-auto w-full max-w-2xl max-h-[520px] lg:max-h-[80vh] overflow-y-auto pr-4 lg:pl-4 lg:pr-0 text-gray-700 text-base md:text-[17px] leading-8 lg:direction-rtl custom-scroll">

                    {/* Inner wrapper */}
                    <div className="lg:direction-ltr">

                      <ul className="list-disc pl-5 space-y-4 marker:text-orange-500">

                        <li>
                          At Wanderphilia, our mission is simple—<br />
                          to make travel feel effortless, seamless, and truly unforgettable.
                        </li>

                        <li>
                          We believe travel doesn’t fail in inspiration—<br />
                          it fails in execution.
                        </li>

                        <li>
                          That’s why we don’t just plan trips.<br />
                          We take complete ownership of your journey—<br />
                          from designing thoughtful itineraries to managing every on-ground detail.
                        </li>

                        <li>
                          Powered by smart systems, a passionate team, and strong on-ground networks,<br />
                          we ensure every trip flows exactly the way it should—<br />
                          smooth, stress-free, and beautifully executed.
                        </li>

                        <li className="font-semibold text-gray-900">
                          Because for us, personalization is not enough.<br />
                          Reliability is everything.
                        </li>

                        <li>
                          Every journey we create is built around you,<br />
                          handled by experts, and supported at every step.
                        </li>

                        <li className="font-semibold text-gray-900">
                          Our goal is clear:<br />
                          When you travel with Wanderphilia—<br />
                          you don’t worry about the trip. You live it.
                        </li>

                      </ul>

                    </div>
                  </div>
                </div>


              </div>

            </div>
          </div>
        </section>

        {/* Brands Section */}
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Brands who trust us
              </h2>
              <div className="h-1 w-20 bg-orange-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
              {/* KPMG */}
              <div className="">
                <img src="/images/kpmg_logo.png" alt="KPMG" className="h-12 w-auto object-contain" />
              </div>

              {/* Reliance */}
              <div className="">
                <img src="/images/reliance_logo.png" alt="Reliance" className="h-12 w-auto object-contain" />
              </div>

              {/* Aditya Birla */}
              <div className="">
                <img src="/images/birla_logo.png" alt="Aditya Birla" className="h-14 w-auto object-contain" />
              </div>

              {/* Bharat Petroleum */}
              <div className="">
                <img src="/images/bp_logo.png" alt="Bharat Petroleum" className="h-20 w-auto object-contain" />
              </div>

              {/* Subko */}
              <div className="">
                <img src="/images/subko_logo.webp" alt="Subko" className="h-12 w-auto pl-[0vw] md:pl-0 object-contain" />
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Wanderphilia Team
              </h2>
              <div className="h-1 w-20 bg-orange-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {/* Team Member 1 */}
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
                  <img
                    src="/images/user2.jpg"
                    alt="Bhavin Thaker"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Bhavin Thaker</h3>
                <p className="text-lg text-orange-500 font-semibold mb-2">The Show Runner</p>
                <p className="text-gray-600 font-medium">Founder</p>
              </div>

              {/* Team Member 2 */}
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
                  <img
                    src="/images/user1.jpg"
                    alt="Nikita Verma"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Nikita Verma</h3>
                <p className="text-lg text-orange-500 font-semibold mb-2">The Lead Box</p>
                <p className="text-gray-600 font-medium">Co Founder, Marketing & Creative Head</p>
              </div>

              {/* Team Member 3 */}
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
                  <img
                    src="/images/user2.jpg"
                    alt="Amit"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Amit</h3>
                <p className="text-lg text-orange-500 font-semibold mb-2">The Tech Guy</p>
                <p className="text-gray-600 font-medium">Technology Team Lead</p>
              </div>

              {/* Team Member 4 */}
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
                  <img
                    src="/images/user3.jpg"
                    alt="Mrunal"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Mrunal</h3>
                <p className="text-lg text-orange-500 font-semibold mb-2">The Connector</p>
                <p className="text-gray-600 font-medium">Sales Head</p>
              </div>

              {/* Team Member 5 */}
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
                  <img
                    src="/images/user4.jpg"
                    alt="Jay Shah"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Jay Shah</h3>
                <p className="text-lg text-orange-500 font-semibold mb-2">The Executor</p>
                <p className="text-gray-600 font-medium">Operation Head</p>
              </div>

              {/* Team Member 6 */}
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
                  <img
                    src="/images/user2.jpg"
                    alt="Jainam Shah"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Jainam Shah</h3>
                <p className="text-lg text-orange-500 font-semibold mb-2">The Innovator</p>
                <p className="text-gray-600 font-medium">Product Manager</p>
              </div>
            </div>
          </div>
        </section>

        {/* Life At Wanderphilia Section */}
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Life At Wanderphilia
              </h2>
              <div className="h-1 w-20 bg-orange-500 mx-auto rounded-full"></div>
            </div>

            {/* Photo Gallery Carousel */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Team Moments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <img
                    src="/images/dummy1.jpg"
                    alt="Team Activity 1"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <img
                    src="/images/dummy2.jpg"
                    alt="Team Activity 2"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <img
                    src="/images/dummy3.jpg"
                    alt="Team Activity 3"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <img
                    src="/images/dummy4.jpg"
                    alt="Team Activity 4"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Team Building Activities */}
            {/* <div className="mb-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Team Building Activities</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="text-4xl mb-4">🎯</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Adventure Trips</h4>
                  <p className="text-gray-600">Explore new destinations together as a team and build unforgettable connections.</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="text-4xl mb-4">🎨</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Creative Workshops</h4>
                  <p className="text-gray-600">Collaborate on innovative ideas and bring creative visions to life together.</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="text-4xl mb-4">🤝</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Team Bonding</h4>
                  <p className="text-gray-600">Strengthen bonds through interactive games, sports, and memorable experiences.</p>
                </div>
              </div>
            </div> */}

            {/* Video Gallery */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Behind The Scenes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="relative h-72 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-black">
                  <img
                    src="/images/dummy5.jpg"
                    alt="Video 1"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 transition-colors duration-300">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="relative h-72 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-black">
                  <img
                    src="/images/dummy6.avif"
                    alt="Video 2"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 transition-colors duration-300">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="relative h-72 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-black">
                  <img
                    src="/images/dummy7.avif"
                    alt="Video 3"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 transition-colors duration-300">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        

        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Our Story Section */}
            {/* <div className="mb-20 text-center max-w-4xl mx-auto">
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
            </div> */}

            {/* Mission Section */}
            {/* <div className="mb-20">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="flex items-center p-6 md:p-10">
                  <div className="mx-auto w-full max-w-2xl max-h-[520px] lg:max-h-[560px] overflow-y-auto pr-4 lg:pl-4 lg:pr-0 text-gray-700 text-base md:text-[17px] leading-8 lg:direction-rtl custom-scroll">

                    {/* Inner wrapper 
                    <div className="lg:direction-ltr">

                      <ul className="list-disc pl-5 space-y-4 marker:text-orange-500">

                        <li>
                          At Wanderphilia, our mission is simple—<br />
                          to make travel feel effortless, seamless, and truly unforgettable.
                        </li>

                        <li>
                          We believe travel doesn’t fail in inspiration—<br />
                          it fails in execution.
                        </li>

                        <li>
                          That’s why we don’t just plan trips.<br />
                          We take complete ownership of your journey—<br />
                          from designing thoughtful itineraries to managing every on-ground detail.
                        </li>

                        <li>
                          Powered by smart systems, a passionate team, and strong on-ground networks,<br />
                          we ensure every trip flows exactly the way it should—<br />
                          smooth, stress-free, and beautifully executed.
                        </li>

                        <li className="font-semibold text-gray-900">
                          Because for us, personalization is not enough.<br />
                          Reliability is everything.
                        </li>

                        <li>
                          Every journey we create is built around you,<br />
                          handled by experts, and supported at every step.
                        </li>

                        <li className="font-semibold text-gray-900">
                          Our goal is clear:<br />
                          When you travel with Wanderphilia—<br />
                          you don’t worry about the trip. You live it.
                        </li>

                      </ul>

                    </div>
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
            </div> */}

            {/* What Sets Us Apart. */}
            <div className="mb-20">
              <div className="text-center mb-16">
                <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Why <span className="text-primary">Wanderphilia</span>
                </h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Our commitment to excellence and community-driven approach makes every journey extraordinary
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6 rounded-3xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🧭</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">100% In-House Operations. End-to-End Ownership</h4>
                  <p className="text-gray-600 leading-relaxed">
                    No middle chaos. No confusion.
                    Everything — from planning to execution — is handled in-house by our team.
                    This means better coordination, faster response, and complete accountability.
                    We don’t outsource your experience.
                    We take full responsibility for it.

                  </p>
                </div>
                <div className="text-center p-6 rounded-3xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🚀</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">A Team That Travels With You</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Our team and trip captains aren’t just professionals — they’re passionate travellers who bring energy, warmth, and care into every trip.
                    They don’t just guide you.
                    They connect with you, support you, and celebrate the journey with you.
                    That’s why most of our travellers say:
                    “It felt like travelling with friends, not a company.”

                  </p>
                </div>
                <div className="text-center p-6 rounded-3xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🧭</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">On-Ground Execution & Control</h4>
                  <p className="text-gray-600 leading-relaxed">
                    🌟 Experiences You Can Trust
                    We work only with verified hotels, trusted transport partners, and carefully selected experiences.
                    Every stay, every activity, every detail is chosen with one goal:
                    👉 To give you a journey that feels seamless, safe, and unforgettable.
                    From hotels and transport to guides and activities, every element is coordinated through our on-ground teams and operating partners.
                  </p>
                </div>
                <div className="text-center p-6 rounded-3xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🧭</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">24/7 Dedicated Support.</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Travel comes with uncertainties — your support system shouldn’t.
                    Our operations and support team remains continuously accessible throughout your journey.
                    Whether it’s a quick clarification or real-time assistance, we are always one call or message away.
                    With Wanderphilia, you travel with the confidence that someone reliable is always there.
                  </p>
                </div>
                <div className="text-center p-6 rounded-3xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🤝</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Guided With Care, Planned With Heart</h4>
                  <p className="text-gray-600 leading-relaxed">
                    We don’t just sell packages.
                    We understand your vibe, your expectations, your travel style — and then guide you with honest recommendations to create the perfect itinerary.
                    Every trip is thoughtfully designed, not mass-produced.
                  </p>
                </div>
                {/* <div className="text-center p-6 rounded-3xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🧭</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Transparent Responsibility</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Clear inclusions, clear policies, and clear ownership. No hidden handoffs. No grey areas when things change.
                  </p>
                </div> */}
                {/* <div className="text-center p-6 rounded-3xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🧭</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Hassle-Free Experience, Start to Finish</h4>
                  <p className="text-gray-600 leading-relaxed">
                    From your first interaction to your return home, we ensure a completely stress-free process.
                    No last-minute surprises.
                    No operational confusion.
                    No compromises on experience.
                  </p>
                </div> */}
                <div className="text-center p-6 rounded-3xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">❤️</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Always There. Like Family</h4>
                  <p className="text-gray-600 leading-relaxed">
                    From the moment you book with us… to the moment you return home — and even after that — you’re never alone.
                    We’re just one call or message away, always.
                    Our support and operations team stays connected with you throughout your journey, ensuring everything flows smoothly.
                    Because for us, you’re not just a client.
                    You are a part of the Wanderphilia Family.
                  </p>
                </div>

              </div>
            </div>

            <FAQ />

            {/* Our Approach */}
            {/* <div className="mb-20">
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
            </div> */}

            {/* Contact Section */}
            <div className="bg-white rounded-3xl md:p-12">
              <div className="max-w-6xl mx-auto">
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
                          <span>{contactEmail}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone size={16} className="text-primary" />
                          <span>{contactPhoneDisplayInternational}</span>
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
