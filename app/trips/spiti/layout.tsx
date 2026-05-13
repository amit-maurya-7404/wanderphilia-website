import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Spiti Valley Tour Packages | Wanderphilia',
  description: 'Explore the middle land of Spiti Valley with Wanderphilia. Best Spiti group trips, road trips and customized winter Spiti tours.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/spiti',
  },
  openGraph: {
    title: 'Spiti Valley Tour Packages | Wanderphilia',
    description: 'Explore the middle land of Spiti Valley with Wanderphilia.',
    url: 'https://wanderphilia.com/trips/spiti',
    type: 'website',
  }
}

export default function SpitiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
