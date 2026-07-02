import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vietnam Tour Packages from India | Group & Customised Trips | Wanderphilia',
  description: 'Explore best Vietnam tour packages with Wanderphilia. All-inclusive group tours and customized travel itineraries for Hanoi, Halong Bay, Da Nang, and Hoi An.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/vietnam',
  },
  openGraph: {
    title: 'Vietnam Tour Packages from India | Group & Customised Trips | Wanderphilia',
    description: 'Explore best Vietnam tour packages with Wanderphilia. All-inclusive group tours and customized travel itineraries for Hanoi, Halong Bay, Da Nang, and Hoi An.',
    url: 'https://wanderphilia.com/trips/vietnam',
    type: 'website',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
