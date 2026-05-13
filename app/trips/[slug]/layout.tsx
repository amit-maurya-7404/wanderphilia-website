import { Metadata } from 'next'
import { trips } from '@/lib/data'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const trip = trips.find((t) => t.slug === slug)

  if (!trip) {
    return {
      title: 'Trip Not Found | Wanderphilia',
    }
  }

  const title = `${trip.title} | Wanderphilia`
  const description = trip.description

  return {
    title,
    description,
    alternates: {
      canonical: `https://wanderphilia.com/trips/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://wanderphilia.com/trips/${slug}`,
      type: 'website',
      images: [{ url: `https://wanderphilia.com${trip.image}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`https://wanderphilia.com${trip.image}`],
    }
  }
}

export default function TripDetailLayout({ children }: LayoutProps) {
  return <>{children}</>
}
