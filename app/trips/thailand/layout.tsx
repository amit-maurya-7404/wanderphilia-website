import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thailand Tour Packages | Bangkok, Phuket & Krabi Trips | Wanderphilia',
  description: 'Book exciting Thailand tour packages with Wanderphilia. Curated group tours and romantic custom packages covering Bangkok, Phuket, Krabi, and Phi Phi Islands.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/thailand',
  },
  openGraph: {
    title: 'Thailand Tour Packages | Bangkok, Phuket & Krabi Trips | Wanderphilia',
    description: 'Book exciting Thailand tour packages with Wanderphilia. Curated group tours and romantic custom packages covering Bangkok, Phuket, Krabi, and Phi Phi Islands.',
    url: 'https://wanderphilia.com/trips/thailand',
    type: 'website',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
