import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Switzerland Tour Packages | Group Trips & Customized Tours | Wanderphilia',
  description: 'Explore the best Switzerland tour packages with Wanderphilia. Book standard or customized trips, honeymoon packages, and group tours to Switzerland.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/switzerland',
  },
  openGraph: {
    title: 'Switzerland Tour Packages | Wanderphilia',
    description: 'Explore the best Switzerland tour packages with Wanderphilia.',
    url: 'https://wanderphilia.com/trips/switzerland',
    type: 'website',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
