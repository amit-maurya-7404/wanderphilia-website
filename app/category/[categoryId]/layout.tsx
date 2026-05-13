import { Metadata } from 'next'
import { getSectionMapping } from '@/lib/section-mappings'
import { trips } from '@/lib/data'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{
    categoryId: string
  }>
}

const categoryMapping: Record<string, string> = {
  'leh-ladakh': 'Leh Ladakh',
  'spiti': 'Spiti',
  'himachal': 'Himachal',
  'kashmir': 'Kashmir',
  'meghalaya': 'Meghalaya',
  'nepal': 'Nepal',
  'indonesia': 'Indonesia',
  'switzerland': 'Switzerland',
  'peru': 'Peru',
  'iceland': 'Iceland',
  'japan': 'Japan',
  'bhutan': 'Bhutan'
}

export async function generateMetadata({ params }: { params: Promise<{ categoryId: string }> }): Promise<Metadata> {
  const { categoryId } = await params
  const categoryName = categoryMapping[categoryId] || categoryId
  const sectionMap = getSectionMapping(categoryId)
  const availableTrips = trips.filter(trip => sectionMap.available.includes(trip.id))
  const firstTrip = availableTrips[0]
  
  const title = `${categoryName} Tour Packages | Wanderphilia`
  const description = firstTrip?.description || `Explore the best ${categoryName} tour packages with Wanderphilia. Unforgettable group trips and offbeat experiences.`
  
  return {
    title,
    description,
    alternates: {
      canonical: `https://wanderphilia.com/category/${categoryId}`,
    },
    openGraph: {
      title,
      description,
      url: `https://wanderphilia.com/category/${categoryId}`,
      type: 'website',
      images: firstTrip ? [{ url: `https://wanderphilia.com${firstTrip.image}` }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: firstTrip ? [`https://wanderphilia.com${firstTrip.image}`] : [],
    }
  }
}

export default function CategoryLayout({ children }: LayoutProps) {
  return <>{children}</>
}
