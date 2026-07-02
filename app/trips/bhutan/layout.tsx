import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bhutan Tour Packages | Bhutan Group & Customised Trips | Wanderphilia',
  description: 'Explore the land of happiness with Bhutan tour packages from Wanderphilia. Handcrafted itineraries for group tours and custom packages to Thimphu, Paro, and Punakha.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/bhutan',
  },
  openGraph: {
    title: 'Bhutan Tour Packages | Bhutan Group & Customised Trips | Wanderphilia',
    description: 'Explore the land of happiness with Bhutan tour packages from Wanderphilia. Handcrafted itineraries for group tours and custom packages to Thimphu, Paro, and Punakha.',
    url: 'https://wanderphilia.com/trips/bhutan',
    type: 'website',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
