import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Singapore Tour Packages | Family Holidays & Custom Trips | Wanderphilia',
  description: 'Book modern Singapore tour packages with Wanderphilia. Perfect itineraries for family holidays, Singapore fly-cruise packages, Sentosa, and Universal Studios.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/singapore',
  },
  openGraph: {
    title: 'Singapore Tour Packages | Family Holidays & Custom Trips | Wanderphilia',
    description: 'Book modern Singapore tour packages with Wanderphilia. Perfect itineraries for family holidays, Singapore fly-cruise packages, Sentosa, and Universal Studios.',
    url: 'https://wanderphilia.com/trips/singapore',
    type: 'website',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
