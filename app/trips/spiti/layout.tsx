import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Spiti Valley Tour Packages | Spiti Group & Bike Trips | Wanderphilia',
  description: 'Join thrilling Spiti Valley tour packages from Delhi. Experience high-altitude monasteries, Kaza, Key Monastery, Hikkim, and Pin Valley with Wanderphilia.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/spiti',
  },
  openGraph: {
    title: 'Spiti Valley Tour Packages | Spiti Group & Bike Trips | Wanderphilia',
    description: 'Join thrilling Spiti Valley tour packages from Delhi. Experience high-altitude monasteries, Kaza, Key Monastery, Hikkim, and Pin Valley with Wanderphilia.',
    url: 'https://wanderphilia.com/trips/spiti',
    type: 'website',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
