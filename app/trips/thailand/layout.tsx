import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thailand Tour Packages | Group Trips & Customized Tours | Wanderphilia',
  description: 'Explore the best Thailand tour packages with Wanderphilia. Book standard or customized trips, honeymoon packages, and group tours to Thailand.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/thailand',
  },
  openGraph: {
    title: 'Thailand Tour Packages | Wanderphilia',
    description: 'Explore the best Thailand tour packages with Wanderphilia.',
    url: 'https://wanderphilia.com/trips/thailand',
    type: 'website',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
