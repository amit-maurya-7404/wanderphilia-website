import { notFound } from 'next/navigation'
import { trips } from '@/lib/data'
import BookingPackageClient from '@/components/booking-package-client'

type BookingPackagePageProps = {
  params: {
    slug: string
  }
}

export default function BookingPackagePage({ params }: BookingPackagePageProps) {
  const { slug } = params
  const trip = trips.find((item) => item.slug === slug)

  if (!trip) {
    notFound()
  }

  return <BookingPackageClient trip={trip} slug={slug} />
}
