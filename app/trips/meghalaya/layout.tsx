import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Meghalaya Tour Packages | Group Trips & Customized Tours | Wanderphilia',
  description: 'Explore the best Meghalaya tour packages with Wanderphilia. Book standard or customized trips, honeymoon packages, and group tours to Meghalaya.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/meghalaya',
  },
  openGraph: {
    title: 'Meghalaya Tour Packages | Wanderphilia',
    description: 'Explore the best Meghalaya tour packages with Wanderphilia.',
    url: 'https://wanderphilia.com/trips/meghalaya',
    type: 'website',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
