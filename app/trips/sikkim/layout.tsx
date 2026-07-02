import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sikkim Tour Packages | Gangtok & North Sikkim Group Trips | Wanderphilia',
  description: 'Discover the pristine beauty of Northeast India with Sikkim tour packages. Curated trips to Gangtok, Nathula Pass, Lachen, Lachung, and Gurudongmar Lake.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/sikkim',
  },
  openGraph: {
    title: 'Sikkim Tour Packages | Gangtok & North Sikkim Group Trips | Wanderphilia',
    description: 'Discover the pristine beauty of Northeast India with Sikkim tour packages. Curated trips to Gangtok, Nathula Pass, Lachen, Lachung, and Gurudongmar Lake.',
    url: 'https://wanderphilia.com/trips/sikkim',
    type: 'website',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
