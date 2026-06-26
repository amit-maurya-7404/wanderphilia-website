import { notFound } from 'next/navigation'
import { trips } from '@/lib/data'
import BookingPackageClient from '@/components/booking-package-client'

type BookingPackagePageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function BookingPackagePage({ params }: BookingPackagePageProps) {
  const { slug } = await params
  const trip = trips.find((item) => item.slug === slug)

  if (!trip || trip.showGetQuoteOnly) {
    notFound()
  }

  return <BookingPackageClient trip={trip} slug={slug} />
}
