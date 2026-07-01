import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Peru Tour Packages | Group Trips & Customized Tours | Wanderphilia',
  description: 'Explore the best Peru tour packages with Wanderphilia. Book standard or customized trips, honeymoon packages, and group tours to Peru.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/peru',
  },
  openGraph: {
    title: 'Peru Tour Packages | Wanderphilia',
    description: 'Explore the best Peru tour packages with Wanderphilia.',
    url: 'https://wanderphilia.com/trips/peru',
    type: 'website',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
