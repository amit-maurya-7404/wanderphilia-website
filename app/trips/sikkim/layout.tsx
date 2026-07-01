import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sikkim Tour Packages | Group Trips & Customized Tours | Wanderphilia',
  description: 'Explore the best Sikkim tour packages with Wanderphilia. Book standard or customized trips, honeymoon packages, and group tours to Sikkim.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/sikkim',
  },
  openGraph: {
    title: 'Sikkim Tour Packages | Wanderphilia',
    description: 'Explore the best Sikkim tour packages with Wanderphilia.',
    url: 'https://wanderphilia.com/trips/sikkim',
    type: 'website',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
