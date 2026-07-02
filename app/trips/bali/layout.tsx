import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bali Tour Packages 2026 | Group & Customised Trips | Wanderphilia',
  description: 'Book best Bali tour packages for 2026. Explore group & customised trips to Ubud, Nusa Dua, Seminyak, Kuta, Gili and Nusa Penida with Wanderphilia.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/bali',
  },
  openGraph: {
    title: 'Bali Tour Packages 2026 | Group & Customised Trips | Wanderphilia',
    description: 'Book best Bali tour packages for 2026. Explore group & customised trips to Ubud, Nusa Dua, Seminyak, Kuta, Gili and Nusa Penida with Wanderphilia.',
    url: 'https://wanderphilia.com/trips/bali',
    type: 'website',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
