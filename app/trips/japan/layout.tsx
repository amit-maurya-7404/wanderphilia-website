import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Japan Tour Packages | Group Trips & Customized Tours | Wanderphilia',
  description: 'Explore the best Japan tour packages with Wanderphilia. Book standard or customized trips, honeymoon packages, and group tours to Japan.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/japan',
  },
  openGraph: {
    title: 'Japan Tour Packages | Wanderphilia',
    description: 'Explore the best Japan tour packages with Wanderphilia.',
    url: 'https://wanderphilia.com/trips/japan',
    type: 'website',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
