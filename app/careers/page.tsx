import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { ArrowRight, MapPin, Briefcase } from 'lucide-react'
import Link from 'next/link'

export default function CareersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="grow">
        {/* Hero Section */}
        <section className="relative min-h-96 bg-linear-to-r from-primary/90 to-primary/70 flex items-center justify-center px-4 pt-20">
          <div className="text-center text-white max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Join Our Team</h1>
            <p className="text-xl md:text-2xl text-white/90">
              Be part of a mission to create transformative travel experiences.
            </p>
          </div>
        </section>

        {/* Why Work With Us */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Why Work With Wanderphilia?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Meaningful Work',
                description: 'Help create unforgettable travel experiences for thousands of people.',
              },
              {
                title: 'Team Culture',
                description: 'Work with passionate, diverse team members from around the world.',
              },
              {
                title: 'Growth Opportunities',
                description: 'Continuous learning and career development in the travel industry.',
              },
              {
                title: 'Travel Benefits',
                description: 'Exclusive discounts and opportunities to experience destinations.',
              },
              {
                title: 'Impact',
                description: 'Contribute to sustainable tourism and community development.',
              },
              {
                title: 'Flexibility',
                description: 'Flexible working hours and remote work opportunities available.',
              },
            ].map((benefit, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-700">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Open Positions</h2>
            <div className="space-y-6">
              {[
                {
                  title: 'Senior Tour Guide',
                  location: 'Leh Ladakh',
                  type: 'Full-time',
                  department: 'Operations',
                },
                {
                  title: 'Content Creator',
                  location: 'Remote',
                  type: 'Full-time',
                  department: 'Marketing',
                },
                {
                  title: 'Customer Support Specialist',
                  location: 'Bangalore',
                  type: 'Full-time',
                  department: 'Support',
                },
                {
                  title: 'Travel Coordinator',
                  location: 'New Delhi',
                  type: 'Full-time',
                  department: 'Operations',
                },
                {
                  title: 'Sustainability Officer',
                  location: 'Remote',
                  type: 'Full-time',
                  department: 'Sustainability',
                },
                {
                  title: 'Community Manager',
                  location: 'Remote',
                  type: 'Part-time',
                  department: 'Community',
                },
              ].map((job, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{job.title}</h3>
                    <div className="flex gap-4 flex-wrap text-gray-600 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-primary" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase size={18} className="text-primary" />
                        {job.type}
                      </div>
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">{job.department}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="px-6">
                    Apply Now
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Application Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Apply', desc: 'Submit your resume and cover letter' },
              { step: '2', title: 'Review', desc: 'Our team reviews applications' },
              { step: '3', title: 'Interview', desc: 'Phone and in-person interviews' },
              { step: '4', title: 'Offer', desc: 'Receive and accept job offer' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-linear-to-r from-primary/10 to-primary/5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-2xl text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Don't See Your Dream Role?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Send us your resume and let us know how you can contribute to our mission.
          </p>
          <a href="mailto:careers@wanderphilia.com">
            <Button size="lg" className="gap-2">
              Send Your Resume <ArrowRight size={20} />
            </Button>
          </a>
        </section>
      </main>
      <Footer />
    </div>
  )
}
