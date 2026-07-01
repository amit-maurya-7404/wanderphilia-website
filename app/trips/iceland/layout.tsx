import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Iceland Tour Packages | Group Trips & Customized Tours | Wanderphilia',
  description: 'Explore the best Iceland tour packages with Wanderphilia. Book standard or customized trips, honeymoon packages, and group tours to Iceland.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/iceland',
  },
  openGraph: {
    title: 'Iceland Tour Packages | Wanderphilia',
    description: 'Explore the best Iceland tour packages with Wanderphilia.',
    url: 'https://wanderphilia.com/trips/iceland',
    type: 'website',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
