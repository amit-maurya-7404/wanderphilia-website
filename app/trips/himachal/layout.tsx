import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Himachal Tour Packages | Group Trips & Customized Tours | Wanderphilia',
  description: 'Explore the best Himachal tour packages with Wanderphilia. Book standard or customized trips, honeymoon packages, and group tours to Himachal.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/himachal',
  },
  openGraph: {
    title: 'Himachal Tour Packages | Wanderphilia',
    description: 'Explore the best Himachal tour packages with Wanderphilia.',
    url: 'https://wanderphilia.com/trips/himachal',
    type: 'website',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
