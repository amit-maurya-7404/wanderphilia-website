import { notFound } from 'next/navigation'
import { getTripBySlug } from '@/lib/trips-service'
import BookingPackageClient from '@/components/booking-package-client'

type BookingPackagePageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function BookingPackagePage({ params }: BookingPackagePageProps) {
  const { slug } = await params
  const trip = await getTripBySlug(slug)

  if (!trip || trip.showGetQuoteOnly) {
    notFound()
  }

  return <BookingPackageClient trip={trip} slug={slug} />
}
