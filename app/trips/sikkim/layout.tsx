import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sikkim Tour Packages | Wanderphilia',
  description: 'Experience the magic of Sikkim with Wanderphilia. Book your Sikkim group trips and customized tours today.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/sikkim',
  },
  openGraph: {
    title: 'Sikkim Tour Packages | Wanderphilia',
    description: 'Experience the magic of Sikkim with Wanderphilia.',
    url: 'https://wanderphilia.com/trips/sikkim',
    type: 'website',
  }
}

export default function SikkimLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
