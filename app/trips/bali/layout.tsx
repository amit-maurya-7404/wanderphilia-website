import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bali Tour Packages | Wanderphilia',
  description: 'Experience the magic of Bali with Wanderphilia. Book your Bali group trips and customized tours today.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/bali',
  },
  openGraph: {
    title: 'Bali Tour Packages | Wanderphilia',
    description: 'Experience the magic of Bali with Wanderphilia.',
    url: 'https://wanderphilia.com/trips/bali',
    type: 'website',
  }
}

export default function BaliLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
