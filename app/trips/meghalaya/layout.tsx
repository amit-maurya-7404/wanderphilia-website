import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Meghalaya Tour Packages 2026 | Shillong, Cherrapunji, Dawki Group & Custom Trips | Wanderphilia',
  description: 'Explore the Abode of Clouds with Wanderphilia. Curated Meghalaya tour packages covering Shillong, Cherrapunji, Dawki crystal clear Umngot river, Double Decker Living Root Bridges, Krang Shuri, and Mawlynnong.',
  alternates: {
    canonical: 'https://wanderphilia.com/trips/meghalaya',
  },
  openGraph: {
    title: 'Meghalaya Tour Packages 2026 | Shillong, Cherrapunji, Dawki Group & Custom Trips | Wanderphilia',
    description: 'Explore the Abode of Clouds with Wanderphilia. Curated Meghalaya tour packages covering Shillong, Cherrapunji, Dawki crystal clear Umngot river, Double Decker Living Root Bridges, Krang Shuri, and Mawlynnong.',
    url: 'https://wanderphilia.com/trips/meghalaya',
    type: 'website',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

