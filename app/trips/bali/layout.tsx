import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bali Tour Packages | Group Trips & Customized Tours | Wanderphilia',
  description: 'Explore the best Bali tour packages with Wanderphilia. Book standard or customized trips, honeymoon packages, and group tours to Bali.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/bali',
  },
  openGraph: {
    title: 'Bali Tour Packages | Wanderphilia',
    description: 'Explore the best Bali tour packages with Wanderphilia.',
    url: 'https://wanderphilia.com/trips/bali',
    type: 'website',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
