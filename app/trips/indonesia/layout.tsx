import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Indonesia Tour Packages | Group Trips & Customized Tours | Wanderphilia',
  description: 'Explore the best Indonesia tour packages with Wanderphilia. Book standard or customized trips, honeymoon packages, and group tours to Indonesia.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/indonesia',
  },
  openGraph: {
    title: 'Indonesia Tour Packages | Wanderphilia',
    description: 'Explore the best Indonesia tour packages with Wanderphilia.',
    url: 'https://wanderphilia.com/trips/indonesia',
    type: 'website',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
