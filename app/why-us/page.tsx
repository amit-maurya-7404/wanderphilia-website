import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function WhyUsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="grow">
        {/* Hero Section */}
        <section className="relative min-h-96 bg-linear-to-r from-primary/90 to-primary/70 flex items-center justify-center px-4 pt-20">
          <div className="text-center text-white max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Why Choose Wanderphilia?</h1>
            <p className="text-xl md:text-2xl text-white/90">
              Experience travel like never before with our curated adventures and expert guidance.
            </p>
          </div>
        </section>

        {/* Key Reasons */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">What Sets Us Apart</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Expert Local Guides',
                description: 'Our guides are locals who know every hidden gem and cultural nuance of their region.',
                icon: '👨‍🏫',
              },
              {
                title: 'Small Group Sizes',
                description: 'Maximum 20 people per group ensures personalized attention and authentic experiences.',
                icon: '👥',
              },
              {
                title: 'Sustainable Tourism',
                description: 'We contribute 5% of profits to local conservation and community development projects.',
                icon: '🌱',
              },
              {
                title: 'Best Price Guarantee',
                description: 'Find the same tour cheaper elsewhere? We\'ll match the price and give 10% discount.',
                icon: '💰',
              },
              {
                title: '24/7 Support',
                description: 'Our team is available round the clock to assist with any urgent needs.',
                icon: '📞',
              },
              {
                title: 'Flexible Booking',
                description: 'Cancel free up to 2 weeks before. No questions asked refund policy.',
                icon: '✅',
              },
            ].map((reason, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{reason.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{reason.title}</h3>
                <p className="text-gray-700">{reason.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">How We Compare</h2>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <table className="w-full">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Feature</th>
                    <th className="px-6 py-4 text-center font-semibold">Wanderphilia</th>
                    <th className="px-6 py-4 text-center font-semibold">Other Operators</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    { feature: 'Local Expert Guides', wp: true, other: false },
                    { feature: 'Small Groups (Max 20)', wp: true, other: false },
                    { feature: 'Free Cancellation', wp: true, other: false },
                    { feature: '24/7 Support', wp: true, other: false },
                    { feature: 'Sustainability Initiatives', wp: true, other: false },
                    { feature: 'Best Price Match', wp: true, other: false },
                    { feature: 'Flexible Date Options', wp: true, other: true },
                    { feature: 'Travel Insurance', wp: true, other: true },
                  ].map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="px-6 py-4 text-gray-900 font-medium">{row.feature}</td>
                      <td className="px-6 py-4 text-center">
                        {row.wp ? (
                          <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {row.other ? (
                          <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Testimonial Highlight */}
        <section className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-linear-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 text-center">
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              "I've traveled with many companies, but Wanderphilia has set a new standard. Not just a tour operator, but a life-changing experience."
            </p>
            <p className="text-lg text-gray-700 mb-2">Sarah Williams</p>
            <p className="text-gray-600">Digital Marketer, California</p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Experience the Difference?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied travelers who have chosen Wanderphilia.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/trips">
              <Button size="lg" className="gap-2">
                Browse Trips <ArrowRight size={20} />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Contact Us
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
