import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Spiti Tour Packages | Group Trips & Customized Tours | Wanderphilia',
  description: 'Explore the best Spiti tour packages with Wanderphilia. Book standard or customized trips, honeymoon packages, and group tours to Spiti.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/spiti',
  },
  openGraph: {
    title: 'Spiti Tour Packages | Wanderphilia',
    description: 'Explore the best Spiti tour packages with Wanderphilia.',
    url: 'https://wanderphilia.com/trips/spiti',
    type: 'website',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
