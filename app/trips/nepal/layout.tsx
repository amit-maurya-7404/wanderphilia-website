import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nepal Tour Packages | Group Trips & Customized Tours | Wanderphilia',
  description: 'Explore the best Nepal tour packages with Wanderphilia. Book standard or customized trips, honeymoon packages, and group tours to Nepal.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/nepal',
  },
  openGraph: {
    title: 'Nepal Tour Packages | Wanderphilia',
    description: 'Explore the best Nepal tour packages with Wanderphilia.',
    url: 'https://wanderphilia.com/trips/nepal',
    type: 'website',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
