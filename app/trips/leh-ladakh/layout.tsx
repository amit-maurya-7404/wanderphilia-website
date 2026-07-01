import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Leh Ladakh Tour Packages | Group Trips & Customized Tours | Wanderphilia',
  description: 'Explore the best Leh Ladakh tour packages with Wanderphilia. Book standard or customized trips, honeymoon packages, and group tours to Leh Ladakh.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/leh-ladakh',
  },
  openGraph: {
    title: 'Leh Ladakh Tour Packages | Wanderphilia',
    description: 'Explore the best Leh Ladakh tour packages with Wanderphilia.',
    url: 'https://wanderphilia.com/trips/leh-ladakh',
    type: 'website',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
