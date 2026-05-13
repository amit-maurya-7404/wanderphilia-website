import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kashmir Tour Packages | Paradise on Earth | Wanderphilia',
  description: 'Experience the magic of Kashmir with Wanderphilia. Book your Srinagar, Gulmarg, and Pahalgam group trips and customized tours today.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/kashmir',
  },
  openGraph: {
    title: 'Kashmir Tour Packages | Wanderphilia',
    description: 'Experience the magic of Kashmir with Wanderphilia.',
    url: 'https://wanderphilia.com/trips/kashmir',
    type: 'website',
  }
}

export default function KashmirLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
