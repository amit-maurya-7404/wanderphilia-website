import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sri Lanka Tour Packages 2026 | Group & Customised Trips | Wanderphilia',
  description: 'Book best Sri Lanka tour packages for 2026. Explore Sigiriya, Kandy, Ella, Nuwara Eliya, Yala Safari, Mirissa & Bentota with Wanderphilia.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/sri-lanka',
  },
  openGraph: {
    title: 'Sri Lanka Tour Packages 2026 | Group & Customised Trips | Wanderphilia',
    description: 'Book best Sri Lanka tour packages for 2026. Explore Sigiriya, Kandy, Ella, Nuwara Eliya, Yala Safari, Mirissa & Bentota with Wanderphilia.',
    url: 'https://wanderphilia.com/trips/sri-lanka',
    type: 'website',
    images: [
      {
        url: 'https://wanderphilia.com/images/srilanka/hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Sri Lanka Tour Packages Wanderphilia'
      }
    ]
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
