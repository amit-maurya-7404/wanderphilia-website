import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kashmir Tour Packages | Group Trips & Customized Tours | Wanderphilia',
  description: 'Explore the best Kashmir tour packages with Wanderphilia. Book standard or customized trips, honeymoon packages, and group tours to Kashmir.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/kashmir',
  },
  openGraph: {
    title: 'Kashmir Tour Packages | Wanderphilia',
    description: 'Explore the best Kashmir tour packages with Wanderphilia.',
    url: 'https://wanderphilia.com/trips/kashmir',
    type: 'website',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
