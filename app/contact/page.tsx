import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { contactEmail, contactPhoneDisplayInternational } from '@/lib/contact'
import { gtag } from '@/lib/gtag'

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="grow">
        {/* Hero Section */}
        <section className="relative min-h-80 bg-linear-to-r from-primary/90 to-primary/70 flex items-center justify-center px-4 pt-20">
          <div className="text-center text-white max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Get In Touch</h1>
            <p className="text-xl md:text-2xl text-white/90">
              Have questions? We're here to help plan your perfect adventure.
            </p>
          </div>
        </section>

        {/* Contact Information & Form */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Information</h2>

              <div className="space-y-6">
                {[
                  {
                    icon: MapPin,
                    title: 'Address',
                    details: 'Laxmi Vihar Building, Walkeshwar, Mumbai, MH 400006',
                  },
                  {
                    icon: Phone,
                    title: 'Phone',
                    details: contactPhoneDisplayInternational,
                  },
                  {
                    icon: Mail,
                    title: 'Email',
                    details: contactEmail,
                  },
                  {
                    icon: Clock,
                    title: 'Hours',
                    details: 'Open 24/7',
                  },
                ].map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <div key={idx} className="flex gap-4">
                      <Icon className="w-6 h-6 text-primary shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-gray-600">{item.details}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Map Placeholder */}
              <div className="mt-8">
                <h3 className="font-semibold text-gray-900 mb-4">Location</h3>
                <div className="w-full h-64 bg-gray-200 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
                    <p className="text-gray-600">Google Maps Embed Here</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a Message</h2>

              <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                gtag.event({
                  action: 'submit',
                  category: 'Form',
                  label: 'Contact Form',
                });
                // Handle form submission here
                alert('Form submitted! (Add your form handling logic)');
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    placeholder="+91 9876 543 210"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <Input
                    type="text"
                    placeholder="How can we help?"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    placeholder="Tell us more about your query..."
                    className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <Button size="lg" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>

            <div className="space-y-6">
              {[
                {
                  q: 'How do I book a trip?',
                  a: 'Simply browse our trips, select your desired dates, and complete the booking process. A confirmation email will be sent immediately.'
                },
                {
                  q: 'What is your cancellation policy?',
                  a: 'You can cancel free up to 2 weeks before the trip. Cancellations within 2 weeks will have a 50% refund.'
                },
                {
                  q: 'Are visas & travel insurance included?',
                  a: 'No, they are not included in the package. However, we can guide you through the process.',
                },
                {
                  q: 'Do you offer group discounts?',
                  a: 'Yes! Groups of 10+ get 15% discount. Contact our team for details.',
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{item.q}</h3>
                  <p className="text-gray-700">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
