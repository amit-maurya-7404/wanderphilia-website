import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vietnam Tour Packages | Group Trips & Customized Tours | Wanderphilia',
  description: 'Explore the best Vietnam tour packages with Wanderphilia. Book standard or customized trips, honeymoon packages, and group tours to Vietnam.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/vietnam',
  },
  openGraph: {
    title: 'Vietnam Tour Packages | Wanderphilia',
    description: 'Explore the best Vietnam tour packages with Wanderphilia.',
    url: 'https://wanderphilia.com/trips/vietnam',
    type: 'website',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
