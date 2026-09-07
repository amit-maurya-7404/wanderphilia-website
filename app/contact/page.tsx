'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin, Phone, Mail, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { contactEmail, contactPhoneDisplayInternational } from '@/lib/contact'
import { gtag } from '@/lib/gtag'

export default function ContactPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!fullName.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in your name, email, and message.')
      return
    }

    setError('')
    setIsSubmitting(true)

    gtag.event({
      action: 'submit',
      category: 'Form',
      label: 'Contact Form',
    })

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setSubmitted(true)
        setFullName('')
        setEmail('')
        setPhone('')
        setSubject('')
        setMessage('')
      } else {
        setError(data.message || 'Failed to send message. Please try again.')
      }
    } catch (err) {
      console.error('[Contact Form Error]:', err)
      setError('An error occurred. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="grow">
        {/* Hero Section */}
        <section className="relative min-h-80 bg-gradient-to-r from-primary/90 to-primary/70 flex items-center justify-center px-4 pt-20">
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
                    <p className="text-gray-600">Mumbai, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a Message</h2>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center animate-in fade-in duration-300">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-emerald-900 mb-2">Message Received!</h3>
                  <p className="text-emerald-700 text-sm max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out! A confirmation email has been sent to your address, and our team will get back to you shortly.
                  </p>
                  <Button
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                    className="mt-6 border-emerald-300 text-emerald-800 hover:bg-emerald-100"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 text-sm p-4 rounded-xl flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                      <p>{error}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <Input
                      type="text"
                      placeholder="Trip inquiry, customized itinerary, etc."
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      placeholder="Tell us about your travel plans, number of guests, or any specific questions..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    />
                  </div>

                  <Button size="lg" className="w-full font-bold" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </form>
              )}
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
