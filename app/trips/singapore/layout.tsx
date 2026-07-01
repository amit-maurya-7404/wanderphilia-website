import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Singapore Tour Packages | Group Trips & Customized Tours | Wanderphilia',
  description: 'Explore the best Singapore tour packages with Wanderphilia. Book standard or customized trips, honeymoon packages, and group tours to Singapore.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/singapore',
  },
  openGraph: {
    title: 'Singapore Tour Packages | Wanderphilia',
    description: 'Explore the best Singapore tour packages with Wanderphilia.',
    url: 'https://wanderphilia.com/trips/singapore',
    type: 'website',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
