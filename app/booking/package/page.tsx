import { notFound } from 'next/navigation'
import { trips } from '@/lib/data'
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

  const trip = trips.find((item) => item.slug === slug)

  if (!trip) {
    notFound()
  }

  return <BookingPackageClient trip={trip} slug={slug} />
}
