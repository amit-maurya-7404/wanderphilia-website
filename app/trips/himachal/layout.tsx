import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Himachal Tour Packages | Wanderphilia',
  description: 'Book the best Himachal Pradesh tour packages with Wanderphilia. Explore Manali, Kasol, Jibhi, Shimla, and more with our curated group trips.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/himachal',
  },
  openGraph: {
    title: 'Himachal Tour Packages | Wanderphilia',
    description: 'Book the best Himachal Pradesh tour packages with Wanderphilia.',
    url: 'https://wanderphilia.com/trips/himachal',
    type: 'website',
  }
}

export default function HimachalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
