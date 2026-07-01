import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bhutan Tour Packages | Group Trips & Customized Tours | Wanderphilia',
  description: 'Explore the best Bhutan tour packages with Wanderphilia. Book standard or customized trips, honeymoon packages, and group tours to Bhutan.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/bhutan',
  },
  openGraph: {
    title: 'Bhutan Tour Packages | Wanderphilia',
    description: 'Explore the best Bhutan tour packages with Wanderphilia.',
    url: 'https://wanderphilia.com/trips/bhutan',
    type: 'website',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
