import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { trips } from '@/lib/data'
import { MapPin, Calendar, Users, CheckCircle, XCircle, Star } from 'lucide-react'
import { contactEmail, contactPhone, contactPhoneDisplay, instagramUrl } from '@/lib/contact'

interface TripDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return trips.map(trip => ({
    slug: trip.slug,
  }))
}

export async function generateMetadata({ params }: TripDetailPageProps) {
  const { slug } = await params
  const trip = trips.find(t => t.slug === slug)

  if (!trip) {
    return {
      title: 'Trip Not Found',
    }
  }

  return {
    title: `${trip.title} - Wanderphilia`,
    description: trip.description,
  }
}

export default async function TripDetailPage({ params }: TripDetailPageProps) {
  const { slug } = await params
  const trip = trips.find(t => t.slug === slug)

  if (!trip) {
    notFound()
  }

  const difficultyColor =
    trip.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
    trip.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
    'bg-red-100 text-red-800'

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Image */}
        <div className="relative h-96 md:h-screen md:max-h-96 overflow-hidden">
          <Image
            src={trip.image}
            alt={trip.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Trip Header */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-16 z-10 mb-12">
          <Card className="p-8 bg-white shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {trip.title}
                </h1>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin size={18} className="text-primary" />
                  <span className="text-lg">{trip.destination}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-primary">
                  ₹{trip.price.toLocaleString('en-IN')}
                </p>
                <p className="text-gray-600 text-sm">per person</p>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                <Calendar size={14} className="mr-1" />
                {trip.duration} Days
              </Badge>
              <Badge className={`${difficultyColor}`}>
                {trip.difficulty}
              </Badge>
              <Badge variant="outline">
                <Users size={14} className="mr-1" />
                Max {trip.groupSize} people
              </Badge>
              <Badge variant="outline" className="flex items-center">
                <Star size={14} className="mr-1 fill-primary text-primary" />
                {trip.rating} ({trip.rating})
              </Badge>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Overview */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Overview
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {trip.description}
                </p>
              </section>

              {/* Highlights */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Trip Highlights
                </h2>
                <ul className="space-y-3">
                  {trip.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Star size={20} className="text-primary mt-1 flex-shrink-0 fill-primary" />
                      <span className="text-lg text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Itinerary */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Detailed Itinerary
                </h2>
                <div className="space-y-4">
                  {trip.itinerary.map((day) => (
                    <Card key={day.day} className="p-6 border-l-4 border-primary">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <Badge className="bg-primary text-white text-lg py-2 px-3">
                            Day {day.day}
                          </Badge>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {day.title}
                          </h3>
                          <p className="text-gray-700">
                            {day.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>

              {/* What's Included */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  What&apos;s Included
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <CheckCircle className="text-green-600" size={20} />
                      Included
                    </h3>
                    <ul className="space-y-3">
                      {trip.included.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <XCircle className="text-red-600" size={20} />
                      Not Included
                    </h3>
                    <ul className="space-y-3">
                      {trip.notIncluded.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <XCircle size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div>
              <div className="sticky top-24 space-y-4">
                {/* Booking Card */}
                <Card className="p-8 bg-gray-50 border-primary border-2">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Upcoming Dates
                  </h3>
                  <div className="space-y-4 mb-6">
                    {trip.dates.map((date, index) => (
                      <div
                        key={index}
                        className="p-4 bg-white border border-gray-200 rounded-lg hover:border-primary transition-colors cursor-pointer"
                      >
                        <p className="font-semibold text-gray-900 mb-1">
                          {new Date(date.startDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })} - {new Date(date.endDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="text-sm text-gray-600">
                          {date.spots} {date.spots === 1 ? 'spot' : 'spots'} available
                        </p>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg h-auto">
                    Book Now
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-4">
                    We&apos;ll get back to you within 24 hours
                  </p>
                </Card>

                {/* Contact Card */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Questions?
                  </h3>
                  <p className="text-gray-700 text-sm mb-4">
                    Contact our travel experts for more information
                  </p>
                  <div className="space-y-3 mb-4">
                    <a href={`mailto:${contactEmail}`} className="block text-gray-700 hover:text-primary transition-colors text-sm">
                      Email: {contactEmail}
                    </a>
                    <a href={`tel:${contactPhone}`} className="block text-gray-700 hover:text-primary transition-colors text-sm">
                      Phone: {contactPhoneDisplay}
                    </a>
                    <a href={instagramUrl} target="_blank" rel="noreferrer" className="block text-gray-700 hover:text-primary transition-colors text-sm">
                      Instagram: @wanderphiliaa
                    </a>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`mailto:${contactEmail}`}>
                      Send Email
                    </Link>
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
