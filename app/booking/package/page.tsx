import { notFound } from 'next/navigation'
import { getTripBySlug } from '@/lib/trips-service'
import BookingPackageClient from '@/components/booking-package-client'

type BookingPackagePageProps = {
  searchParams: Promise<{
    slug?: string
  }>
}

export default async function BookingPackagePage({ searchParams }: BookingPackagePageProps) {
  const params = await searchParams
  const slug = params?.slug
  if (!slug) {
    notFound()
  }

  const trip = await getTripBySlug(slug)

  if (!trip || trip.showGetQuoteOnly) {
    notFound()
  }

  return <BookingPackageClient trip={trip} slug={slug} />
}
