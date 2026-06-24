import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thailand Tour Packages | Wanderphilia',
  description: 'Experience the magic of Thailand with Wanderphilia. Book your Thailand group trips and customized tours today.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/thailand',
  },
  openGraph: {
    title: 'Thailand Tour Packages | Wanderphilia',
    description: 'Experience the magic of Thailand with Wanderphilia.',
    url: 'https://wanderphilia.com/trips/thailand',
    type: 'website',
  }
}

export default function ThailandLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
