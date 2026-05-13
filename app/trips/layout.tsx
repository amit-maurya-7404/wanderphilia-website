import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Tour Packages | Group Trips & Customized Tours | Wanderphilia',
  description: 'Explore all our tour packages across India and International destinations. Join our curated group trips or book a customized tour with Wanderphilia.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips',
  },
  openGraph: {
    title: 'All Tour Packages | Wanderphilia',
    description: 'Explore all our tour packages with Wanderphilia.',
    url: 'https://wanderphilia.com/trips',
    type: 'website',
  }
}

export default function TripsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
